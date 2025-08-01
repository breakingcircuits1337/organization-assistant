import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task } from "@/types/Task"
import type { Note } from "@/types/Note"

type Store = {
  tasks: Task[]
  notes: Note[]
  addTask: (task: Task) => void
  updateTask: (id: string, data: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskCompletion: (id: string) => void
  addNote: (note: Note) => void
  updateNote: (id: string, data: Partial<Note>) => void
  deleteNote: (id: string) => void
}

// Initial sample tasks and notes (from the current UI, converted to ISO string dates)
const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Finish the Q4 project proposal for client review",
    dueDate: new Date(2024, 11, 15).toISOString(),
    category: "Work",
    completed: false,
    priority: "high",
  },
  {
    id: "2",
    title: "Team meeting preparation",
    description: "Prepare agenda and materials for weekly team sync",
    dueDate: new Date(2024, 11, 12).toISOString(),
    category: "Work",
    completed: false,
    priority: "medium",
  },
  {
    id: "3",
    title: "Grocery shopping",
    description: "Buy ingredients for weekend dinner party",
    dueDate: new Date(2024, 11, 14).toISOString(),
    category: "Personal",
    completed: true,
    priority: "low",
  },
  {
    id: "4",
    title: "Review quarterly reports",
    description: "Analyze Q3 performance metrics",
    dueDate: new Date(2024, 11, 10).toISOString(),
    category: "Work",
    completed: false,
    priority: "high",
  },
  {
    id: "5",
    title: "Gym workout",
    description: "Upper body strength training session",
    dueDate: new Date(2024, 11, 13).toISOString(),
    category: "Health",
    completed: false,
    priority: "medium",
  },
  {
    id: "6",
    title: "Read chapter 5",
    description: 'Continue reading "Atomic Habits"',
    dueDate: new Date(2024, 11, 16).toISOString(),
    category: "Learning",
    completed: false,
    priority: "low",
  },
]

const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Meeting Notes - Product Strategy",
    content: "Discussed new feature roadmap, user feedback integration, and timeline for Q1 release.",
    createdAt: new Date(2024, 11, 8).toISOString(),
    tags: ["meeting", "strategy", "product"],
  },
  {
    id: "2",
    title: "Book Recommendations",
    content: "The Lean Startup, Atomic Habits, Deep Work - recommended by colleagues for professional development.",
    createdAt: new Date(2024, 11, 7).toISOString(),
    tags: ["books", "learning", "development"],
  },
  {
    id: "3",
    title: "Weekend Project Ideas",
    content: "Build a personal dashboard, learn React Native, organize home office space.",
    createdAt: new Date(2024, 11, 6).toISOString(),
    tags: ["projects", "personal", "ideas"],
  },
]

export const useAppStore = create<Store>()(
  persist(
    (set, get) => ({
      tasks: sampleTasks,
      notes: sampleNotes,

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),

      updateTask: (id, data) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      toggleTaskCompletion: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      addNote: (note) =>
        set((state) => ({
          notes: [...state.notes, note],
        })),

      updateNote: (id, data) =>
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, ...data } : n)),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),
    }),
    {
      name: "organizational-assistant-store",
    }
  )
)