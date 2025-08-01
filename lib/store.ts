import { create } from "zustand"
import type { Task } from "@/types/Task"
import type { Note } from "@/types/Note"

type Store = {
  tasks: Task[]
  notes: Note[]
  loaded: boolean
  hydrate: () => Promise<void>
  addTask: (task: Task) => Promise<void>
  updateTask: (id: string, data: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskCompletion: (id: string) => Promise<void>
  addNote: (note: Note) => Promise<void>
  updateNote: (id: string, data: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
}

export const useAppStore = create<Store>((set, get) => ({
  tasks: [],
  notes: [],
  loaded: false,

  hydrate: async () => {
    if (get().loaded) return
    const [tasksRes, notesRes] = await Promise.all([
      fetch("/api/tasks").then((r) => r.ok ? r.json() : []),
      fetch("/api/notes").then((r) => r.ok ? r.json() : [])
    ])
    set({ tasks: tasksRes, notes: notesRes, loaded: true })
  },

  addTask: async (task) => {
    // Accept tags property if present
    const payload = { ...task }
    if (task.tags) payload.tags = task.tags
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const newTask = await res.json()
      set((state) => ({ tasks: [...state.tasks, newTask] }))
    }
  },

  updateTask: async (id, data) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const updated = await res.json()
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
      }))
    }
  },

  deleteTask: async (id) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" })
    if (res.ok) {
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }))
    }
  },

  toggleTaskCompletion: async (id) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return
    await get().updateTask(id, { completed: !task.completed })
  },

  addNote: async (note) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    })
    if (res.ok) {
      const newNote = await res.json()
      set((state) => ({ notes: [newNote, ...state.notes] }))
    }
  },

  updateNote: async (id, data) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const updated = await res.json()
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? updated : n)),
      }))
    }
  },

  deleteNote: async (id) => {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" })
    if (res.ok) {
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
      }))
    }
  },
}))