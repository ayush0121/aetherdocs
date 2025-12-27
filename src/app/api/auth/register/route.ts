import { NextResponse } from "next/server"
import { z } from "zod"
import * as bcrypt from "bcryptjs"
import { db } from "@/lib/db"

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, name } = await registerSchema.parseAsync(body)

        const existingUser = await db.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        })

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json(userWithoutPassword)
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            const message = (error as any).errors?.[0]?.message || (error as any).issues?.[0]?.message || "Invalid input"
            return NextResponse.json({ error: message }, { status: 400 })
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
