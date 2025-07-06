import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { createServerSupabaseClient } from '../../../../lib/supabaseServer'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log('Attempting to create Supabase client...')
        const supabase = createServerSupabaseClient()
        console.log('Supabase client created successfully')
        
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('username')
          .eq('email', user.email)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error checking existing user:', fetchError)
          return false
        }

        if (!existingUser) {
          const { error: userInsertError } = await supabase
            .from('users')
            .insert({
              username: user.name || user.email.split('@')[0],
              email: user.email
            });

          const { error: downloadsInsertError } = await supabase
            .from('downloads')
            .insert({
              username: user.name || user.email.split('@')[0],
              email: user.email,
              downloads: 0
            })

          if (userInsertError || downloadsInsertError) {
            console.error('Error inserting new user:', userInsertError || downloadsInsertError)
            return false
          }

          console.log('New user inserted successfully:', user.email)
        }

        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    },
    async session({ session, token }) {
      session.user.id = token.sub
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }