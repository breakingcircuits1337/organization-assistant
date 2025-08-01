export interface Task {
  id: string
  title: string
  description?: string
  dueDate: string // ISO 8601 string
  category: string
  completed: boolean
  priority: "low" | "medium" | "high"
  tags?: string[]
}