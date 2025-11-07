import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials')
            return null
          }

          console.log('Attempting login for:', credentials.email)

          const user = await prisma.adminUser.findUnique({
            where: { email: credentials.email },
          })

          if (!user) {
            console.log('User not found:', credentials.email)
            return null
          }

          console.log('User found, verifying password...')
          
          const isValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          )

          console.log('Password valid:', isValid)

          if (!isValid) {
            return null
          }

          // Update last login
          await prisma.adminUser.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          })

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
