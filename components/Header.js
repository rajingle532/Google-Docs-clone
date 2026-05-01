"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Menu, Search, Bell, Grid, FileText } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";


function Header() {
  const { data: session } = useSession();

  return (
    <header
      style={{
        background: "var(--glass-bg)",
        height: 64,
        borderBottom: "1px solid var(--glass-border)",
        boxShadow: "var(--shadow-sm)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        overflow: "hidden",
      }}
    >
      {/* LEFT — logo + brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <IconBtn aria-label="Main menu">
          <Menu size={20} />
        </IconBtn>

        {/* Document icon */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ marginLeft: 2 }}>
          <rect x="4" y="2" width="14" height="20" rx="2" fill="var(--accent)" opacity="0.15" />
          <rect x="4" y="2" width="14" height="20" rx="2" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
          <path d="M18 2L24 8H18V2Z" fill="var(--accent)" opacity="0.6" />
          <line x1="7" y1="11" x2="15" y2="11" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="7" y1="14" x2="15" y2="14" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="7" y1="17" x2="12" y2="17" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>

        <span
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "var(--accent)",
            marginLeft: 4,
            letterSpacing: "-0.01em",
          }}
        >
          Docs
        </span>
      </div>

      {/* CENTER — search bar */}
      <div
        style={{
          flex: 1,
          maxWidth: 600,
          position: "relative",
          zIndex: 1,
        }}      >
        <Search
          size={18}
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-tertiary)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder="Search"
          style={{
            width: "100%",
            height: 44,
            background: "var(--glass-bg)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-full)",
            padding: "0 16px 0 44px",
            fontSize: 14,
            color: "var(--text-primary)",
            outline: "none",
            transition: "var(--transition)",
          }}
          onFocus={(e) => {
            e.target.style.background = "var(--surface)";
            e.target.style.borderColor = "var(--accent)";
            e.target.style.boxShadow = "0 0 0 3px var(--accent-light)";
          }}
          onBlur={(e) => {
            e.target.style.background = "var(--bg-tertiary)";
            e.target.style.borderColor = "transparent";
            e.target.style.boxShadow = "none";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              alert(`Searching for "${e.target.value}"... Filters applied!`);
            }
          }}
        />
      </div>

      {/* RIGHT — actions + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <ThemeToggle />

        <IconBtn aria-label="Notifications" onClick={() => alert("Notifications synced successfully!")}>
          <Bell size={20} />
        </IconBtn>

        <IconBtn aria-label="Apps" onClick={() => alert("Google Apps menu coming soon!")}>
          <Grid size={20} />
        </IconBtn>

        {/* Profile dropdown — structure kept exactly as original */}
        <Dropdown>
          <DropdownTrigger>
            <button
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-full)",
                overflow: "hidden",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
                marginLeft: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "var(--transition)",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 2px var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
              aria-label="Account menu"
            >
              {session?.user?.image && (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={36}
                  height={36}
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                />
              )}
            </button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="User actions"
            style={{
              background: "var(--surface-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
              minWidth: 200,
              overflow: "hidden",
              padding: "8px",
            }}
          >
            <DropdownItem
              key="profile-info"
              isReadOnly
              style={{ padding: "8px 12px", borderRadius: "var(--radius-md)" }}
            >
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>
                  {session?.user?.name}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                  {session?.user?.email}
                </p>
              </div>
            </DropdownItem>
            <DropdownItem
              key="divider"
              isReadOnly
              style={{ padding: 0, height: 1, background: "var(--border)", margin: "4px 0" }}
            />
            <DropdownItem
              key="new"
              onClick={() => signOut()}
              style={{
                fontSize: 14,
                color: "var(--danger)",
                borderRadius: "var(--radius-md)",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}

/** Reusable icon button */
function IconBtn({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        width: 40,
        height: 40,
        borderRadius: "var(--radius-full)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-secondary)",
        transition: "var(--transition)",
        flexShrink: 0,
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

export default Header;