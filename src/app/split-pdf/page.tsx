"use client"

import { useState } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { splitPdf, getPdfPageCount } from "@/lib/pdf-actions"
import { downloadPdf } from "@/lib/pdf-utils"
import { PdfPagePreview } from "@/components/pdf-preview"
import { ArrowRight, Loader2, RotateCw } from "lucide-react"

export default function SplitPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [pageCount, setPageCount] = useState(0)
    const [selectedPages, setSelectedPages] = useState<number[]>([]) // 0-based indices
    const [isProcessing, setIsProcessing] = useState(false)
    const [isLoadingPreview, setIsLoadingPreview] = useState(false)

    const handleFilesSelected = async (newFiles: File[]) => {
        if (newFiles.length > 0) {
            const f = newFiles[0]
            setFile(f)
            setIsLoadingPreview(true)
            try {
                const count = await getPdfPageCount(f)
                setPageCount(count)
                // Select all by default or none? Let's select none to let them choose
                setSelectedPages([])
            } catch (e) {
                console.error(e)
                alert("Invalid PDF file")
            } finally {
                setIsLoadingPreview(false)
            }
        }
    }

    const togglePageSelection = (index: number) => {
        setSelectedPages(prev => {
            if (prev.includes(index)) {
                return prev.filter(p => p !== index)
            } else {
                return [...prev, index].sort((a, b) => a - b)
            }
        })
    }

    const handleSplit = async () => {
        if (!file || selectedPages.length === 0) return

        setIsProcessing(true)
        try {
            const splitPdfBytes = await splitPdf(file, selectedPages)
            downloadPdf(splitPdfBytes, "split-document.pdf")
        } catch (error) {
            console.error("Failed to split PDF", error)
            alert("Error splitting PDF.")
        } finally {
            setIsProcessing(false)
        }
    }

    const reset = () => {
        setFile(null)
        setPageCount(0)
        setSelectedPages([])
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Split PDF file</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Select pages to extract into a new PDF document.
                    </p>
                </div>

                {!file ? (
                    <div className="max-w-2xl mx-auto">
                        <FileUploader onFilesSelected={handleFilesSelected} multiple={false} />
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto flex flex-col items-center">

                        <div className="w-full flex justify-between items-center mb-6">
                            <Button variant="ghost" onClick={reset}>← Upload another file</Button>
                            <div className="text-slate-500">
                                <span className="font-bold text-slate-900">{selectedPages.length}</span> pages selected
                            </div>
                        </div>

                        <div className="w-full bg-slate-200/50 p-6 rounded-xl border border-slate-200 mb-20">
                            {isLoadingPreview ? (
                                <div className="flex justify-center p-12">
                                    <Loader2 className="animate-spin w-8 h-8 text-slate-400" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {Array.from({ length: pageCount }).map((_, idx) => (
                                        <div key={idx} className="flex flex-col items-center">
                                            <PdfPagePreview
                                                file={file}
                                                pageIndex={idx}
                                                selected={selectedPages.includes(idx)}
                                                onSelect={() => togglePageSelection(idx)}
                                                className="w-full shadow-md"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-40 flex justify-center shadow-2xl">
                            <Button
                                onClick={handleSplit}
                                size="lg"
                                className="w-full max-w-md h-12 text-lg"
                                disabled={isProcessing || selectedPages.length === 0}
                            >
                                {isProcessing ? "Processing..." : `Split PDF (${selectedPages.length} pages)`}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
