"use client";
import Loading from "@/app/signin/loading";
import { ChromeIcon, GithubIcon, Link } from "lucide-react";
import { GetServerSideProps } from "next";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { CardContent } from "./ui/card";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sessions = await getSession(context);
  if (sessions) {
    console.log(sessions);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
const NewSignin = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow-lg ">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Sign Up</h2>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <div className="text-center text-muted-foreground">
          <CardContent>
            <div className="flex flex-col gap-2 ">
              <Button
                variant="outline"
                className="w-full bg-black text-white"
                onClick={() => signIn("google")}
              >
                <ChromeIcon className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
              <Button
                variant="outline"
                className="w-full  bg-black text-white"
                onClick={() => signIn("github")}
              >
                <GithubIcon className="mr-2 h-4 w-4" />
                Sign in with GitHub
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
};
export default NewSignin;
