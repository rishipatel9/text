"use client"
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import { NEXT_AUTH } from "./lib/auth";

export default function Home() {

  const session =useSession(NEXT_AUTH);
  const router=useRouter();
  const handler = ()=>{
    signOut({callbackUrl:'/signup '});
    // router.push('/api/auth/signin');
  }
  return (
    <ProtectedRoute>
    <div>
      hello
      {JSON.stringify(session)}
    </div>
    <Button onClick={handler}>Signout</Button>
    </ProtectedRoute>
  );
}
