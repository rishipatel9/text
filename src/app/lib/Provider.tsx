"use client"
import { SessionProvider } from "next-auth/react"
import React from "react"
export const Provider =({children}:{
    children:React.ReactNode
})=>(
    <SessionProvider>{children}</SessionProvider>
)