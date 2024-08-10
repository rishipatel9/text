import React, { useEffect } from "react";
import { signIn } from "next-auth/react";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { BorderBeam } from "../magicui/border-beam";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BlurIn from "../magicui/blur-in";

export function SignupFormDemo() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) router.push("/");
  }, [session, status, router]);

  const handleSignIn = async (provider: any) => {
    try {
      await signIn(provider);
    } catch (error: any) {
      if (error.includes("You have previously signed in with")) {
        console.log(error);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="h-[100vh] w-full bg-black bg-grid-white/[0.2]  relative flex items-center justify-center overflow-hidden">
      <div className="absolute pointer-events-none inset-0 flex items-center justify- bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        <div className="max-w-md w-full mx-auto rounded-xl md:rounded-2xl md:p-8 px-10  ">
          <BorderBeam />
          <BlurIn
            word=" Welcome to text."
            className="text-4xl sm:text-6xl text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-2"
          />
          <p className=" font-normal text-sm max-w-sm text-center mt-2 text-neutral-300 from-neutral-200 to-neutral-500">
            Login to text. if you can because <br />
            we don't have a login flow yet.
          </p>

          <div className="bg-transparent-to-r from-transparent via-neutral-700 to-transparent my-4 h-[1px] w-full " />

          <div className="flex flex-col justify-center items-center space-y-4">
            <button
              className="relative group/btn flex space-x-2 sm:w-full items-center justify-center px-4 w-[120%] text-black rounded-md h-10 font-medium shadow-input  bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] border-custom "
              onClick={() => handleSignIn("google")}
            >
              <IconBrandGoogle className="h-4 w-4  text-neutral-300" />
              <span className=" text-neutral-300 text-sm">Google</span>
              <BottomGradient />
            </button>
            <button
              className="relative group/btn flex space-x-2 items-center justify-center px-4 sm:w-full w-[120%] text-black rounded-md h-10 font-medium shadow-input  bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] border-custom"
              onClick={() => handleSignIn("github")}
            >
              <IconBrandGithub className="h-4 w-4  text-neutral-300" />
              <span className=" text-neutral-300 text-sm">GitHub</span>
              <BottomGradient />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);

export default SignupFormDemo;
