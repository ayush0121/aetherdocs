"use client"

import { useCallback, useState } from "react"
import { UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"
// We would usually use 'react-dropzone' but to keep deps low/native I'll write a simple one or just assume standard native API Use.
// Actually, let's write a simple native one for now to save installing another dep unless I already did? I didn't install react-dropzone.
// I'll stick to native drag-and-drop events.

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void
    multiple?: boolean
    accept?: string
    className?: string
}

export function FileUploader({
    onFilesSelected,
    multiple = true,
    accept = "application/pdf",
    className,
}: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)

            const files = Array.from(e.dataTransfer.files)
            if (files.length > 0) {
                onFilesSelected(files)
            }
        },
        [onFilesSelected]
    )

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                onFilesSelected(Array.from(e.target.files))
            }
        },
        [onFilesSelected]
    )

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "relative flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed rounded-xl transition-colors cursor-pointer bg-slate-50/50",
                isDragging
                    ? "border-primary bg-primary/5"
                    : "border-slate-300 hover:border-primary/50 hover:bg-slate-50",
                className
            )}
        >
            <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileInput}
                multiple={multiple}
                accept={accept}
            />

            <div className="flex flex-col items-center gap-4 text-center p-8 pointer-events-none">
                <div className="p-4 rounded-full bg-slate-100 shadow-sm">
                    <UploadCloud className="w-10 h-10 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">
                        {isDragging ? "Drop files here" : "Select PDF files"}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2">
                        or drop files here
                    </p>
                </div>
            </div>
        </div>
    )
}
