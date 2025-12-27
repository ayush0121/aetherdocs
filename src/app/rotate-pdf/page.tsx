"use client"

import { useState } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PdfPagePreview } from "@/components/pdf-preview"
import { rotatePdf, getPdfPageCount, downloadPdf } from "@/lib/pdf-utils"
import { Loader2, RotateCw, RotateCcw, Download, ArrowRight, Trash2 } from "lucide-react"

export default function RotatePdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [numPages, setNumPages] = useState<number>(0)
    const [rotations, setRotations] = useState<Record<number, number>>({}) // pageIndex -> rotation (0, 90, 180, 270)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleFileSelected = async (files: File[]) => {
        if (files.length > 0) {
            const selectedFile = files[0]
            setFile(selectedFile)
            const count = await getPdfPageCount(selectedFile)
            setNumPages(count)
            // Initialize rotations to 0
            const initialRotations: Record<number, number> = {}
            for (let i = 0; i < count; i++) initialRotations[i] = 0
            setRotations(initialRotations)
        }
    }

    const handleRotatePage = (index: number, direction: 'cw' | 'ccw') => {
        setRotations(prev => {
            const current = prev[index] || 0
            const delta = direction === 'cw' ? 90 : -90
            const next = (current + delta) % 360
            return { ...prev, [index]: next < 0 ? next + 360 : next }
        })
    }

    const handleRotateAll = (direction: 'cw' | 'ccw') => {
        setRotations(prev => {
            const nextRotations: Record<number, number> = {}
            const delta = direction === 'cw' ? 90 : -90
            for (let i = 0; i < numPages; i++) {
                const current = prev[i] || 0
                const next = (current + delta) % 360
                nextRotations[i] = next < 0 ? next + 360 : next
            }
            return nextRotations
        })
    }

    const handleDownload = async () => {
        if (!file) return
        setIsProcessing(true)
        try {
            // Convert rotations map to array
            const rotationArray = Object.entries(rotations).map(([pageIndex, rotation]) => ({
                pageIndex: parseInt(pageIndex),
                rotation
            }))

            const modifiedPdfBytes = await rotatePdf(file, rotationArray)
            downloadPdf(modifiedPdfBytes, `rotated-${file.name}`)
        } catch (error) {
            console.error("Failed to rotate PDF", error)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleRemoveFile = () => {
        setFile(null)
        setNumPages(0)
        setRotations({})
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Rotate PDF Files</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Rotate your PDF pages individually or all at once.
                    </p>
                </div>

                {!file ? (
                    <div className="max-w-xl mx-auto">
                        <FileUploader onFilesSelected={handleFileSelected} />
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto">
                        {/* Toolbar */}
                        <Card className="mb-8 sticky top-20 z-10 shadow-md">
                            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                                        {file.name}
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" onClick={() => handleRotateAll('ccw')}>
                                        <RotateCcw className="w-4 h-4 mr-2" /> Rotate All Left
                                    </Button>
                                    <Button variant="outline" onClick={() => handleRotateAll('cw')}>
                                        <RotateCw className="w-4 h-4 mr-2" /> Rotate All Right
                                    </Button>
                                </div>

                                <Button onClick={handleDownload} disabled={isProcessing} className="bg-indigo-600 hover:bg-indigo-700">
                                    {isProcessing ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                                    ) : (
                                        <><Download className="w-4 h-4 mr-2" /> Download PDF</>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Grid of Pages */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array.from({ length: numPages }).map((_, idx) => (
                                <div key={idx} className="flex flex-col gap-2 group">
                                    <div className="relative bg-white p-2 rounded-lg shadow-sm border transition-shadow hover:shadow-md">
                                        <div
                                            className="transition-transform duration-300 ease-in-out"
                                            style={{ transform: `rotate(${rotations[idx] || 0}deg)` }}
                                        >
                                            <PdfPagePreview file={file} pageIndex={idx} className="pointer-events-none" />
                                        </div>

                                        {/* Overlay Controls */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="rounded-full shadow-lg"
                                                onClick={() => handleRotatePage(idx, 'ccw')}
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="rounded-full shadow-lg"
                                                onClick={() => handleRotatePage(idx, 'cw')}
                                            >
                                                <RotateCw className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded pointer-events-none">
                                            Page {idx + 1}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
