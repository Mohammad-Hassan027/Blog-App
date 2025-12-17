import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect, useMemo } from "react";
import TurndownService from "turndown"; // Converts HTML -> Markdown
import { marked } from "marked"; // Converts Markdown -> HTML
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaParagraph,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaUndo,
  FaRedo,
  FaEraser,
  FaLink,
  FaImage,
} from "react-icons/fa";
import { GoHorizontalRule } from "react-icons/go";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";

const ToolbarButton = ({ onClick, disabled, isActive, children, title }) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    disabled={disabled}
    title={title}
    type="button"
    className={`
      p-2 rounded-md transition-all duration-200 text-sm font-medium flex items-center justify-center
      ${
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "hover:scale-105 active:scale-95"
      }
      ${
        isActive
          ? "bg-orange-100 text-orange-600 shadow-sm ring-1 ring-orange-200"
          : "text-stone-600 hover:bg-stone-200 hover:text-stone-900"
      }
    `}
  >
    {children}
  </button>
);

const MenuBar = ({ editor, loading }) => {
  if (!editor) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-1 p-2 border-b bg-stone-50 border-stone-200 rounded-t-lg ${
        loading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Group 1: Formatting */}
      <div className="flex gap-1 pr-2 mr-1 border-r border-stone-300/50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <FaBold size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <FaItalic size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <FaStrikethrough size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Inline Code"
        >
          <FaCode size={14} />
        </ToolbarButton>
      </div>

      {/* Group 2: Headings */}
      <div className="flex gap-1 pr-2 mr-1 border-r border-stone-300/50">
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive("paragraph")}
          title="Paragraph"
        >
          <FaParagraph size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <LuHeading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <LuHeading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <LuHeading3 size={16} />
        </ToolbarButton>
      </div>

      {/* Group 3: Lists & Blocks */}
      <div className="flex gap-1 pr-2 mr-1 border-r border-stone-300/50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <FaListUl size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <FaListOl size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <FaQuoteRight size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <GoHorizontalRule size={14} />
        </ToolbarButton>
      </div>

      {/* Group 4: History */}
      <div className="flex gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo"
        >
          <FaUndo size={12} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo"
        >
          <FaRedo size={12} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          title="Clear Formatting"
        >
          <FaEraser size={14} />
        </ToolbarButton>
      </div>
      <div className="flex gap-1">
        <ToolbarButton
          title="Link"
          onClick={() => {
            const url = window.prompt("URL");
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
        >
          <FaLink size={14} />
        </ToolbarButton>
        <ToolbarButton
          title="Image"
          onClick={() => {
            const url = window.prompt("URL");

            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
        >
          <FaImage size={14} />
        </ToolbarButton>
      </div>
    </div>
  );
};

const MarkdownEditor = ({
  value,
  onChange,
  id = "markdown-content",
  loading,
  isUploading,
}) => {
  const isDisabled = loading || isUploading;

  // Initialize Turndown Service
  const turndownService = useMemo(() => {
    const service = new TurndownService({
      headingStyle: "atx", // # Heading 1
      codeBlockStyle: "fenced", // ``` code ```
      bulletListMarker: "-", // - List item
    });
    return service;
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-stone max-w-none focus:outline-none min-h-[250px] px-4 py-3",
      },
    },
    // OUTPUT: Convert HTML -> Markdown on change
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html === "<p></p>") {
        onChange({ target: { value: "" } });
      } else {
        const markdown = turndownService.turndown(html);
        onChange({ target: { value: markdown } });
      }
    },
    editable: !isDisabled,
  });

  // INPUT: Convert Markdown -> HTML on initial load or external change
  useEffect(() => {
    if (editor && value) {
      // Check if editor is empty or matches the *previous* content to avoid cursor jumps
      // Only set content if the editor is empty (initial load)
      if (editor.getText() === "") {
        // marked.parse returns a Promise if async is true, but by default it's synchronous string
        // We force it to synchronous just in case or assume standard usage
        const htmlContent = marked.parse(value, { async: false });
        editor.commands.setContent(htmlContent);
      }
    }
  }, [value, editor]);

  // Handle Disable State
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isDisabled);
    }
  }, [isDisabled, editor]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-stone-700" htmlFor={id}>
        Content 📝{" "}
        <span className="text-xs font-normal text-stone-500">
          (Markdown supported)
        </span>
      </label>

      <div
        className={`
          w-full transition-all border rounded-lg shadow-sm bg-white
          ${
            isDisabled
              ? "opacity-60 cursor-not-allowed bg-stone-50"
              : "hover:shadow-md"
          }
          border-stone-200 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500
        `}
      >
        <MenuBar editor={editor} loading={isDisabled} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default MarkdownEditor;
