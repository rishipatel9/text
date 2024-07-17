"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SignupFormDemo } from "@/components/Signin";
export default function Home() {
 

  return (
    <ProtectedRoute>
    <div className="bg-black h-full w-full">
      <div className="h-[50rem] w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">  
        <SignupFormDemo/>
        </div>
      </div>
    </div>

    </ProtectedRoute>
  );
}
