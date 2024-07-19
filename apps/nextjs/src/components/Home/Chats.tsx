"use client";
import ProfileCard from "@/components/ui/ProfileCard";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ActiveChatTopBar from "../ui/ActiveChatTopBar";
import { Input } from "../ui/input";
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
    router.push('/signin');
  };

  const profiles = [
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
    <div className="h-[100vh] w-[100vw] sm:flex bg-black">
      <div className="sm:w-[25%] bg-black border-custom sm:m-2 rounded-custom overflow-scroll w-full ">
      <UserProfileCard imageUrl={session?.user?.image} name={session?.user?.name}/>
        <form className="form-inline mx-2 h-10 ">
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
      <div className="bg-black sm:w-[75%] border-custom sm:m-2 rounded-custom hidden sm:block p-2">
        {username === "" && <NoActiveChatsPage />}
        {username && <ActiveChatTopBar username={username} profileImage={profileImage} />}
      </div>
    </div>
  );
}
