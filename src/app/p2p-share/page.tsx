"use client"

import { useState } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QRCodeSVG } from "qrcode.react"
import { Smartphone, Share2, Wifi, Copy, Check } from "lucide-react"

export default function P2PSharePage() {
    const [file, setFile] = useState<File | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleFilesSelected = (newFiles: File[]) => {
        if (newFiles.length > 0) {
            setFile(newFiles[0])
            // Generate a fake session ID for the demo
            setSessionId(Math.random().toString(36).substring(7))
        }
    }

    const shareUrl = sessionId ? `https://pdf.new/share/${sessionId}` : ""

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Share PDF P2P</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Securely share document directly between devices. No server upload.
                    </p>
                </div>

                {!file ? (
                    <div className="max-w-2xl mx-auto">
                        <FileUploader onFilesSelected={handleFilesSelected} multiple={false} />
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center">
                        <Card className="w-full max-w-md bg-white shadow-xl border-0 overflow-hidden relative">
                            {/* Decoration */}
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500" />

                            <CardContent className="p-8 text-center space-y-6">
                                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                                    <Wifi className="w-8 h-8" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{file.name}</h3>
                                    <p className="text-sm text-slate-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to share
                                    </p>
                                </div>

                                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-slate-200 inline-block">
                                    <QRCodeSVG value={shareUrl} size={200} />
                                </div>

                                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                    Scan this QR code with another device on the same network to download.
                                </p>

                                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg">
                                    <div className="flex-1 text-left text-xs text-slate-500 truncate px-2 font-mono">
                                        {shareUrl}
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 w-8 p-0">
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>

                                <div className="pt-4 border-t">
                                    <Button variant="outline" className="w-full" onClick={() => {
                                        setFile(null)
                                        setSessionId(null)
                                    }}>
                                        Share Another File
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
