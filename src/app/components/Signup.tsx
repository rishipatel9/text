/**
 * v0 by Vercel.
 * @see https://v0.dev/t/WBr9O6kX2yM
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { CardContent } from "@/components/ui/card"
import { ChromeIcon, GithubIcon } from "lucide-react"
import { Separator } from "@radix-ui/react-separator"
import { useRouter } from "next/navigation"


function Signup() {
  const session=useSession();
  const router=useRouter();
  if(session.status==='authenticated') router.push('/');

  return (
    
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Sign Up</h2>
          <p className="text-muted-foreground">Create your account</p>
        </div>
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Enter your name" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" required />
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
          <Separator className="my-6" />
          <CardContent>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={()=>signIn('google')}>
              <ChromeIcon className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
            <Button variant="outline" className="w-full" onClick={()=>signIn('github')}>
              <GithubIcon className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </Button>
          </div>
        </CardContent>
        </form>
        <div className="text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="#" className="font-medium hover:underline" prefetch={false}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup;