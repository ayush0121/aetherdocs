import { PDFDocument, degrees } from 'pdf-lib'

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
        const fileBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(fileBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
    }

    const savedPdfBytes = await mergedPdf.save()
    return savedPdfBytes
}

export function downloadPdf(pdfBytes: Uint8Array, filename: string) {
    const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export async function getPdfPageCount(file: File): Promise<number> {
    const buffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(buffer)
    return pdf.getPageCount()
}

export async function rotatePdf(file: File, rotations: { pageIndex: number, rotation: number }[]): Promise<Uint8Array> {
    const fileBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(fileBuffer)
    const pages = pdfDoc.getPages()

    rotations.forEach(({ pageIndex, rotation }) => {
        if (pageIndex >= 0 && pageIndex < pages.length) {
            const page = pages[pageIndex]
            const currentRotation = page.getRotation().angle
            page.setRotation(degrees((currentRotation + rotation) % 360))
        }
    })

    return await pdfDoc.save()
}

export async function protectPdf(file: File, password: string): Promise<Uint8Array> {
    const fileBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(fileBuffer)
        // pdf-lib types might be incomplete or version mismatch
        ; (pdfDoc as any).encrypt({
            userPassword: password,
            ownerPassword: password,
            permissions: { printing: 'highResolution', modifying: false, copying: false, annotating: false, fillingForms: false, contentAccessibility: false, documentAssembly: false }
        })
    return await pdfDoc.save()
}

export async function unlockPdf(file: File, password: string): Promise<Uint8Array> {
    const fileBuffer = await file.arrayBuffer()
    // Attempt to load with password. If it fails, pdf-lib throws.
    const pdfDoc = await PDFDocument.load(fileBuffer, { password } as any)
    // Saving without encryption removes the password
    return await pdfDoc.save()
}

export async function compressPdf(file: File): Promise<Uint8Array> {
    const fileBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(fileBuffer)
    // Basic optimization: re-saving with default compression usually reduces file size if it was inefficiently written
    // Also stripping metadata
    pdfDoc.setTitle('')
    pdfDoc.setAuthor('')
    pdfDoc.setSubject('')
    pdfDoc.setKeywords([])
    pdfDoc.setProducer('')
    pdfDoc.setCreator('')

    return await pdfDoc.save()
}
