import { PDFDocument, rgb, degrees } from 'pdf-lib'

// Existing function imports...

export async function watermarkPdf(
    file: File,
    text: string,
    opacity: number = 0.5,
    size: number = 50,
    rotation: number = -45
): Promise<Uint8Array> {
    const fileBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(fileBuffer)
    const pages = pdfDoc.getPages()

    pages.forEach(page => {
        const { width, height } = page.getSize()
        page.drawText(text, {
            x: width / 2 - (size * text.length) / 4, // Rough centering approximation
            y: height / 2,
            size: size,
            color: rgb(0.5, 0.5, 0.5), // Grey
            opacity: opacity,
            rotate: degrees(rotation),
        })
    })

    return await pdfDoc.save()
}
