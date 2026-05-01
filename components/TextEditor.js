"use client";
import dynamic from "next/dynamic";
import { EditorState } from "draft-js";
import { useEffect, useState, useRef } from "react";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { convertToRaw, convertFromRaw, Modifier, RichUtils, getDefaultKeyBinding } from "draft-js";
import { useSession } from "next-auth/react";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

const EditorScene = dynamic(
  () => import("@/components/3d/EditorScene"),
  { ssr: false }
);

const TextEditor = ({ id, docData }) => {
  const { data: session } = useSession();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isReady, setIsReady] = useState(false);
  const hasInitialized = useRef(false);
  const [pageWidth, setPageWidth] = useState(816);

  // Initialize editor with saved content from Firestore
  useEffect(() => {
    if (!docData || hasInitialized.current) return;

    try {
      if (docData.editorState) {
        setEditorState(
          EditorState.createWithContent(convertFromRaw(docData.editorState))
        );
      } else {
        setEditorState(EditorState.createEmpty());
      }
    } catch (e) {
      console.error("Failed to restore editor state:", e);
      setEditorState(EditorState.createEmpty());
    }

    hasInitialized.current = true;
    setIsReady(true);
  }, [docData]);

  const [isSaving, setIsSaving] = useState(false);

  // Autosave to Firestore with 1s debounce
  useEffect(() => {
    if (!editorState || !isReady || !id) return;

    const timer = setTimeout(async () => {
      const content = editorState.getCurrentContent();

      setIsSaving(true);
      try {
        await setDoc(
          doc(db, "documents", id),
          {
            editorState: convertToRaw(content),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Autosave failed:", error);
      } finally {
        setIsSaving(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [editorState, id, isReady]);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };



  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 3D particle network — behind editor content */}
      <EditorScene />
      {/* Saving indicator */}
      {isSaving && (
        <div
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            background: "var(--surface-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "8px 16px",
            fontSize: 12,
            color: "var(--text-secondary)",
            boxShadow: "var(--shadow-md)",
            zIndex: 200,
          }}
        >
          💾 Saving...
        </div>
      )}

      {/* 
        Toolbar is rendered FULL WIDTH by the Editor component.
        The editor canvas is constrained inside wrapperStyle.
        toolbarStyle stretches to 100vw so buttons spread across.
      */}
      <div style={{ position: "relative" }}>
        {/* Page Width Slider */}
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 12,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "6px 14px",
            borderRadius: "20px",
            background: "linear-gradient(145deg, rgba(75, 85, 99, 0.4), rgba(31, 41, 55, 0.7))",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.6)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
            borderRight: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: "inset 0 2px 6px rgba(255, 255, 255, 0.15), inset 0 -2px 6px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.6)",
            fontSize: 13,
            color: "#9ca3af",
            userSelect: "none",
          }}
        >
          <span style={{ fontSize: 14, color: "#6b7280", lineHeight: 1 }}>↔</span>
          <input
            type="range"
            min={400}
            max={1400}
            step={10}
            value={pageWidth}
            onChange={(e) => setPageWidth(Number(e.target.value))}
            style={{
              width: 160,
              height: 4,
              cursor: "pointer",
              accentColor: "#9ca3af",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 2,
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
            }}
            title={`Page width: ${pageWidth}px`}
          />
          <span
            style={{
              fontVariantNumeric: "tabular-nums",
              minWidth: 44,
              textAlign: "right",
              fontSize: 12,
              fontWeight: 500,
              color: "#e5e7eb",
            }}
          >
            {pageWidth}px
          </span>
          <button
            className="menu-btn-rainbow"
            onClick={() => setPageWidth(816)}
            style={{
              fontSize: 14,
              fontWeight: 500,
              padding: "4px 12px",
              background: "transparent",
              color: "#e5e7eb",
              cursor: "pointer",
              border: "none",
            }}
            title="Reset to default width (816px)"
          >
            <span style={{ position: "relative", zIndex: 1 }}>Reset</span>
          </button>
        </div>
        <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName="docs-editor-wrapper"
        toolbarClassName="docs-editor-toolbar"
        editorClassName="docs-editor-canvas"
        toolbarStyle={{
          background: "linear-gradient(180deg, #2a2a35 0%, #1a1a24 100%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          borderBottom: "2px solid rgba(0, 0, 0, 0.9)",
          borderLeft: "none",
          borderRight: "none",
          padding: "6px 12px",
          margin: 0,
          boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.05), 0 8px 16px rgba(0, 0, 0, 0.5)",
        }}
        editorStyle={{
          background: "var(--surface)",
          color: "var(--text-primary)",
          minHeight: 1056,
          padding: "72px 96px",
          fontSize: "14.67px",
          lineHeight: 1.6,
          boxShadow: "var(--shadow-md)",
          borderRadius: 2,
          maxWidth: pageWidth,
          margin: "24px auto 40px",
        }}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
            "textAlign",
            "colorPicker",
            "link",
            "emoji",
            "image",
            "remove",
            "history",
          ],
          inline: {
            inDropdown: false,
            options: [
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "monospace",
              "superscript",
              "subscript",
            ],
          },
          blockType: {
            inDropdown: true,
            options: [
              "Normal",
              "H1",
              "H2",
              "H3",
              "H4",
              "H5",
              "H6",
              "Blockquote",
              "Code",
            ],
          },
          fontSize: {
            options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72],
          },
          fontFamily: {
            options: [
              "Arial",
              "Georgia",
              "Impact",
              "Tahoma",
              "Times New Roman",
              "Verdana",
              "Courier New",
            ],
          },
          list: {
            inDropdown: false,
            options: ["unordered", "ordered", "indent", "outdent"],
          },
          textAlign: {
            inDropdown: false,
            options: ["left", "center", "right", "justify"],
          },
          colorPicker: {
            colors: [
              "rgb(26,26,26)",
              "rgb(68,68,68)",
              "rgb(102,102,102)",
              "rgb(153,153,153)",
              "rgb(204,204,204)",
              "rgb(238,238,238)",
              "rgb(243,243,243)",
              "rgb(255,255,255)",
              "rgb(255,0,0)",
              "rgb(255,153,0)",
              "rgb(255,255,0)",
              "rgb(0,255,0)",
              "rgb(0,255,255)",
              "rgb(0,0,255)",
              "rgb(153,0,255)",
              "rgb(255,0,255)",
            ],
          },
          link: {
            inDropdown: false,
            showOpenOptionOnHover: true,
            defaultTargetOption: "_blank",
            options: ["link", "unlink"],
          },
          emoji: {
            emojis: [
              "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆",
              "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗",
              "🤔", "🤐", "😐", "😑", "😶", "😏", "😒", "🙄",
              "👍", "👎", "👏", "🙌", "🤝", "🙏", "💪", "✌️",
              "❤️", "🔥", "⭐", "✅", "❌", "💯", "🎉", "🚀",
            ],
          },
          history: {
            inDropdown: false,
            options: ["undo", "redo"],
          },
        }}
      />
      </div>
    </div>
  );
};

export default TextEditor;
