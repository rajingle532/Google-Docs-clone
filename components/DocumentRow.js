"use client";
import { FileText, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { db } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

function DocumentRow({ id, fileName, date }) {
  const router = useRouter();
  const { data: session } = useSession();
  const formattedDate = date ? date.toDate().toLocaleDateString() : "";

  /* ── deleteDoc logic — unchanged ── */
  const deleteDocument = async (docId) => {
    const confirmDelete = confirm(`Are you sure you want to delete "${fileName}"?`);
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "documents", docId));
      console.log("Document deleted successfully:", docId);
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document. Access denied or network error.");
    }
  };

  return (
    <motion.div
      className="doc-row"
      whileHover={{ scale: 1.005, x: 4 }}
      whileTap={{ scale: 0.995 }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 48px",
        alignItems: "center",
        height: 56,
        borderRadius: "var(--radius-md)",
        transition: "var(--transition)",
        marginBottom: 4,
        background: "var(--glass-bg)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
        border: "1px solid var(--glass-border)",
      }}
    >
      {/* Step 1: Clickable Area (Navigation via router.push) */}
      <div 
        onClick={() => {
          window.location.href = `/doc/${id}`;
        }}
        style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 180px",
          alignItems: "center",
          height: "100%",
          padding: "0 8px",
          cursor: "pointer",
        }}
      >
        {/* Icon cell */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FileText size={20} color="var(--accent)" strokeWidth={1.5} />
        </div>

        {/* Title + owner badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "var(--glass-text)",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {fileName}
          </span>
          <span
            style={{
              fontSize: 12,
              background: "var(--accent-light)",
              color: "var(--accent)",
              borderRadius: "var(--radius-full)",
              padding: "2px 8px",
              flexShrink: 0,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            owner
          </span>
        </div>

        {/* Date cell */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "var(--glass-text-secondary)",
            textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            textAlign: "right",
            paddingRight: 16,
            whiteSpace: "nowrap",
          }}
        >
          {formattedDate}
        </div>
      </div>

      {/* Actions Area (No Navigation) */}
      <div
        className="doc-row-actions"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          height: "100%",
          borderLeft: "1px solid var(--glass-border)",
        }}
      >
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button
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
                color: "#e8eaed",
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#e8eaed";
              }}
              aria-label="Document options"
            >
              <MoreVertical size={18} />
            </button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Document Actions"
            onAction={(key) => deleteDocument(key)}
            style={{ background: "#2a2a35", border: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            <DropdownItem
              key={id}
              className="text-danger"
              color="danger"
              textValue="Delete document"
            >
              <span style={{ fontSize: 14, color: "var(--danger)", fontWeight: 500 }}>
                Delete document
              </span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </motion.div>
  );
}

export default DocumentRow;
