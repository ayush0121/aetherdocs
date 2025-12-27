import { PDFDocument, rgb } from 'pdf-lib'

export async function redactPdf(
    file: File,
    redactions: { pageIndex: number, x: number, y: number, width: number, height: number }[]
): Promise<Uint8Array> {
    const fileBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(fileBuffer)
    const pages = pdfDoc.getPages()

    redactions.forEach(rect => {
        if (rect.pageIndex >= 0 && rect.pageIndex < pages.length) {
            const page = pages[rect.pageIndex]
            page.drawRectangle({
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                color: rgb(0, 0, 0),
            })
        }
    })

    return await pdfDoc.save()
}
