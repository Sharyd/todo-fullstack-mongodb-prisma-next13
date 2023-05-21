import bcrypt from 'bcrypt'
import NextAuth, {
    AuthOptions,
    DefaultSession,
    Session,
    TokenSet,
} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import prisma from '@/app/utils/prismadb'
import { JWT } from 'next-auth/jwt'
import { AdapterUser } from 'next-auth/adapters'
import { Token } from 'typescript'
import { loggedUserType } from '@/app/utils/types'

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    const error: any = new Error('Credentials invalid')
                    error.statusCode = 400
                    throw error
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                })

                if (!user || !user?.hashedPassword) {
                    const error: any = new Error('Credentials invalid')
                    error.statusCode = 400
                    throw error
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                )

                if (!isCorrectPassword) {
                    const error: any = new Error('Invalid credentials')
                    error.statusCode = 401
                    throw error
                }

                return user
            },
        }),
    ],

    pages: {
        signIn: '/login',
    },
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    callbacks: {
        async session(params: {
            session: Session
            token: JWT
            user: loggedUserType | AdapterUser
        }): Promise<Session | DefaultSession> {
            const session = params.session
            const token = params.token
            const userId = token?.sub
            const userInfo = session.user

            const updatedUser: loggedUserType = {
                ...userInfo,
                userId,
            }

            return Promise.resolve({
                ...session,
                ...token,
                user: updatedUser,
            })
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
