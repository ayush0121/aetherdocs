"use client"

import { useState } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { unlockPdf, downloadPdf } from "@/lib/pdf-utils"
import { Loader2, Unlock, Download, Trash2, KeyRound } from "lucide-react"

export default function UnlockPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [password, setPassword] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState("")

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0])
            setError("")
        }
    }

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !password) return

        setIsProcessing(true)
        setError("")
        try {
            const unlockedPdfBytes = await unlockPdf(file, password)
            downloadPdf(unlockedPdfBytes, `unlocked-${file.name}`)
        } catch (err) {
            console.error("Failed to unlock PDF", err)
            setError("Incorrect password or failed to unlock. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleRemoveFile = () => {
        setFile(null)
        setPassword("")
        setError("")
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Unlock PDF File</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Remove password security from your PDF to make it freely usable.
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
                                    <KeyRound className="w-5 h-5 text-pink-600" />
                                    Enter Password
                                </CardTitle>
                                <CardDescription>
                                    Input the current password to unlock <strong>{file.name}</strong>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUnlock} className="space-y-4">
                                    {error && (
                                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                                            {error}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Current Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button type="button" variant="outline" onClick={handleRemoveFile} className="flex-1">
                                            <Trash2 className="w-4 h-4 mr-2" /> Cancel
                                        </Button>
                                        <Button type="submit" disabled={isProcessing} className="flex-1 bg-pink-600 hover:bg-pink-700">
                                            {isProcessing ? (
                                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Unlocking...</>
                                            ) : (
                                                <><Unlock className="w-4 h-4 mr-2" /> Unlock PDF</>
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
