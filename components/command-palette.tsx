"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import * as Cmdk from "cmdk"

const items = [
  { label: "Create Task", route: "/tasks", event: "open-task-dialog" },
  { label: "Search", route: "/search" },
  { label: "Open Calendar", route: "/calendar" },
  { label: "Open Notes", route: "/notes" },
]

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  React.useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  return (
    <>
      {/* Invisible button for e2e */}
      <button
        data-testid="command-palette-toggle"
        tabIndex={-1}
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-2">
            <Cmdk.Command
              value={query}
              onValueChange={setQuery}
              label="Command Palette"
            >
              <Cmdk.CommandInput
                ref={inputRef}
                placeholder="Type a command..."
                className="w-full border-b px-3 py-2"
              />
              <Cmdk.CommandList>
                {items
                  .filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
                  .map((item) => (
                    <Cmdk.CommandItem
                      key={item.label}
                      onSelect={() => {
                        setOpen(false)
                        if (item.event) window.dispatchEvent(new CustomEvent(item.event))
                        router.push(item.route)
                      }}
                    >
                      {item.label}
                    </Cmdk.CommandItem>
                  ))}
              </Cmdk.CommandList>
            </Cmdk.Command>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-4 text-gray-400"
              aria-label="Close"
            >
              <span className="sr-only">Close command palette</span>
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}