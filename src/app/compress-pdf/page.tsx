"use client"

import { useState } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { compressPdf, downloadPdf } from "@/lib/pdf-utils"
import { Loader2, Minimize2, Download, Trash2, ArrowRight } from "lucide-react"

export default function CompressPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [compressionRatio, setCompressionRatio] = useState<string | null>(null)

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0])
            setCompressionRatio(null)
        }
    }

    const handleCompress = async () => {
        if (!file) return

        setIsProcessing(true)
        try {
            const compressedBytes = await compressPdf(file)
            const originalSize = file.size
            const newSize = compressedBytes.byteLength
            const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1)

            setCompressionRatio(`Reduced by ${savings}% (${(newSize / 1024).toFixed(1)} KB)`)
            downloadPdf(compressedBytes, `compressed-${file.name}`)
        } catch (err) {
            console.error("Failed to compress PDF", err)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleRemoveFile = () => {
        setFile(null)
        setCompressionRatio(null)
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Compress PDF</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Reduce the file size of your PDF documents without losing quality (Basic Optimization).
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
                                    <Minimize2 className="w-5 h-5 text-green-600" />
                                    Review & Compress
                                </CardTitle>
                                <CardDescription>
                                    Ready to optimize <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {compressionRatio && (
                                    <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md border border-green-200 text-center font-medium">
                                        Success! {compressionRatio}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <Button type="button" variant="outline" onClick={handleRemoveFile} className="flex-1">
                                        <Trash2 className="w-4 h-4 mr-2" /> Cancel
                                    </Button>
                                    <Button onClick={handleCompress} disabled={isProcessing} className="flex-1 bg-green-600 hover:bg-green-700">
                                        {isProcessing ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Compressing...</>
                                        ) : (
                                            <><Download className="w-4 h-4 mr-2" /> Compress PDF</>
                                        )}
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
