export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
}

export async function extractTextFromPdf(file: File): Promise<string[]> {
    const pdfjsLib = await import("pdfjs-dist")
    // Ensure worker is set
    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
    }

    const arrayBuffer = await file.arrayBuffer()
    // Pass strictly as Uint8Array if ArrayBuffer issues arise, or object
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) })
    const pdf = await loadingTask.promise

    const pagesText: string[] = []

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(' ')
        pagesText.push(pageText)
    }

    return pagesText
}

export function generateAnswer(query: string, pdfText: string[]): string {
    const lowerQuery = query.toLowerCase()

    // Simple stemming: remove 's', 'es', 'ing' to find base words
    const queryTokens = lowerQuery.replace(/[?.,!]/g, '').split(" ").filter(w => w.length > 2)
    const baseWords = queryTokens.map(w => {
        if (w.endsWith('ing')) return w.slice(0, -3)
        if (w.endsWith('ies')) return w.slice(0, -3) + 'y'
        if (w.endsWith('es')) return w.slice(0, -2)
        if (w.endsWith('s')) return w.slice(0, -1)
        return w
    })

    console.log("Searching for tokens:", baseWords)

    // 1. Keyword matching score per page
    const pageScores = pdfText.map((text, index) => {
        const lowerText = text.toLowerCase()
        let score = 0

        baseWords.forEach(word => {
            if (lowerText.includes(word)) score += 2 // Exact/Full word match
            // Check for the original query word too
            if (queryTokens.includes(word)) score += 1
        })
        return { index, score, text }
    })

    // 2. Sort by score
    const bestMatches = pageScores.sort((a, b) => b.score - a.score).filter(match => match.score > 0)

    if (bestMatches.length === 0) {
        console.log("No matches found. Top page text:", pdfText[0].slice(0, 100))
        return "I couldn't find any specific information matching your question in this document. \n\n(Note: This is a keyword search tool, not a full AI. Try using exact keywords from the document)."
    }

    // 3. Construct response
    const topMatch = bestMatches[0]

    // Regex to split by sentence-ending punctuation even if spacing is weird
    const sentences = topMatch.text.split(/(?<=[.?!])\s+/)

    const relevantSentences = sentences.filter(s => {
        const lowerS = s.toLowerCase()
        return baseWords.some(w => lowerS.includes(w))
    })

    // If we found the page but not specific sentences (maybe weird formatting), return a chunk around the first keyword
    let excerpt = ""
    if (relevantSentences.length > 0) {
        excerpt = relevantSentences.slice(0, 5).join(' ')
    } else {
        // Fallback: Find the first occurrence of a keyword and grab surrounding text
        const lowerText = topMatch.text.toLowerCase()
        const firstKeyword = baseWords.find(w => lowerText.includes(w)) || baseWords[0]
        const keywordIndex = lowerText.indexOf(firstKeyword)
        const start = Math.max(0, keywordIndex - 100)
        const end = Math.min(topMatch.text.length, keywordIndex + 300)
        excerpt = "..." + topMatch.text.slice(start, end) + "..."
    }

    return `Found relevant content on **Page ${topMatch.index + 1}**:\n\n"...${excerpt}"`
}
