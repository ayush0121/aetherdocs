import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import * as bcrypt from "bcryptjs"
import { db } from "@/lib/db"

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
})

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                try {
                    const { email, password } = await loginSchema.parseAsync(credentials)

                    const user = await db.user.findUnique({
                        where: { email }
                    })

                    if (!user) return null

                    const passwordsMatch = await bcrypt.compare(password, user.password)

                    if (passwordsMatch) return user
                    return null
                } catch (e) {
                    console.error("Auth Error:", e)
                    return null
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub as string
            }
            return session
        }
    }
})
