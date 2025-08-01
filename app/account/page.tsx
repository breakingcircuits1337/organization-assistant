"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AccountPage() {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setDeleting(true)
    await fetch("/api/user/delete", { method: "DELETE" })
    await fetch("/api/auth/signout")
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Account</h1>
      <button
        className="bg-red-600 text-white px-6 py-3 rounded shadow hover:bg-red-700 transition"
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Delete my data"
      >
        {deleting ? "Deleting..." : "Delete my data"}
      </button>
    </div>
  )
}