"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/app/admin/upload-action";

function ToolbarButton({
  onClick,
  active,
  children,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "rounded px-2 py-1 text-small font-semibold transition-colors",
        active ? "bg-neutral-darkest text-white" : "text-neutral-darkest hover:bg-neutral-lightest",
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({
  editor,
  onInsertImageClick,
  imagePending,
}: {
  editor: Editor | null;
  onInsertImageClick: () => void;
  imagePending: boolean;
}) {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-neutral-lighter p-1.5">
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. List
      </ToolbarButton>
      <ToolbarButton
        label="Link"
        active={editor.isActive("link")}
        onClick={() => {
          const url = window.prompt("Link URL:", editor.getAttributes("link").href ?? "https://");
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().unsetLink().run();
          } else {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      >
        Link
      </ToolbarButton>
      <ToolbarButton label="Insert image" onClick={onInsertImageClick}>
        {imagePending ? "Uploading..." : "Image"}
      </ToolbarButton>
      <ToolbarButton label="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
        Clear
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  name,
  defaultValue,
  label,
}: {
  name: string;
  defaultValue?: string | null;
  label?: string;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");
  const [imagePending, setImagePending] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      // StarterKit bundles its own Link extension in this TipTap version —
      // disable it so the explicit, differently-configured one below is the
      // only one registered (having both throws a "duplicate extension" warning).
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ HTMLAttributes: { class: "rounded-image" } }),
    ],
    content: defaultValue ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[120px] px-3 py-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  // Defense-in-depth for callers that don't key this component by record id
  // (every current admin form does — see e.g. blog/[id]/page.tsx — which
  // remounts this on record change and makes this effect a no-op there).
  // Keeps the hidden field in sync if defaultValue still arrives/changes
  // after mount for some caller that isn't keyed that way.
  useEffect(() => {
    if (editor && defaultValue !== undefined && editor.getHTML() !== defaultValue) {
      editor.commands.setContent(defaultValue ?? "");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing to an external editor's imperative state, not something a key/render-time adjustment can express
      setHtml(defaultValue ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again later
    if (!file || !editor) return;
    setImageError(null);
    setImagePending(true);
    const fd = new FormData();
    fd.set("file", file);
    try {
      const result = await uploadImage(fd);
      if (result.error) {
        setImageError(result.error);
      } else if (result.url) {
        editor.chain().focus().setImage({ src: result.url }).run();
        setHtml(editor.getHTML());
      }
    } finally {
      setImagePending(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-small font-semibold text-neutral-darkest">{label}</label>}
      <div className="rounded-form border border-neutral-lighter bg-white">
        <Toolbar
          editor={editor}
          imagePending={imagePending}
          onInsertImageClick={() => fileInputRef.current?.click()}
        />
        <EditorContent editor={editor} />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={handleFileSelected}
      />
      {imageError && <p className="text-tiny text-red-violet">{imageError}</p>}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
