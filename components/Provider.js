"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@material-tailwind/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const Provider = ({ children }) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <NextUIProvider>
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </NextUIProvider>
    </NextThemesProvider>
  );
};

export default Provider;
