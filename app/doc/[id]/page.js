"use client";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Login from "@/components/Login";
import { collection, doc } from "firebase/firestore";
import Image from "next/image";
import TextEditor from "@/components/TextEditor";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ThemeToggle from "@/components/ThemeToggle";
import { Share2 } from "lucide-react";


const page = ({ params }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const id = params.id;

  // Step 4: Fix Data Fetching
  const [snapshot, loadingSnapshot] = useDocumentOnce(
    id ? doc(db, "documents", id) : null
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    // Don't run auth check until session is fully loaded
    if (status !== "authenticated" || !session?.user?.email) return;

    if (!loadingSnapshot && snapshot) {
      const data = snapshot.data();

      if (!data) {
        console.warn("Document not found, redirecting to home...");
        router.push("/");
        return;
      }

      // Authorization check — only block if ownerEmail exists AND doesn't match
      const userEmail = session.user.email;
      const ownerEmail = data.ownerEmail;
      const sharedWith = data.sharedWith || [];

      // If there's no ownerEmail field, allow access (legacy docs)
      if (!ownerEmail) return;

      const isAuthorized =
        ownerEmail === userEmail || sharedWith.includes(userEmail);

      if (!isAuthorized) {
        console.error("Access denied. Your email:", userEmail, "Owner:", ownerEmail);
        alert("Access Denied: You do not have permission to view this document.");
        router.push("/");
      }
    }
  }, [snapshot, loadingSnapshot, session, status, router, id]);

  // Step 7: Fix Loading State
  if (status === "loading" || loadingSnapshot) return <LoadingSkeleton />;
  if (!session) return <Login />;

  const docData = snapshot?.data();
  if (!docData) {
    return null; // useEffect will redirect, avoid render flash
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)", display: "flex", flexDirection: "column" }}>

      {/* ── EDITOR HEADER ── */}
      <header
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-sm)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          padding: "0 16px",
        }}
      >
        {/* Top row: logo + title + actions */}
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Back to docs — 3D styled logo */}
          <button
            onClick={() => router.push("/")}
            style={{
              width: 52, height: 52,
              borderRadius: 14,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease",
              flexShrink: 0,
              perspective: 600,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "rotateY(-12deg) rotateX(8deg) scale(1.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "rotateY(0) rotateX(0) scale(1)"; }}
            aria-label="Back to documents"
          >
            <svg width="40" height="48" viewBox="0 0 40 48" fill="none" style={{ filter: "drop-shadow(2px 4px 6px rgba(66,133,244,0.35))" }}>
              {/* Shadow layer */}
              <rect x="6" y="6" width="26" height="36" rx="3" fill="#1a1a2e" opacity="0.25" />
              {/* Back page */}
              <rect x="4" y="4" width="26" height="36" rx="3" fill="#2563eb" opacity="0.35" />
              {/* Main page */}
              <rect x="2" y="2" width="26" height="36" rx="3" fill="url(#docGrad3d)" />
              <rect x="2" y="2" width="26" height="36" rx="3" stroke="#60a5fa" strokeWidth="1" fill="none" opacity="0.6" />
              {/* Corner fold */}
              <path d="M28 2L36 10H28V2Z" fill="#93c5fd" />
              <path d="M28 2L36 10H28V2Z" fill="url(#foldGrad)" opacity="0.7" />
              {/* Text lines */}
              <line x1="8" y1="16" x2="22" y2="16" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="8" y1="21" x2="22" y2="21" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
              <line x1="8" y1="26" x2="17" y2="26" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
              {/* Shine overlay */}
              <rect x="2" y="2" width="13" height="36" rx="3" fill="white" opacity="0.06" />
              <defs>
                <linearGradient id="docGrad3d" x1="2" y1="2" x2="28" y2="38" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="foldGrad" x1="28" y1="2" x2="36" y2="10" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
          </button>

          {/* Document title */}
          <div style={{ flex: 1, minWidth: 0, paddingLeft: 4 }}>
            <div
              style={{
                display: "inline-block",
                padding: "4px 14px",
                fontSize: 19,
                fontWeight: 600,
                background: "rgba(255, 255, 255, 0.04)",
                borderRadius: 8,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 14px rgba(96, 165, 250, 0.12)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                letterSpacing: "0.2px",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.07)";
                e.currentTarget.style.borderColor = "rgba(96, 165, 250, 0.3)";
                e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 20px rgba(96, 165, 250, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 14px rgba(96, 165, 250, 0.12)";
              }}
            >
              <span style={{ 
                background: "linear-gradient(135deg, #e8eaed 0%, #93c5fd 100%)", 
                WebkitBackgroundClip: "text", 
                WebkitTextFillColor: "transparent" 
              }}>
                {snapshot?.data()?.fileName || "Untitled Document"}
              </span>
            </div>
          </div>

          {/* Auto-save indicator */}
          <div
            title="Auto-saving to cloud..."
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "var(--success)",
              opacity: 0.7,
              animation: "pulse 2s ease-in-out infinite",
              flexShrink: 0,
            }}
          />

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <ThemeToggle />

            {/* Share button */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: snapshot?.data()?.fileName, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 36,
                padding: "0 16px",
                background: "var(--accent)",
                color: "var(--text-on-accent)",
                border: "none",
                borderRadius: "var(--radius-full)",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)"; }}
            >
              <Share2 size={16} />
              Share
            </button>

            {/* Avatar — signOut kept exactly as original */}
            {session?.user?.image && (
              <button
                onClick={() => signOut()}
                style={{
                  width: 40, height: 40,
                  borderRadius: "50%",
                  border: "2px solid rgba(255, 255, 255, 0.15)",
                  background: "linear-gradient(135deg, #4b5563 0%, #1f2937 100%)", /* Metallic grey */
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)",
                  cursor: "pointer",
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s",
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.transform = "scale(1.1) translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 14px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = "scale(1) translateY(0)"; 
                  e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)";
                }}
                title="Sign out"
              >
                <Image
                  src={session.user.image}
                  width={32}
                  height={32}
                  alt="Profile"
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                />
              </button>
            )}
          </div>
        </div>

        {/* Menu bar — all items functional */}
        <div style={{ height: 40, display: "flex", alignItems: "center", gap: 4 }}>
          {[
            {
              label: "File",
              action: () => window.print(),
              title: "Print document (Ctrl+P)",
            },
            {
              label: "Edit",
              action: () => {
                document.execCommand("selectAll");
              },
              title: "Select all text (Ctrl+A)",
            },
            {
              label: "View",
              action: () => {
                const editor = document.querySelector(".rdw-editor-main");
                if (editor) {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    editor.requestFullscreen?.();
                  }
                }
              },
              title: "Toggle fullscreen editor",
            },
            {
              label: "Insert",
              action: () => {
                const url = prompt("Enter URL to insert as link:");
                if (url) {
                  document.execCommand("createLink", false, url);
                }
              },
              title: "Insert link",
            },
            {
              label: "Format",
              action: () => {
                document.execCommand("removeFormat");
              },
              title: "Clear formatting",
            },
            {
              label: "Tools",
              action: () => {
                const text = document.querySelector(".public-DraftEditor-content")?.innerText || "";
                const words = text.trim().split(/\s+/).filter(Boolean).length;
                const chars = text.replace(/\s/g, "").length;
                alert(`📊 Word Count\n\nWords: ${words}\nCharacters (no spaces): ${chars}\nCharacters (with spaces): ${text.length}`);
              },
              title: "Word count",
            },
          ].map(({ label, action, title }) => (
            <button
              key={label}
              onClick={action}
              title={title}
              className="menu-btn-rainbow"
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "var(--text-secondary)",
                padding: "6px 16px",
                borderRadius: 8,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.15s ease",
                position: "relative",
                isolation: "isolate",
                overflow: "hidden",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── TEXT EDITOR ── */}
      <div style={{ flex: 1 }}>
        {docData ? (
          <TextEditor id={params.id} docData={docData} />
        ) : (
          <LoadingSkeleton />
        )}
      </div>
    </div>
  );
};

export default page;
