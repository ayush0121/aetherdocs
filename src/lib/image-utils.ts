import JSZip from 'jszip'
// import * as pdfjsLib from 'pdfjs-dist' // Removed top level
import { jsPDF } from 'jspdf' // Changed from default to named import

// Ensure worker is set (redundant if set globally in app but good for safety if lazy loaded)
// Moved inside pdfToImagesZip for lazy loading

export async function pdfToImagesZip(file: File): Promise<Blob> {
    const pdfjsLib = await import('pdfjs-dist')
    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
    }

    const zip = new JSZip()
    const buffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument(buffer as any).promise

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2 }) // High res
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        if (!context) continue

        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({
            canvasContext: context,
            viewport: viewport
        } as any).promise

        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85))
        if (blob) {
            zip.file(`page-${i}.jpg`, blob)
        }
    }

    return await zip.generateAsync({ type: 'blob' })
}

export async function imagesToPdf(files: File[]): Promise<Blob> {
    const doc = new jsPDF()

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (i > 0) doc.addPage()

        const imgData = await readFileAsDataURL(file)
        const imgProps = doc.getImageProperties(imgData)

        const pdfWidth = doc.internal.pageSize.getWidth()
        const pdfHeight = doc.internal.pageSize.getHeight()

        const ratio = imgProps.width / imgProps.height
        const pdfRatio = pdfWidth / pdfHeight

        let w, h
        if (ratio > pdfRatio) {
            w = pdfWidth
            h = w / ratio
        } else {
            h = pdfHeight
            w = h * ratio
        }

        // Center image
        const x = (pdfWidth - w) / 2
        const y = (pdfHeight - h) / 2

        doc.addImage(imgData, 'JPEG', x, y, w, h)
    }

    return doc.output('blob')
}

function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}
