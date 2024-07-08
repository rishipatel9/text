"use client";

import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";


export default function Home() {

  const { data: session } = useSession();
  const router = useRouter();
  
  

  return (
    <>
      <ProtectedRoute>
        <div>
          hello
          {JSON.stringify(session)}
        </div>
        <Button onClick={() => signOut()}>Signout</Button>
        <Button onClick={() => router.push("/signin")}>Signin</Button>
      </ProtectedRoute>
    </>

  );
}