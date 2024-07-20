"use client";
import ProfileCard from "@/components/ui/ProfileCard";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ActiveChatTopBar from "../ui/ActiveChatTopBar";
import { Input } from "../ui/input";
import { Button } from "../ui/moving-border";
import NoActiveChatsPage from "../ui/NoActiveChatsPage";
import UserProfileCard from "../ui/UserProfileCard";

export default function Chats() {

  const { data: session, status } = useSession();
  const [username, setUsername] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (!session) router.push('/signin');
  }, [session, status]);

  const handleSignOut = async () => {
    await signOut();
    // router.push('/signin');
  };

  const profiles = [
    { imageUrl: session?.user?.image, name: 'John Doe', lastMessage: 'Hello!' },
    { imageUrl: session?.user?.image, name: 'Jane Smith', lastMessage: 'Hey there!' },
    { imageUrl: session?.user?.image, name: session?.user?.name, lastMessage: 'Hey there!' },
    { imageUrl: session?.user?.image, name: 'Emma Watson', lastMessage: 'Good morning!' },
    { imageUrl: session?.user?.image, name: 'Chris Evans', lastMessage: 'How are you?' },
    { imageUrl: session?.user?.image, name: 'John Doe', lastMessage: 'Hello!' },
    { imageUrl: session?.user?.image, name: 'Jane Smith', lastMessage: 'Hey there!' },
    { imageUrl: session?.user?.image, name: session?.user?.name, lastMessage: 'Hey there!' },
    { imageUrl: session?.user?.image, name: 'Emma Watson', lastMessage: 'Good morning!' },
    { imageUrl: session?.user?.image, name: 'Chris Evans', lastMessage: 'How are you?' },
    { imageUrl: session?.user?.image, name: 'John Doe', lastMessage: 'Hello!' },
    { imageUrl: session?.user?.image, name: 'Jane Smith', lastMessage: 'Hey there!' },
    { imageUrl: session?.user?.image, name: session?.user?.name, lastMessage: 'Hey there!' },
    { imageUrl: session?.user?.image, name: 'Emma Watson', lastMessage: 'Good morning!' },
    { imageUrl: session?.user?.image, name: 'Chris Evans', lastMessage: 'How are you?' },
  ];

  const displayChats = (imageUrl: string, name: string) => {
    setUsername(name);
    setProfileImage(imageUrl);
  };

  return (
    <div className="h-[100vh] w-[100vw] sm:flex bg-black  ">
      <div className="sm:w-[25%] bg-black  sm:m-2 rounded-custom sm:overflow-scroll  w-full border-custom ">
        <UserProfileCard imageUrl={session?.user?.image || null} name={session?.user?.name || null} />
        <form className="form-inline mx-4 h-10">
          <Input className="form-control h-full mr-sm-2 w-full bg-[#18181B]" type="search" placeholder="Search" aria-label="Search" ></Input>
        </form>
        {profiles.map((profile, index) => (
          <div onClick={() => displayChats(profile.imageUrl, profile.name)} key={index} className="m-2">
            <ProfileCard
              imageUrl={profile.imageUrl}
              name={profile.name}
              lastMessage={profile.lastMessage}
              setActive={username === profile.name} />
          </div>
        ))}
        <button onClick={handleSignOut} className="">Sign Out</button>
      </div>
      <div className="bg-black sm:w-[75%] sm:m-2 sm:flex sm:flex-col justify-between rounded-custom hidden border-custom  p-2 ">
        {username === "" && <NoActiveChatsPage />}
        {username && <ActiveChatTopBar username={username} profileImage={profileImage} />}
        {username && <div className="h-[10000px] w-full bg-black bg-dot-white/[0.2]  relative flex items-center justify-center overflow-scroll p-2  ">
          
        </div>}
        {username &&
          <div className="w-full  flex bg-[#27272B] rounded-b-custom  ">
            <div className="w-[90%] p-1 ">
              <Input className="form-control h-full mr-sm-2 w-full bg-[#18181B] border-none" placeholder="Send Message" aria-label="Send Message" ></Input>
            </div>
            <div className="w-[10%] p-1 ">
              <button className="inline-flex h-full animate-shimmer w-full  items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                Send
              </button>
            </div>
          </div>}
      </div>
    </div>
  );
}
