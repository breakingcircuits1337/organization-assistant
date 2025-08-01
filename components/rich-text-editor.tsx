"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value?: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder ?? "Write your note...",
      }),
    ],
    content: value ?? "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="border rounded-lg px-2 py-2 bg-white">
      <EditorContent editor={editor} />
    </div>
  )
}