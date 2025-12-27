import Link from "next/link"
import { Button } from "./ui/button"
import { FileText } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "./ui/dialog"
import { ArrowRight, Zap } from "lucide-react"
import { UserMenu } from "./user-menu"
import { auth } from "@/auth"

export async function Navbar() {
    const session = await auth()

    return (
        <nav className="border-b bg-white/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <FileText className="w-6 h-6" />
                    <span>AetherDocs</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
                        All Tools
                    </Link>

                    <UserMenu user={session?.user} />
                </div>
            </div>
        </nav >
    )
}
