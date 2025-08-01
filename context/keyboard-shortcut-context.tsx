"use client"
import * as React from "react"
import { usePathname } from "next/navigation"

export function KeyboardShortcutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // "c" on tasks page
      if (pathname === "/tasks" && e.key === "c" && !e.metaKey && !e.ctrlKey) {
        window.dispatchEvent(new CustomEvent("open-task-dialog"))
      }
      // "/" on search page
      if (pathname === "/search" && e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setTimeout(() => {
          const input = document.getElementById("search-input") as HTMLInputElement
          input?.focus()
        }, 0)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [pathname])

  return <>{children}</>
}