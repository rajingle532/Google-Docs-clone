"use client";

import Header from "@/components/Header";
import DocumentRow from "@/components/DocumentRow";
import {
  ThemeProvider,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { MoreVertical, FolderOpen, Plus, FileText } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Login from "@/components/Login";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  /* ── Firestore real-time listener ── */
  const [snapshot, loading, error] = useCollection(
    session?.user?.email
      ? query(
          collection(db, "documents"),
          where("ownerEmail", "==", session.user.email)
        )
      : null
  );

  const [documentRows, setDocumentRows] = useState([]);
  useEffect(() => {
    if (error) {
      console.error("Firestore error:", error.message, error.code);
    }
    if (snapshot && !error) {
      // Sort client-side by timestamp descending (avoids needing composite index)
      const sorted = [...snapshot.docs].sort((a, b) => {
        const aTime = a.data().timestamp?.toMillis?.() || 0;
        const bTime = b.data().timestamp?.toMillis?.() || 0;
        return bTime - aTime;
      });

      const documents = sorted.map((doc) => (
        <DocumentRow
          key={doc.id}
          id={doc.id}
          fileName={doc.data().fileName}
          date={doc.data().timestamp}
        />
      ));
      setDocumentRows(documents);
    }
  }, [snapshot, error]);

  if (status === "loading") return <LoadingSkeleton />;
  if (!session) return <Login />;

  const deleteAllDocuments = async () => {
    if (!snapshot || snapshot.docs.length === 0) return;
    if (!confirm("Are you sure you want to delete ALL documents? This cannot be undone.")) return;
    
    try {
      for (const document of snapshot.docs) {
        await deleteDoc(doc(db, "documents", document.id));
      }
    } catch (err) {
      console.error("Failed to delete all documents", err);
    }
  };
  /* ── createDocument ── */
  const createDocument = async () => {
    if (!input.trim() || isCreating) return;

    const trimmedName = input.trim();
    setIsCreating(true);
    try {
      const userEmail = session?.user?.email;
      if (!userEmail) throw new Error("No user email in session");

      const docRef = await addDoc(collection(db, "documents"), {
        fileName: trimmedName,
        ownerEmail: userEmail,
        sharedWith: [],
        timestamp: serverTimestamp(),
        editorState: null,
      });

      setInput("");
      setShowModal(false);
      window.location.href = `/doc/${docRef.id}`;
    } catch (error) {
      console.error("Error creating document:", error?.code, error?.message);
      alert(`Failed to create document.\nReason: ${error?.message || "Permission denied — check Firestore rules"}`);

    } finally {
      setIsCreating(false);
    }
  };

  /* ── Modal — Material Tailwind Dialog, logic unchanged ── */
  const modal = (
    <Dialog 
      size="xs" 
      open={showModal} 
      handler={() => setShowModal(false)}
      style={{
        background: "var(--surface)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <DialogBody>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          style={{
            width: "100%",
            outline: "none",
            border: "none",
            fontSize: 16,
            color: "var(--text-primary)",
            background: "transparent",
            caretColor: "var(--accent)",
          }}
          placeholder="Enter name of document..."
          onKeyDown={(e) => e.key === "Enter" && createDocument()}
          autoFocus
        />
      </DialogBody>
      <DialogFooter style={{ display: "flex", gap: 12 }}>
        <Button
          variant="text"
          onClick={() => setShowModal(false)}
          style={{ color: "var(--accent)" }}
        >
          Cancel
        </Button>
        <Button
          color="blue"
          variant="filled"
          onClick={() => createDocument()}
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create"}
        </Button>
      </DialogFooter>
    </Dialog>
  );

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Pure CSS Flawless Rotating Moon Background */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, background: "radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)", overflow: "hidden", pointerEvents: "none" }}>
         {/* Static Stars */}
         <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)", backgroundSize: "100px 100px", opacity: 0.3 }} />
         <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)", backgroundSize: "150px 150px", opacity: 0.2, transform: "rotate(45deg)" }} />
         
         {/* The Rotating Moon */}
         <motion.div
           animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
           transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
           style={{
             position: "absolute",
             top: "10%",
             right: "10%",
             width: "60vh",
             height: "60vh",
             minWidth: 400,
             minHeight: 400,
             borderRadius: "50%",
             backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/d/db/Moonmap_from_clementine_data.png')",
             backgroundSize: "200% 100%",
             boxShadow: "inset -20px 0 60px rgba(0,0,0,0.8), 0 0 80px rgba(255,255,255,0.1)",
             opacity: 1,
             filter: "grayscale(100%) contrast(1.4) brightness(1.1)"
           }}
         />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Header />
      {modal}

      {/* ── NEW DOCUMENT SECTION ── */}
      <section
        style={{
          background: "var(--glass-bg)",
          borderBottom: "1px solid var(--glass-border)",
          padding: "32px 24px",
        }}
      >
        <div style={{ maxWidth: 800, marginLeft: 48 }}>
          <p
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--glass-text)",
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Start a new document
          </p>

          {/* Blank document card with 3D tilt */}
          <motion.div
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.03, rotateY: 3, rotateX: -3, z: 20 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              width: 148,
              height: 192,
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              position: "relative",
              transformPerspective: 1000,
              boxShadow: "var(--shadow-sm)"
            }}
          >
            {/* Document icon with + badge */}
            <div style={{ position: "relative" }}>
              <FileText size={48} color="var(--accent)" strokeWidth={1.2} />
              <div
                style={{
                  position: "absolute",
                  bottom: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  borderRadius: "var(--radius-full)",
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <Plus size={12} color="var(--text-on-accent)" strokeWidth={2.5} />
              </div>
            </div>
            <span
              style={{
                fontSize: 20,
                color: "var(--glass-text)",
                fontWeight: 700,
                textAlign: "center",
                padding: "0 8px",
              }}
            >
              Blank document
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.1)" }} />

      {/* ── RECENT DOCUMENTS SECTION ── */}
      <section style={{ padding: "24px", background: "var(--glass-bg)", minHeight: "50vh" }}>
        <div style={{ maxWidth: 800, marginLeft: 48 }}>
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "var(--glass-text)",
              }}
            >
              Recent documents
            </span>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button
                onClick={deleteAllDocuments}
                style={{
                  background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)"
                }}
              >
                Delete All
              </button>
              <IconBtn aria-label="List view" title="List view" style={{ color: "#e8eaed" }}>
                <FolderOpen size={20} color="#e8eaed" />
              </IconBtn>
            </div>
          </div>

          {/* Column header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr 180px 48px",
              padding: "0 8px",
              marginBottom: 4,
            }}
          >
            <div />
            <span style={{ fontSize: 20, color: "var(--glass-text-secondary)", fontWeight: 800, paddingLeft: 4 }}>Title</span>
            <span
              style={{
                fontSize: 20,
                color: "var(--glass-text-secondary)",
                fontWeight: 800,
                textAlign: "right",
                paddingRight: 24,
              }}
            >
              Date created
            </span>
            <div />
          </div>

          {/* Rows */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {documentRows && documentRows.length > 0 ? (
              documentRows
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 0",
                  color: "var(--text-tertiary)",
                  fontSize: 14,
                }}
              >
                No documents yet. Create your first one above!
              </div>
            )}
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}

/** Small icon button */
function IconBtn({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        width: 36,
        height: 36,
        borderRadius: "var(--radius-full)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-secondary)",
        transition: "var(--transition)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-hover)";
        e.currentTarget.style.color = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--text-secondary)";
      }}
    >
      {children}
    </button>
  );
}
