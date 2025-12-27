"use client"

import { useState } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { watermarkPdf } from "@/lib/pdf-watermark"
import { downloadPdf } from "@/lib/pdf-utils"
import { ArrowRight, Loader2, Stamp } from "lucide-react"

export default function WatermarkPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [text, setText] = useState("CONFIDENTIAL")
    const [opacity, setOpacity] = useState(0.5)
    const [size, setSize] = useState(50)
    const [rotation, setRotation] = useState(-45)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleFilesSelected = (newFiles: File[]) => {
        if (newFiles.length > 0) setFile(newFiles[0])
    }

    const handleWatermark = async () => {
        if (!file) return
        setIsProcessing(true)
        try {
            const watermarkedPdf = await watermarkPdf(file, text, opacity, size, rotation)
            downloadPdf(watermarkedPdf, "watermarked-document.pdf")
        } catch (e) {
            console.error(e)
            alert("Error applying watermark")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Watermark PDF</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.
                    </p>
                </div>

                {!file ? (
                    <div className="max-w-2xl mx-auto">
                        <FileUploader onFilesSelected={handleFilesSelected} multiple={false} />
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
                        <div className="flex-1 bg-slate-200/50 p-8 rounded-xl border flex items-center justify-center min-h-[400px]">
                            <div className="relative bg-white shadow-xl w-[300px] h-[400px] flex items-center justify-center overflow-hidden">
                                {/* Fake Preview */}
                                <div className="absolute inset-x-8 inset-y-8 border-2 border-slate-100 flex flex-col gap-2">
                                    <div className="h-2 bg-slate-100 w-3/4" />
                                    <div className="h-2 bg-slate-100 w-full" />
                                    <div className="h-2 bg-slate-100 w-full" />
                                    <div className="h-2 bg-slate-100 w-1/2" />
                                </div>
                                <div
                                    className="text-slate-500 font-bold whitespace-nowrap pointer-events-none select-none z-10"
                                    style={{
                                        opacity: opacity,
                                        fontSize: `${size / 2}px`, // Scale down for preview
                                        transform: `rotate(${rotation}deg)`
                                    }}
                                >
                                    {text}
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-80 shrink-0">
                            <Card>
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <Stamp className="w-5 h-5" />
                                        Options
                                    </h3>

                                    <div className="space-y-2">
                                        <Label>Watermark Text</Label>
                                        <Input value={text} onChange={(e) => setText(e.target.value)} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Opacity: {Math.round(opacity * 100)}%</Label>
                                        <Slider
                                            min={0} max={1} step={0.1}
                                            value={[opacity]}
                                            onValueChange={([v]) => setOpacity(v)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Font Size: {size}px</Label>
                                        <Slider
                                            min={10} max={100} step={1}
                                            value={[size]}
                                            onValueChange={([v]) => setSize(v)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Rotation: {rotation}°</Label>
                                        <Slider
                                            min={-90} max={90} step={5}
                                            value={[rotation]}
                                            onValueChange={([v]) => setRotation(v)}
                                        />
                                    </div>

                                    <Button onClick={handleWatermark} disabled={isProcessing} className="w-full h-12">
                                        {isProcessing ? (
                                            <><Loader2 className="animate-spin mr-2" /> Applying...</>
                                        ) : (
                                            <>Watermark PDF <ArrowRight className="ml-2" /></>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                            <Button variant="ghost" className="w-full mt-4" onClick={() => setFile(null)}>Change File</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
