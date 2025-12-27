"use client"

import { useState } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { protectPdf, downloadPdf } from "@/lib/pdf-utils"
import { Loader2, Lock, Download, Trash2, ShieldCheck } from "lucide-react"

export default function ProtectPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [password, setPassword] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) setFile(files[0])
    }

    const handleProtect = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !password) return

        setIsProcessing(true)
        try {
            const protectedPdfBytes = await protectPdf(file, password)
            downloadPdf(protectedPdfBytes, `protected-${file.name}`)
        } catch (error) {
            console.error("Failed to protect PDF", error)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleRemoveFile = () => {
        setFile(null)
        setPassword("")
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Protect PDF File</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Encrypt your PDF with a password to prevent unauthorized access.
                    </p>
                </div>

                {!file ? (
                    <div className="max-w-xl mx-auto">
                        <FileUploader onFilesSelected={handleFileSelected} />
                    </div>
                ) : (
                    <div className="max-w-md mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-sky-600" />
                                    Set Password
                                </CardTitle>
                                <CardDescription>
                                    Enter a strong password to protect <strong>{file.name}</strong>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProtect} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={4}
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button type="button" variant="outline" onClick={handleRemoveFile} className="flex-1">
                                            <Trash2 className="w-4 h-4 mr-2" /> Cancel
                                        </Button>
                                        <Button type="submit" disabled={isProcessing} className="flex-1 bg-sky-600 hover:bg-sky-700">
                                            {isProcessing ? (
                                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Encrypting...</>
                                            ) : (
                                                <><Lock className="w-4 h-4 mr-2" /> Protect PDF</>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
