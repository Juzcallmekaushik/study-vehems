import { createServerSupabaseClient } from '../../../lib/supabaseServer'
import { getServerSession } from 'next-auth/next'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const downloadCache = new Map();
const RATE_LIMIT_WINDOW = 5000;

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function GET() {
  return new Response(JSON.stringify({ message: 'Download API is working' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function POST(request) {
  console.log('Download tracking POST request received')
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      console.log('Unauthorized access attempt')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { filename } = await request.json()
    console.log('Tracking download for filename:', filename)
    
    if (!filename) {
      console.log('No filename provided in request')
      return new Response(JSON.stringify({ error: 'Filename is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const cacheKey = `${session.user.email}:${filename}`;
    const now = Date.now();
    const lastDownload = downloadCache.get(cacheKey);

    if (lastDownload && (now - lastDownload) < RATE_LIMIT_WINDOW) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait before downloading again.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    downloadCache.set(cacheKey, now);

    if (downloadCache.size > 1000) {
      const cutoff = now - RATE_LIMIT_WINDOW;
      for (const [key, timestamp] of downloadCache.entries()) {
        if (timestamp < cutoff) {
          downloadCache.delete(key);
        }
      }
    }

    const supabase = createServerSupabaseClient()
    console.log('Supabase client created successfully')

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('username')
      .eq('email', session.user.email)
      .single()

    if (userError || !userData) {
      console.error('User lookup failed:', userError)
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const username = userData.username

    const { data: usernameRecord, error: usernameSelectError } = await supabase
      .from('downloads')
      .select('downloads')
      .eq('username', username)
      .is('filename', null)
      .single()

    if (usernameSelectError && usernameSelectError.code !== 'PGRST116') {
      console.error('Error checking username record:', usernameSelectError)
    }

    if (usernameRecord) {
      const { error: usernameUpdateError } = await supabase
        .from('downloads')
        .update({ downloads: usernameRecord.downloads + 1 })
        .eq('username', username)
        .is('filename', null)
      
      if (usernameUpdateError) {
        console.error('Error updating username downloads:', usernameUpdateError)
        return new Response(JSON.stringify({ error: 'Failed to update user download count' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    } else {
      const { error: usernameInsertError } = await supabase
        .from('downloads')
        .insert({
          username: username,
          email: session.user.email,
          downloads: 1
        })
      
      if (usernameInsertError) {
        console.error('Error inserting username downloads:', usernameInsertError)
        return new Response(JSON.stringify({ error: 'Failed to create user download record' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    const { data: filenameRecord, error: filenameSelectError } = await supabase
      .from('downloads')
      .select('downloads')
      .eq('filename', filename)
      .is('username', null)
      .single()

    if (filenameSelectError && filenameSelectError.code !== 'PGRST116') {
      console.error('Error checking filename record:', filenameSelectError)
    }

    if (filenameRecord) {
      const { error: filenameUpdateError } = await supabase
        .from('downloads')
        .update({ downloads: filenameRecord.downloads + 1 })
        .eq('filename', filename)
        .is('username', null)
      
      if (filenameUpdateError) {
        console.error('Error updating filename downloads:', filenameUpdateError)
        return new Response(JSON.stringify({ error: 'Failed to update file download count' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    } else {
      const { data: noteData, error: noteError } = await supabase
        .from('notes')
        .select('file_url')
        .eq('filename', filename)
        .single()

      if (noteError || !noteData) {
        return new Response(JSON.stringify({ error: 'File URL not found for this filename' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const { error: filenameInsertError } = await supabase
        .from('downloads')
        .insert({
          filename: filename,
          file_url: noteData.file_url,
          downloads: 1
        })
      
      if (filenameInsertError) {
        console.error('Error inserting filename downloads:', filenameInsertError)
        return new Response(JSON.stringify({ error: 'Failed to create file download record' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error tracking download:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
