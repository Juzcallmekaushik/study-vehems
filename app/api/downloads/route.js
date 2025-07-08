import { createServerSupabaseClient } from '../../../lib/supabaseServer';
import { getServerSession } from 'next-auth/next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

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
};

export async function GET() {
  return new Response(JSON.stringify({ message: 'Download API is working' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { filename } = await request.json()
    
    if (!filename) {
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

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('username')
      .eq('email', session.user.email)
      .single()

    let username;

    if (userError || !userData) {      
      if (userError?.code === 'PGRST116') {
        const defaultUsername = session.user.email.split('@')[0]
        
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            email: session.user.email,
            username: defaultUsername,
            name: session.user.name || defaultUsername
          })
          .select('username')
          .single()
        
        if (createError) {
          console.error('Failed to create new user:', createError)
          return new Response(JSON.stringify({ 
            error: 'Failed to create user record',
            details: createError.message
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }
        
        username = newUser.username
      } else {
        console.error('Database error during user lookup:', userError)
        return new Response(JSON.stringify({ 
          error: 'Database error during user lookup',
          details: userError?.message || 'Unknown error'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    } else {
      username = userData.username
    }

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
        .eq('title', filename)
        .single()

      if (noteError || !noteData) {
        console.error('File not found in notes table:', noteError)
        
        const { data: similarFiles, error: searchError } = await supabase
          .from('notes')
          .select('filename')
          .ilike('filename', `%${filename.split(' ').slice(0, 3).join(' ')}%`)
          .limit(5)
        
        if (!searchError && similarFiles?.length > 0) {
        }
        
        return new Response(JSON.stringify({ 
          error: 'File URL not found for this filename',
          filename: filename,
          suggestion: 'Please check if the filename exists in the notes database'
        }), {
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
