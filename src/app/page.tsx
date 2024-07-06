"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";
import { NEXT_AUTH } from "../lib/auth";

export default function Home() {
  const session = useSession(NEXT_AUTH);
  const router = useRouter();
  const handler = () => {
    signOut({ callbackUrl: "/signin " });
  };
  return (
    <ProtectedRoute>
      <div>
        hello
        {JSON.stringify(session)}
      </div>
      <Button onClick={handler}>Signout</Button>
      <Button onClick={() => router.push("/signin")}>Signin</Button>
    </ProtectedRoute>
  );
}
