"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";
import { Bold, Eraser, ImageIcon, Italic, Link as LinkIcon, List, ListOrdered, Loader2 } from "lucide-react";

import { uploadImage } from "@/app/admin/upload-action";
import { MAX_IMAGE_SIZE_BYTES, formatFileSize, UPLOAD_NETWORK_ERROR } from "@/lib/upload-limits";
import { FormField } from "@/components/admin/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Toggle } from "@/components/admin/ui/toggle";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

function Toolbar({
  editor,
  onInsertImageClick,
  imagePending,
  allowImage,
}: {
  editor: Editor | null;
  onInsertImageClick: () => void;
  imagePending: boolean;
  allowImage: boolean;
}) {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border p-1.5">
      <Toggle
        size="sm"
        aria-label="Bold"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        aria-label="Italic"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </Toggle>
      <Select
        value={String(HEADING_LEVELS.find((level) => editor.isActive("heading", { level })) ?? "paragraph")}
        onValueChange={(value) => {
          if (value === "paragraph") {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading({ level: Number(value) as (typeof HEADING_LEVELS)[number] }).run();
          }
        }}
      >
        <SelectTrigger size="sm" className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Paragraph</SelectItem>
          {HEADING_LEVELS.map((level) => (
            <SelectItem key={level} value={String(level)}>
              Heading {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Toggle
        size="sm"
        aria-label="Bullet list"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        aria-label="Numbered list"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        aria-label="Link"
        pressed={editor.isActive("link")}
        onPressedChange={() => {
          const url = window.prompt("Link URL:", editor.getAttributes("link").href ?? "https://");
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().unsetLink().run();
          } else {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      >
        <LinkIcon className="size-4" />
      </Toggle>
      {allowImage && (
        <Toggle size="sm" aria-label="Insert image" onPressedChange={onInsertImageClick}>
          {imagePending ? <Loader2 className="size-4 animate-spin" /> : <ImageIcon className="size-4" />}
        </Toggle>
      )}
      <Toggle
        size="sm"
        aria-label="Clear formatting"
        onPressedChange={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
      >
        <Eraser className="size-4" />
      </Toggle>
    </div>
  );
}

export function RichTextEditor({
  name,
  defaultValue,
  label,
  allowImage = true,
}: {
  name: string;
  defaultValue?: string | null;
  label?: string;
  allowImage?: boolean;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");
  const [imagePending, setImagePending] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Link.configure({ openOnClick: false, autolink: true }),
      ...(allowImage ? [Image.configure({ HTMLAttributes: { class: "rounded-image w-full h-auto" } })] : []),
    ],
    content: defaultValue ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm rich-text-editor max-w-none min-h-[120px] px-3 py-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

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
    e.target.value = "";
    if (!file || !editor) return;
    setImageError(null);
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError(`File is ${formatFileSize(file.size)} — maximum allowed size is ${formatFileSize(MAX_IMAGE_SIZE_BYTES)}.`);
      return;
    }
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
    } catch {
      setImageError(UPLOAD_NETWORK_ERROR);
    } finally {
      setImagePending(false);
    }
  }

  const body = (
    <>
      <div className="rounded-lg border border-input">
        <Toolbar
          editor={editor}
          imagePending={imagePending}
          allowImage={allowImage}
          onInsertImageClick={() => fileInputRef.current?.click()}
        />
        <EditorContent editor={editor} />
      </div>
      {allowImage && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="sr-only"
          onChange={handleFileSelected}
        />
      )}
      {imageError && <p className="text-xs text-destructive">{imageError}</p>}
      <input type="hidden" name={name} value={html} />
    </>
  );

  return label ? <FormField label={label}>{body}</FormField> : <div className="flex flex-col gap-1.5">{body}</div>;
}
