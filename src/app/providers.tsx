"use client"

import system from "@/theme"
import { ChakraProvider } from "@chakra-ui/react"
import { ColorModeProvider } from "../components/ui/color-mode"
import { ThemeProvider } from "../contexts/theme-provider"
import GoogleTagManager from "@/components/GoogleTagManager"


export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>
        {/* <GoogleTagManager /> */}
        <ThemeProvider attribute="class" disableTransitionOnChange>
              {props.children}
        </ThemeProvider>
      </ColorModeProvider>
    </ChakraProvider>
  )
}