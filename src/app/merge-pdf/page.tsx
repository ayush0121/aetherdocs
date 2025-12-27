"use client"

import { useState } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { mergePdfs, downloadPdf } from "@/lib/pdf-utils"
import { FileText, ArrowRight, Loader2, Trash2 } from "lucide-react"

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableItem } from '@/components/sortable-item'

export default function MergePdfPage() {
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles((prev) => [...prev, ...newFiles])
    }

    const handleRemoveFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            setFiles((items) => {
                const oldIndex = items.findIndex(f => f.name === active.id)
                const newIndex = items.findIndex(f => f.name === over?.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const handleMerge = async () => {
        if (files.length === 0) return

        setIsProcessing(true)
        try {
            const mergedPdfBytes = await mergePdfs(files)
            downloadPdf(mergedPdfBytes, "merged-document.pdf")
        } catch (error) {
            console.error("Failed to merge PDFs", error)
            alert("Error merging PDFs. Please check if the files are valid.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Merge PDF files</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Combine PDFs in the order you want with the easiest PDF merger available.
                    </p>
                </div>

                {files.length === 0 ? (
                    <div className="max-w-2xl mx-auto">
                        <FileUploader onFilesSelected={handleFilesSelected} />
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
                        <div className="flex-1 order-2 md:order-1">
                            {/* File List Grid */}
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={files.map(f => f.name)}
                                    strategy={rectSortingStrategy}
                                >
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {files.map((file, idx) => (
                                            <SortableItem key={file.name} id={file.name} className="h-full">
                                                <Card className="relative group overflow-hidden border-slate-200 h-full">
                                                    <CardContent className="p-4 flex flex-col items-center justify-center min-h-[140px] text-center">
                                                        <FileText className="w-12 h-12 text-red-500 mb-2 opacity-80" />
                                                        <p className="text-xs font-medium text-slate-700 break-all line-clamp-2">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-1">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation() // Prevent drag start when clicking remove
                                                                // We need to use index carefully here as array might change if we used index as key, but we used file.name
                                                                // However, handleRemove expects index... let's find index by name to match current state
                                                                const currentIdx = files.findIndex(f => f.name === file.name)
                                                                handleRemoveFile(currentIdx)
                                                            }}
                                                            onPointerDown={(e) => e.stopPropagation()}
                                                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-slate-500 hover:text-red-500 hover:bg-white shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </CardContent>
                                                </Card>
                                            </SortableItem>
                                        ))}

                                        <div className="flex items-center justify-center min-h-[140px] border-2 border-dashed border-slate-200 rounded-lg hover:border-primary/50 hover:bg-slate-50 transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                multiple
                                                accept="application/pdf"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    if (e.target.files) handleFilesSelected(Array.from(e.target.files))
                                                }}
                                            />
                                            <div className="flex flex-col items-center">
                                                <span className="text-3xl text-slate-300 font-light">+</span>
                                                <span className="text-xs font-medium text-slate-500 mt-1">Add more</span>
                                            </div>
                                        </div>
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </div>

                        <div className="w-full md:w-80 order-1 md:order-2 shrink-0">
                            <Card className="sticky top-24 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-lg mb-4">Merge PDF</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Files selected:</span>
                                            <span className="font-medium">{files.length}</span>
                                        </div>
                                        <Button
                                            onClick={handleMerge}
                                            className="w-full h-12 text-lg shadow-blue-500/25 shadow-md"
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                    Merging...
                                                </>
                                            ) : (
                                                <>
                                                    Merge files <ArrowRight className="w-5 h-5 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
