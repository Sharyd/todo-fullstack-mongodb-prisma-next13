import bcrypt from 'bcrypt'
import NextAuth, {
    AuthOptions,
    DefaultSession,
    Session,
    TokenSet,
    User,
} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import prisma from '@/app/utils/prismadb'
import { JWT } from 'next-auth/jwt'
import { AdapterUser } from 'next-auth/adapters'
import { loggedUserType } from '@/app/utils/types'

interface ExtendedUser extends User {
    userId: string
}
interface SessionWithUserId extends Session {
    user?: ExtendedUser
}

interface MySession extends DefaultSession {
    user?: any
}

interface MyJWT extends JWT {
    userId?: string
}

interface MyUser extends User {
    userId?: string
}

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
            session: MySession
            token: JWT
            user: loggedUserType | AdapterUser
        }): Promise<SessionWithUserId | DefaultSession> {
            const session = params.session
            const token = params.token
            const userId = token?.sub
            const userInfo = session.user
            const updatedUser: ExtendedUser = {
                ...(userInfo as ExtendedUser),
                userId: userId as string,
            }
            const user = await prisma.user.findUnique({
                where: { id: token.sub },
                include: { accounts: true },
            })

            const provider = user?.accounts.map((account) => account.provider)
            return Promise.resolve({
                ...session,
                ...token,
                user: updatedUser,
                providerName: provider,
            }) as Promise<MySession | DefaultSession>
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
