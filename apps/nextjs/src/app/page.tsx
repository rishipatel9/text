"use client";
import ProfileCard from "@/components/ProfileCard";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Channel, Chat, MessageInput, MessageList } from "stream-chat-react";

export default function Home() {
  const { data: session, status } = useSession();
  // const router = useRouter();
  if(session){
    return (
        <div className="lg:h-[100vh] lg:w-[100vw] lg:flex bg-black  ">
          <div className=" w-[25%] bg-black border-custom lg:m-2 rounded-custom">
          <ProfileCard/>
          </div>
          <div className="bg-black w-[75%] border-custom lg:m-2 rounded-custom">

          </div>
        </div>
    )
  }
  // if(!session){
  //   router.push('/signin');
  // }

}
