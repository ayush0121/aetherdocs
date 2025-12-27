"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
// import { SignaturePad } from "@/components/signature-pad" // Remove static import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { signPdf } from "@/lib/pdf-sign"
import { downloadPdf } from "@/lib/pdf-utils"
import { PdfPagePreview } from "@/components/pdf-preview"
import { ArrowRight, Loader2, PenLine } from "lucide-react"

// Dynamic import with SSR disabled
const SignaturePad = dynamic(() => import("@/components/signature-pad").then(mod => mod.SignaturePad), {
    ssr: false,
    loading: () => <div className="p-4 text-center">Loading Signature Pad...</div>
})

export default function SignPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [signature, setSignature] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [selectedPage, setSelectedPage] = useState(0)

    const handleFilesSelected = (newFiles: File[]) => {
        if (newFiles.length > 0) setFile(newFiles[0])
    }

    const handleSaveSignature = (dataUrl: string) => {
        setSignature(dataUrl)
    }

    const handleSign = async () => {
        if (!file || !signature) return
        setIsProcessing(true)
        try {
            // Hardcoded "stamp" position for MVP demonstration
            // Improvements: Real drag and drop on the canvas requires coordinate mapping logic
            const signedPdf = await signPdf(file, signature, selectedPage, 50, 50, 150, 75)
            downloadPdf(signedPdf, "signed-document.pdf")
        } catch (e) {
            console.error(e)
            alert("Error signing PDF. Only PNG signatures supported currently.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Sign PDF</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Sign yourself or request electronic signatures from others.
                    </p>
                </div>

                {!file ? (
                    <div className="max-w-2xl mx-auto">
                        <FileUploader onFilesSelected={handleFilesSelected} multiple={false} />
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                        {/* PDF Viewer / Page Selector */}
                        <div className="flex-1 bg-slate-200/50 p-6 rounded-xl border min-h-[500px] flex justify-center overflow-auto">
                            <div className="relative shadow-lg border-2 border-slate-300 bg-white">
                                <PdfPagePreview
                                    file={file}
                                    pageIndex={selectedPage}
                                    scale={1.5}
                                    className="pointer-events-none"
                                />
                                {signature && (
                                    <div className="absolute top-10 left-10 border-2 border-dashed border-blue-500 bg-blue-50/20 p-2 cursor-move">
                                        <img src={signature} alt="Signature" className="h-[75px]" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="w-full md:w-80 shrink-0 space-y-4">
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="font-semibold mb-4">Your Signature</h3>
                                {!signature ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full h-24 border-dashed flex flex-col gap-2">
                                                <PenLine className="w-6 h-6 text-slate-400" />
                                                Add Signature
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Draw your signature</DialogTitle>
                                            </DialogHeader>
                                            <SignaturePad onSave={handleSaveSignature} onCancel={() => { }} />
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <div className="relative group border rounded-md p-4 bg-slate-50">
                                        <img src={signature} alt="My Signature" className="max-h-16 mx-auto" />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                            onClick={() => setSignature(null)}
                                        >
                                            &times;
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <div className="text-sm text-slate-500 mb-4">
                                    Placement: Top-Left (Default)
                                    <br />
                                    <span className="text-xs">Draggable placement coming soon</span>
                                </div>
                                <Button onClick={handleSign} disabled={!signature || isProcessing} className="w-full h-12" size="lg">
                                    {isProcessing ? (
                                        <><Loader2 className="animate-spin mr-2" /> Signing...</>
                                    ) : (
                                        <>Sign PDF <ArrowRight className="ml-2" /></>
                                    )}
                                </Button>
                            </div>

                            <Button variant="ghost" className="w-full" onClick={() => setFile(null)}>
                                Change File
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
