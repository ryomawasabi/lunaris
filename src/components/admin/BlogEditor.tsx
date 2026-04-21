'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Unlink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCallback } from 'react'

interface BlogEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

interface ToolbarButtonProps {
  icon: React.ReactNode
  onClick: () => void
  isActive: boolean
  disabled?: boolean
  title?: string
}

const ToolbarButton = ({
  icon,
  onClick,
  isActive,
  disabled = false,
  title,
}: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      'p-2 rounded transition-colors duration-200',
      'hover:bg-stone-light',
      isActive
        ? 'bg-gold text-white'
        : 'text-charcoal hover:text-gold',
      disabled && 'opacity-50 cursor-not-allowed'
    )}
  >
    {icon}
  </button>
)

export default function BlogEditor({
  content,
  onChange,
  placeholder = 'Start writing your blog post...',
}: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const handleImageInsert = useCallback(() => {
    if (!editor) return

    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const handleLinkInsert = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl || '')

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const handleUnlink = useCallback(() => {
    if (!editor) return
    editor.chain().focus().unsetLink().run()
  }, [editor])

  if (!editor) {
    return (
      <div className="border border-stone-light rounded-lg p-4 bg-stone-light">
        <div className="h-96 flex items-center justify-center text-warm">
          Loading editor...
        </div>
      </div>
    )
  }

  return (
    <div className="border border-stone-light rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-stone-light bg-stone-light p-2 flex flex-wrap gap-1">
        {/* Headings */}
        <div className="flex gap-1 border-r border-stone pr-2">
          <ToolbarButton
            icon={<Heading1 size={18} />}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          />
          <ToolbarButton
            icon={<Heading2 size={18} />}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          />
          <ToolbarButton
            icon={<Heading3 size={18} />}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          />
        </div>

        {/* Text formatting */}
        <div className="flex gap-1 border-r border-stone pr-2">
          <ToolbarButton
            icon={<Bold size={18} />}
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            title="Bold"
          />
          <ToolbarButton
            icon={<Italic size={18} />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            title="Italic"
          />
          <ToolbarButton
            icon={<Strikethrough size={18} />}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            title="Strikethrough"
          />
          <ToolbarButton
            icon={<Code size={18} />}
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            title="Inline Code"
          />
        </div>

        {/* Lists and blocks */}
        <div className="flex gap-1 border-r border-stone pr-2">
          <ToolbarButton
            icon={<List size={18} />}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          />
          <ToolbarButton
            icon={<ListOrdered size={18} />}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Ordered List"
          />
          <ToolbarButton
            icon={<Quote size={18} />}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Blockquote"
          />
          <ToolbarButton
            icon={<Minus size={18} />}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            isActive={false}
            title="Horizontal Rule"
          />
        </div>

        {/* Media and links */}
        <div className="flex gap-1 border-r border-stone pr-2">
          <ToolbarButton
            icon={<ImageIcon size={18} />}
            onClick={handleImageInsert}
            isActive={false}
            title="Insert Image"
          />
          <ToolbarButton
            icon={<LinkIcon size={18} />}
            onClick={handleLinkInsert}
            isActive={editor.isActive('link')}
            title="Insert Link"
          />
          <ToolbarButton
            icon={<Unlink size={18} />}
            onClick={handleUnlink}
            isActive={false}
            disabled={!editor.isActive('link')}
            title="Remove Link"
          />
        </div>

        {/* History */}
        <div className="flex gap-1">
          <ToolbarButton
            icon={<Undo size={18} />}
            onClick={() => editor.chain().focus().undo().run()}
            isActive={false}
            disabled={!editor.can().undo()}
            title="Undo"
          />
          <ToolbarButton
            icon={<Redo size={18} />}
            onClick={() => editor.chain().focus().redo().run()}
            isActive={false}
            disabled={!editor.can().redo()}
            title="Redo"
          />
        </div>
      </div>

      {/* Editor Content */}
      <div className="prose prose-sm max-w-none">
        <style>{`
          .ProseMirror {
            min-height: 400px;
            padding: 1rem;
            outline: none;
            font-family: inherit;
          }

          .ProseMirror p {
            margin: 1rem 0;
            line-height: 1.6;
          }

          .ProseMirror p.is-editor-empty:first-child::before {
            color: #adb5bd;
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
          }

          .ProseMirror h1 {
            font-size: 2rem;
            font-weight: 700;
            margin: 1.5rem 0 1rem 0;
            line-height: 1.2;
            letter-spacing: -0.02em;
          }

          .ProseMirror h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 1.25rem 0 0.875rem 0;
            line-height: 1.3;
            letter-spacing: -0.01em;
          }

          .ProseMirror h3 {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 1rem 0 0.75rem 0;
            line-height: 1.4;
          }

          .ProseMirror ul,
          .ProseMirror ol {
            padding-left: 2rem;
            margin: 1rem 0;
          }

          .ProseMirror li {
            margin: 0.5rem 0;
            line-height: 1.6;
          }

          .ProseMirror blockquote {
            border-left: 4px solid #5A8EAE;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #7A8EA0;
            font-style: italic;
            font-size: 1.05rem;
          }

          .ProseMirror code {
            background-color: #f0f4f8;
            color: #253545;
            padding: 0.125rem 0.375rem;
            border-radius: 0.25rem;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
          }

          .ProseMirror pre {
            background-color: #1C2A38;
            color: #FAFCFE;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
          }

          .ProseMirror pre code {
            background-color: transparent;
            color: inherit;
            padding: 0;
            font-size: 0.9em;
          }

          .ProseMirror img {
            max-width: 100%;
            height: auto;
            border-radius: 0.375rem;
            margin: 1rem 0;
            display: block;
          }

          .ProseMirror a {
            color: #5A8EAE;
            text-decoration: underline;
            cursor: pointer;
            transition: color 0.2s;
          }

          .ProseMirror a:hover {
            color: #3D6E8E;
          }

          .ProseMirror hr {
            border: none;
            border-top: 2px solid #DDE8F0;
            margin: 2rem 0;
          }

          .ProseMirror table {
            border-collapse: collapse;
            margin: 1rem 0;
            width: 100%;
          }

          .ProseMirror table th,
          .ProseMirror table td {
            border: 1px solid #DDE8F0;
            padding: 0.75rem;
            text-align: left;
          }

          .ProseMirror table th {
            background-color: #F0F4F8;
            font-weight: 600;
          }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
