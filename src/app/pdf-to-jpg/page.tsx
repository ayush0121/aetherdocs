"use client"

import { useState } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { pdfToImagesZip } from "@/lib/image-utils"
import { ArrowRight, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function PdfToJpgPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleFilesSelected = (newFiles: File[]) => {
        if (newFiles.length > 0) setFile(newFiles[0])
    }

    const handleConvert = async () => {
        if (!file) return
        setIsProcessing(true)
        try {
            const zipBlob = await pdfToImagesZip(file)
            const url = URL.createObjectURL(zipBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = "images.zip"
            link.click()
        } catch (e) {
            console.error(e)
            alert("Error converting PDF to images.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">PDF to JPG</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Convert each PDF page into a JPG or extract all images contained in a PDF.
                    </p>
                </div>

                {!file ? (
                    <div className="max-w-2xl mx-auto">
                        <FileUploader onFilesSelected={handleFilesSelected} multiple={false} />
                    </div>
                ) : (
                    <div className="max-w-xl mx-auto text-center">
                        <Card>
                            <CardContent className="p-8">
                                <p className="mb-6 font-medium text-lg">{file.name}</p>
                                <Button onClick={handleConvert} disabled={isProcessing} size="lg" className="w-full">
                                    {isProcessing ? (
                                        <><Loader2 className="animate-spin mr-2" /> Converting...</>
                                    ) : (
                                        <>Convert to JPG <ArrowRight className="ml-2" /></>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                        <Button variant="link" className="mt-4 text-slate-500" onClick={() => setFile(null)}>
                            Convert another PDF
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
