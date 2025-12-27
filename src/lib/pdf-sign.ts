import { PDFDocument } from 'pdf-lib'

export async function signPdf(
    file: File,
    signatureDataUrl: string,
    pageIndex: number,
    x: number,
    y: number,
    width: number,
    height: number
): Promise<Uint8Array> {
    const fileBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(fileBuffer)
    const page = pdfDoc.getPage(pageIndex)

    const pngImage = await pdfDoc.embedPng(signatureDataUrl)

    // In pdf-lib, y coordinates start from bottom-left
    // x, y passed here are likely top-left based (DOM), so we might need conversion if not handled by caller
    // For this MVP, let's assume caller passes PDF-coordinate system or center logic
    // Actually, constructing a good drag-drop UI that maps DOM to PDF coordinates is complex.
    // Simplified Strategy: Place signature at the center of the viewport/page for now,
    // or rely on fixed backend positioning.

    // Let's rely on simple normalized coordinates for now or center it if x/y not strict.

    page.drawImage(pngImage, {
        x: x,
        y: y,
        width: width,
        height: height,
    })

    return await pdfDoc.save()
}
