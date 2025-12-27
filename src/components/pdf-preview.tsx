"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface PdfPagePreviewProps {
    file: File
    pageIndex: number
    scale?: number
    className?: string
    onSelect?: (selected: boolean) => void
    selected?: boolean
}

export function PdfPagePreview({
    file,
    pageIndex,
    scale = 1,
    className,
    onSelect,
    selected = false,
}: PdfPagePreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let active = true

        const loadPage = async () => {
            try {
                // Lazy load pdfjs-dist
                const pdfjsLib = await import("pdfjs-dist")
                if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
                    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`
                }

                const buffer = await file.arrayBuffer()
                const loadingTask = pdfjsLib.getDocument(buffer as any)
                const pdf = await loadingTask.promise

                if (pageIndex >= pdf.numPages) return

                const page = await pdf.getPage(pageIndex + 1) // 1-based index

                if (!active) return

                const viewport = page.getViewport({ scale })
                const canvas = canvasRef.current

                if (canvas) {
                    const context = canvas.getContext('2d')
                    if (context) {
                        canvas.height = viewport.height
                        canvas.width = viewport.width

                        await page.render({
                            canvasContext: context,
                            viewport: viewport
                        } as any).promise
                    }
                }
                setIsLoading(false)
            } catch (err) {
                console.error("Error rendering page", err)
                setIsLoading(false)
            }
        }

        loadPage()

        return () => { active = false }
    }, [file, pageIndex, scale])


    return (
        <div
            onClick={() => onSelect && onSelect(!selected)}
            className={cn(
                "relative group cursor-pointer transition-all",
                isLoading ? "bg-slate-100 animate-pulse" : "bg-white",
                selected ? "ring-2 ring-primary ring-offset-2" : "hover:ring-2 hover:ring-slate-200 hover:ring-offset-2",
                className
            )}
        >
            <canvas ref={canvasRef} className="max-w-full h-auto shadow-sm rounded-sm" />

            {/* Overlay for selection state or hover */}
            <div className={cn(
                "absolute inset-0 bg-primary/10 transition-opacity flex items-center justify-center rounded-sm",
                selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
                {selected && (
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transform scale-100 transition-transform">
                        ✓
                    </div>
                )}
            </div>

            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm">
                {pageIndex + 1}
            </div>
        </div>
    )
}
