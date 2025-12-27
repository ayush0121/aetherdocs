import { PDFDocument } from 'pdf-lib'

export async function splitPdf(file: File, selectedPageIndices: number[]): Promise<Uint8Array> {
    const fileBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(fileBuffer)

    // Create a new PDF
    const newPdf = await PDFDocument.create()

    // Copy selected pages
    const copiedPages = await newPdf.copyPages(pdfDoc, selectedPageIndices)
    copiedPages.forEach((page) => newPdf.addPage(page))

    return await newPdf.save()
}

export async function getPdfPageCount(file: File): Promise<number> {
    const fileBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(fileBuffer)
    return pdfDoc.getPageCount()
}
