"use client"
import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RichTextEditor } from "@/components/rich-text-editor"
import { friendlyLabel } from "@/lib/date"
import Link from "next/link"

export default function NotesPage() {
  const notes = useAppStore((s) => s.notes)
  const hydrate = useAppStore((s) => s.hydrate)
  const addNote = useAppStore((s) => s.addNote)
  const updateNote = useAppStore((s) => s.updateNote)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")

  const [rewriteId, setRewriteId] = useState<string | null>(null)
  const [rewriteTone, setRewriteTone] = useState("concise")
  const [isRewriting, setIsRewriting] = useState(false)

  useEffect(() => { hydrate() }, [hydrate])

  const handleSave = async () => {
    await addNote({
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
    })
    setTitle("")
    setContent("")
    setTags("")
    setIsDialogOpen(false)
  }

  const handleRewrite = async (id: string, content: string, tone: string) => {
    setIsRewriting(true)
    try {
      const res = await fetch("/api/ai/rewrite-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, tone }),
      })
      if (res.ok) {
        const { rewritten } = await res.json()
        await updateNote(id, { content: rewritten })
      }
      setRewriteId(null)
    } finally {
      setIsRewriting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Notes</h1>
              <p className="text-muted-foreground">Your notes & ideas</p>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/" className="py-4 px-1 text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/tasks" className="py-4 px-1 text-muted-foreground hover:text-foreground">
                Tasks
              </Link>
              <Link href="/calendar" className="py-4 px-1 text-muted-foreground hover:text-foreground">
                Calendar
              </Link>
              <Link href="/notes" className="border-b-2 border-primary py-4 px-1 text-primary font-medium">
                Notes
              </Link>
              <Link href="/search" className="py-4 px-1 text-muted-foreground hover:text-foreground">
                Search
              </Link>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>New Note</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Note</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Write your note here..."
                  />
                  <Input
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleSave} disabled={!title || !content}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center mb-2">
                <h3 className="font-semibold text-lg flex-1">{note.title}</h3>
                <span className="text-xs text-gray-500">{friendlyLabel(note.createdAt)}</span>
              </div>
              <div className="text-gray-700 text-sm mb-1">
                {note.content.replace(/<[^>]+>/g, "").slice(0, 100)}{note.content.length > 100 ? "..." : ""}
              </div>
              <div className="flex gap-1 flex-wrap mb-2">
                {note.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRewriteId(note.id)}
                disabled={isRewriting}
                className="mt-1"
              >
                Rewrite
              </Button>
              {rewriteId === note.id && (
                <Dialog open onOpenChange={() => setRewriteId(null)}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rewrite Note</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-3 py-2">
                      <label htmlFor="tone">Tone:</label>
                      <select
                        id="tone"
                        value={rewriteTone}
                        onChange={e => setRewriteTone(e.target.value)}
                        className="border rounded p-1"
                      >
                        <option value="concise">Concise</option>
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                      </select>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => handleRewrite(note.id, note.content, rewriteTone)}
                        disabled={isRewriting}
                      >
                        {isRewriting ? "Rewriting..." : "Rewrite"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}