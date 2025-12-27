import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Construction } from "lucide-react"
import Link from "next/link"

interface PlaceholderToolProps {
    title: string
    description: string
}

export function PlaceholderTool({ title, description }: PlaceholderToolProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="container mx-auto py-20 px-4">
                <Button variant="ghost" className="mb-8" asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>

                <div className="flex items-center justify-center">
                    <Card className="w-full max-w-lg text-center">
                        <CardHeader>
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Construction className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">{title}</CardTitle>
                            <CardDescription className="text-lg mt-2">{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-slate-600">
                                This tool is currently under development. We are working hard to bring this feature to you soon!
                            </p>
                            <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                                Feature Parity Check: UI Card is present, but client-side logic is pending.
                            </div>
                            <Button asChild className="w-full">
                                <Link href="/">Explore Other Tools</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
