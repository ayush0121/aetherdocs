"use client"

import { useState } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { imagesToPdf } from "@/lib/image-utils"
import { ArrowRight, Loader2, Image as ImageIcon } from "lucide-react"

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

export default function JpgToPdfPage() {
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles])
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

    const handleConvert = async () => {
        if (files.length === 0) return
        setIsProcessing(true)
        try {
            const pdfBlob = await imagesToPdf(files)
            const url = URL.createObjectURL(pdfBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = "images.pdf"
            link.click()
        } catch (e) {
            console.error(e)
            alert("Error converting images to PDF.")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleRemoveFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">JPG to PDF</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Convert your images to PDF in seconds. Adjust orientation and margins.
                    </p>
                </div>

                {files.length === 0 ? (
                    <div className="max-w-2xl mx-auto">
                        <FileUploader onFilesSelected={handleFilesSelected} accept="image/*" />
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={files.map(f => f.name)}
                                    strategy={rectSortingStrategy}
                                >
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 auto-rows-min">
                                        {files.map((file, idx) => (
                                            <SortableItem key={file.name} id={file.name} className="relative aspect-[3/4]">
                                                <div className="w-full h-full bg-slate-100 rounded-lg overflow-hidden border group">
                                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                                                    <button
                                                        onClick={() => handleRemoveFile(idx)}
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                    </button>
                                                </div>
                                            </SortableItem>
                                        ))}
                                        <div className="aspect-[3/4] border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                multiple
                                                onChange={(e) => {
                                                    if (e.target.files) handleFilesSelected(Array.from(e.target.files))
                                                }}
                                            />
                                            <span className="text-4xl text-slate-300 font-light">+</span>
                                        </div>
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </div>

                        <div className="w-full md:w-80 shrink-0">
                            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                                <div className="mb-4 text-center text-lg font-medium">{files.length} Images Selected</div>
                                <Button onClick={handleConvert} disabled={isProcessing} size="lg" className="w-full">
                                    {isProcessing ? (
                                        <><Loader2 className="animate-spin mr-2" /> Converting...</>
                                    ) : (
                                        <>Convert to PDF <ArrowRight className="ml-2" /></>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
