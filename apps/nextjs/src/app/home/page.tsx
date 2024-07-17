"use client";
import React from 'react'
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProtectedRoute from '@/components/ProtectedRoute';

const page = () => {
    const router = useRouter();
  return (
    <ProtectedRoute>
        <div>
        <button  onClick={() => router.push('/chat')}>Chats</button>
        <button  onClick={() => signOut()}>Signout</button>
        <button  onClick={() => router.push("/signin")}>Signin</button>
        </div>
    </ProtectedRoute>
  )
}

export default page
