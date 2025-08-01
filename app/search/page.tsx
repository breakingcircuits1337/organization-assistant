"use client"
import { useEffect, useMemo, useState } from "react"
import { useAppStore } from "@/lib/store"
import Fuse from "fuse.js"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import debounce from "lodash.debounce"

export default function SearchPage() {
  const { tasks, notes, hydrate } = useAppStore()
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState("")

  useEffect(() => { hydrate() }, [hydrate])

  // Debounce input for better UX
  const setDebouncedDebounced = useMemo(() => debounce(setDebounced, 200), [])
  useEffect(() => { setDebouncedDebounced(query) }, [query, setDebouncedDebounced])

  const fuseTasks = useMemo(
    () =>
      new Fuse(tasks, {
        keys: ["title", "description", "tags"],
        threshold: 0.3,
      }),
    [tasks]
  )
  const fuseNotes = useMemo(
    () =>
      new Fuse(notes, {
        keys: ["title", "content", "tags"],
        threshold: 0.3,
      }),
    [notes]
  )

  const taskResults = debounced ? fuseTasks.search(debounced).map((r) => r.item) : []
  const noteResults = debounced ? fuseNotes.search(debounced).map((r) => r.item) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Search</h1>
              <p className="text-muted-foreground">Find tasks and notes instantly</p>
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
              <Link href="/notes" className="py-4 px-1 text-muted-foreground hover:text-foreground">
                Notes
              </Link>
              <Link href="/search" className="border-b-2 border-primary py-4 px-1 text-primary font-medium">
                Search
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Input
          placeholder="Search tasks and notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-6"
        />
        {debounced && (
          <>
            {taskResults.length > 0 && (
              <div className="mb-4">
                <h2 className="font-semibold text-lg mb-2">Tasks</h2>
                <div className="space-y-2">
                  {taskResults.map((task) => (
                    <Link key={task.id} href="/tasks" className="block p-3 bg-white rounded shadow hover:bg-blue-50">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-gray-600">{task.description}</div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {task.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {noteResults.length > 0 && (
              <div>
                <h2 className="font-semibold text-lg mb-2">Notes</h2>
                <div className="space-y-2">
                  {noteResults.map((note) => (
                    <Link key={note.id} href="/notes" className="block p-3 bg-white rounded shadow hover:bg-blue-50">
                      <div className="font-medium">{note.title}</div>
                      <div className="text-xs text-gray-600">{note.content.replace(/<[^>]+>/g, "").slice(0, 80)}...</div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {note.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {taskResults.length === 0 && noteResults.length === 0 && (
              <div className="text-gray-500 text-center py-4">No results found.</div>
            )}
          </>
        )}
      </main>
    </div>
  )
}