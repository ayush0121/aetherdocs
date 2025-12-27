import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Files, Split, Image, FileType2, Download, PenLine, Stamp, Bot, Eraser, Share2, ArrowRight, Minimize2, FileText, Presentation, Table, FileEdit, RotateCw, FileCode, Unlock, Lock } from "lucide-react"
import Link from "next/link"

const tools = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDFs into one unified document",
    icon: Files,
    href: "/merge-pdf",
    color: "bg-red-500"
  },
  {
    title: "Split PDF",
    description: "Extract pages from your PDF or save each page as a separate PDF",
    icon: Split,
    href: "/split-pdf",
    color: "bg-orange-500"
  },
  {
    title: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality",
    icon: Minimize2,
    href: "/compress-pdf",
    color: "bg-green-500"
  },
  {
    title: "PDF to Word",
    description: "Easily convert your PDF files into easy to edit DOC and DOCX documents",
    icon: FileText,
    href: "/pdf-to-word",
    color: "bg-blue-600"
  },
  {
    title: "PDF to PowerPoint",
    description: "Turn your PDF files into easy to edit PPT and PPTX slideshows",
    icon: Presentation,
    href: "/pdf-to-powerpoint",
    color: "bg-orange-600"
  },
  {
    title: "PDF to Excel",
    description: "Pull data straight from PDFs into Excel spreadsheets in a few short seconds",
    icon: Table,
    href: "/pdf-to-excel",
    color: "bg-emerald-600"
  },
  {
    title: "Word to PDF",
    description: "Make DOC and DOCX files easy to read by converting them to PDF",
    icon: FileText,
    href: "/word-to-pdf",
    color: "bg-blue-700"
  },
  {
    title: "PowerPoint to PDF",
    description: "Make PPT and PPTX slideshows easy to view by converting them to PDF",
    icon: Presentation,
    href: "/powerpoint-to-pdf",
    color: "bg-orange-700"
  },
  {
    title: "Excel to PDF",
    description: "Make EXCEL spreadsheets easy to read by converting them to PDF",
    icon: Table,
    href: "/excel-to-pdf",
    color: "bg-emerald-700"
  },
  {
    title: "Edit PDF",
    description: "Add text, images, shapes or freehand annotations to a PDF document",
    icon: FileEdit,
    href: "/edit-pdf",
    color: "bg-purple-500"
  },
  {
    title: "PDF to JPG",
    description: "Convert each PDF page into a JPG or extract all images",
    icon: Image,
    href: "/pdf-to-jpg",
    color: "bg-amber-500"
  },
  {
    title: "JPG to PDF",
    description: "Convert your images to PDF. Adjust orientation and margins",
    icon: FileType2,
    href: "/jpg-to-pdf",
    color: "bg-yellow-500"
  },
  {
    title: "Sign PDF",
    description: "Sign yourself or request electronic signatures from others",
    icon: PenLine,
    href: "/sign-pdf",
    color: "bg-emerald-500"
  },
  {
    title: "Watermark",
    description: "Stamp an image or text over your PDF in seconds",
    icon: Stamp,
    href: "/watermark-pdf",
    color: "bg-blue-500"
  },
  {
    title: "Rotate PDF",
    description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once",
    icon: RotateCw,
    href: "/rotate-pdf",
    color: "bg-indigo-500"
  },
  {
    title: "HTML to PDF",
    description: "Convert webpages in HTML to PDF",
    icon: FileCode,
    href: "/html-to-pdf",
    color: "bg-slate-700"
  },
  {
    title: "Unlock PDF",
    description: "Remove PDF password security, giving you the freedom to use your PDFs",
    icon: Unlock,
    href: "/unlock-pdf",
    color: "bg-pink-600"
  },
  {
    title: "Protect PDF",
    description: "Protect PDF files with a password. Encrypt PDF documents",
    icon: Lock,
    href: "/protect-pdf",
    color: "bg-sky-600"
  },
  {
    title: "Chat with PDF",
    description: "Use AI to answer questions and summarize your document",
    icon: Bot,
    href: "/chat-pdf",
    color: "bg-indigo-500"
  },
  {
    title: "Redact PDF",
    description: "Permanently remove sensitive information from your documents",
    icon: Eraser,
    href: "/redact-pdf",
    color: "bg-slate-900"
  },
  {
    title: "Share PDF",
    description: "Securely share documents directly via WiFi (P2P)",
    icon: Share2,
    href: "/p2p-share",
    color: "bg-pink-500"
  }
]

import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center space-y-6 bg-white border-b">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
          {session?.user?.name ? `Hello, ${session.user.name}!` : <span>Welcome to <span className="text-primary">AetherDocs</span></span>}
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          The next-generation PDF toolkit. All tools are 100% FREE, secure, and run entirely in your browser.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button size="lg" className="h-12 px-8 text-lg" asChild>
            <Link href="/merge-pdf">
              Start Merging <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.title} href={tool.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-primary/50 group cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${tool.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
