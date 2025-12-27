"use client"

import React, { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Button } from "@/components/ui/button"
import { Eraser, Check } from "lucide-react"

interface SignaturePadProps {
    onSave: (dataUrl: string) => void
    onCancel: () => void
}

export function SignaturePad({ onSave, onCancel }: SignaturePadProps) {
    const sigPad = useRef<SignatureCanvas>(null)

    const clear = () => {
        sigPad.current?.clear()
    }

    const save = () => {
        if (!sigPad.current || sigPad.current.isEmpty()) return
        const dataUrl = sigPad.current.getTrimmedCanvas().toDataURL('image/png')
        onSave(dataUrl)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="border-2 border-slate-200 rounded-lg overflow-hidden bg-white">
                <SignatureCanvas
                    ref={sigPad}
                    penColor="black"
                    canvasProps={{
                        width: 500,
                        height: 200,
                        className: 'cursor-crosshair w-full h-[200px]'
                    }}
                />
            </div>
            <div className="flex justify-between">
                <Button variant="ghost" onClick={clear} type="button">
                    <Eraser className="w-4 h-4 mr-2" /> Clear
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onCancel} type="button">Cancel</Button>
                    <Button onClick={save} type="button">
                        <Check className="w-4 h-4 mr-2" /> Use Signature
                    </Button>
                </div>
            </div>
        </div>
    )
}
