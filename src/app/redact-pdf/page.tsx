"use client"

import { useState, useRef } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { redactPdf } from "@/lib/pdf-redact"
import { downloadPdf } from "@/lib/pdf-utils"
import { PdfPagePreview } from "@/components/pdf-preview"
import { ArrowRight, Loader2, Eraser, MousePointer2 } from "lucide-react"

interface RedactionRect {
    x: number
    y: number
    width: number
    height: number
    pageIndex: number
}

export default function RedactPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [selectedPage, setSelectedPage] = useState(0)
    const [redactions, setRedactions] = useState<RedactionRect[]>([])
    const [isDrawing, setIsDrawing] = useState(false)
    const [startPos, setStartPos] = useState({ x: 0, y: 0 })
    const [currentRect, setCurrentRect] = useState<Partial<RedactionRect> | null>(null)

    // For MVP, we use a fixed container size to simplify coordinate mapping
    // Ideally this would be responsive with ResizeObservers
    const CONTAINER_WIDTH = 600
    const CONTAINER_HEIGHT = 800 // A4 Aspect ratio approx

    const handleFilesSelected = (newFiles: File[]) => {
        if (newFiles.length > 0) setFile(newFiles[0])
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setIsDrawing(true)
        setStartPos({ x, y })
        setCurrentRect({ x, y, width: 0, height: 0, pageIndex: selectedPage })
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrawing) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const width = x - startPos.x
        const height = y - startPos.y

        setCurrentRect({
            x: width > 0 ? startPos.x : x,
            y: height > 0 ? startPos.y : y,
            width: Math.abs(width),
            height: Math.abs(height),
            pageIndex: selectedPage
        })
    }

    const handleMouseUp = () => {
        if (isDrawing && currentRect && currentRect.width && currentRect.width > 5) {
            setRedactions([...redactions, currentRect as RedactionRect])
        }
        setIsDrawing(false)
        setCurrentRect(null)
    }

    const handleRedact = async () => {
        if (!file || redactions.length === 0) return
        setIsProcessing(true)
        try {
            // Need to map DOM rects to PDF coordinates
            // Assuming PDF is standard A4 (595 x 842 points) and we scaled to fit container
            // This is a rough estimation for MVP demo
            const PDF_WIDTH = 595
            const PDF_HEIGHT = 842

            const scaleX = PDF_WIDTH / CONTAINER_WIDTH
            const scaleY = PDF_HEIGHT / CONTAINER_HEIGHT

            const mappedRedactions = redactions.map(r => ({
                pageIndex: r.pageIndex,
                x: r.x * scaleX,
                // In PDF-lib, Y starts from bottom, but DOM starts from top
                y: PDF_HEIGHT - (r.y * scaleY) - (r.height * scaleY),
                width: r.width * scaleX,
                height: r.height * scaleY
            }))

            const redactedPdf = await redactPdf(file, mappedRedactions)
            downloadPdf(redactedPdf, "redacted-document.pdf")
        } catch (e) {
            console.error(e)
            alert("Error applying redactions.")
        } finally {
            setIsProcessing(false)
        }
    }

    const undoLast = () => {
        setRedactions(prev => prev.slice(0, -1))
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Redact PDF</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Permanently remove sensitive information from your PDF.
                    </p>
                </div>

                {!file ? (
                    <div className="max-w-2xl mx-auto">
                        <FileUploader onFilesSelected={handleFilesSelected} multiple={false} />
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                        <div className="flex-1 flex justify-center">
                            <div
                                className="relative border-2 border-slate-300 bg-white shadow-lg cursor-crosshair select-none"
                                style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                <PdfPagePreview
                                    file={file}
                                    pageIndex={selectedPage}
                                    // Make sure canvas fills container to match coordinates
                                    className="w-full h-full pointer-events-none"
                                />

                                {redactions.filter(r => r.pageIndex === selectedPage).map((r, i) => (
                                    <div
                                        key={i}
                                        className="absolute bg-black opacity-80"
                                        style={{
                                            left: r.x, top: r.y,
                                            width: r.width, height: r.height
                                        }}
                                    />
                                ))}

                                {currentRect && (
                                    <div
                                        className="absolute bg-black opacity-40 border border-red-500"
                                        style={{
                                            left: currentRect.x, top: currentRect.y,
                                            width: currentRect.width, height: currentRect.height
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-72 shrink-0 space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                                <div className="flex items-center gap-2 mb-2 font-semibold">
                                    <MousePointer2 className="w-5 h-5" /> Tools
                                </div>
                                <p className="text-sm text-slate-500">
                                    Click and drag on the document to draw redaction boxes.
                                </p>

                                <div className="space-y-2 pt-4 border-t">
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Redactions:</span>
                                        <span className="font-bold">{redactions.length}</span>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={undoLast} disabled={redactions.length === 0} className="w-full">
                                        Undo Last
                                    </Button>
                                </div>

                                <Button onClick={handleRedact} disabled={redactions.length === 0 || isProcessing} className="w-full h-12">
                                    {isProcessing ? (
                                        <><Loader2 className="animate-spin mr-2" /> Processing...</>
                                    ) : (
                                        <>Apply Redactions <ArrowRight className="ml-2" /></>
                                    )}
                                </Button>
                            </div>

                            <Button variant="ghost" className="w-full" onClick={() => setFile(null)}>Change File</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
