"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@material-tailwind/react";

const Provider = ({ children }) => {
  return (
    <ThemeProvider>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
};

export default Provider;
