"use client"

import { useState, useRef, useEffect } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { extractTextFromPdf, generateAnswer, ChatMessage } from "@/lib/pdf-chat"
import { Send, Bot, User, Loader2, FileText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ChatPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState("")
    const [pdfText, setPdfText] = useState<string[]>([])

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleFilesSelected = async (newFiles: File[]) => {
        if (newFiles.length > 0) {
            const selectedFile = newFiles[0]
            setFile(selectedFile)
            setIsProcessing(true)
            try {
                const text = await extractTextFromPdf(selectedFile)
                setPdfText(text)
                setMessages([{
                    id: 'welcome',
                    role: 'assistant',
                    content: `Hello! I've read **${selectedFile.name}** (${text.length} pages). Ask me anything about it!`
                }])
            } catch (e) {
                console.error(e)
                console.error(e)
                alert(`Error: ${(e as Error).message}. \n\nCheck console for details.`)
                setFile(null)
            } finally {
                setIsProcessing(false)
            }
        }
    }

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!input.trim()) return

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        }

        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsProcessing(true)

        // Simulate network delay for natural feel
        setTimeout(() => {
            const answer = generateAnswer(userMsg.content, pdfText)
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: answer
            }
            setMessages(prev => [...prev, botMsg])
            setIsProcessing(false)
        }, 600)
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

            {!file ? (
                <div className="container mx-auto py-12 px-4 flex-1">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 mb-4">Chat with PDF</h1>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Use AI to extract insights and answer questions from your documents instantly.
                        </p>
                    </div>
                    <div className="max-w-2xl mx-auto">
                        <FileUploader onFilesSelected={handleFilesSelected} multiple={false} />
                    </div>
                </div>
            ) : (
                <div className="flex-1 container mx-auto p-4 flex flex-col max-h-[calc(100vh-80px)]">
                    <div className="bg-white border rounded-t-xl p-4 flex items-center justify-between shadow-sm shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="bg-red-100 p-2 rounded-lg">
                                <FileText className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-sm">{file.name}</h2>
                                <p className="text-xs text-slate-500">{pdfText.length} Pages • {pdfText.join(' ').length} words</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                            Change PDF
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 bg-slate-100 p-4 border-x overflow-y-auto">
                        <div className="space-y-4 max-w-3xl mx-auto">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-indigo-500 text-white rounded-tr-none'
                                            : 'bg-white shadow-sm border rounded-tl-none text-slate-800'
                                            }`}>
                                            {msg.content.split('\n').map((line, i) => (
                                                <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isProcessing && (
                                <div className="flex justify-start">
                                    <div className="flex gap-3 max-w-[80%]">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                            <Bot className="w-5 h-5" />
                                        </div>
                                        <div className="bg-white shadow-sm border rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                                            <span className="text-xs text-slate-500">Reading document...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    <div className="bg-white border rounded-b-xl p-4 shrink-0">
                        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
                            <Input
                                placeholder="Ask something about this document..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1"
                                autoFocus
                            />
                            <Button type="submit" disabled={!input.trim() || isProcessing}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}


