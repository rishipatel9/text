"use client";
import ProfileCard from "@/components/ui/ProfileCard";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, Key } from "react";
import LoadingBar from "react-top-loading-bar";
import { toast } from "sonner";
import ActiveChatTopBar from "../ui/ActiveChatTopBar";
import { Input } from "../ui/input";
import NoActiveChatsPage from "../ui/NoActiveChatsPage";
import UserProfileCard from "../ui/UserProfileCard";

export default function Chats() {
  const { data: session, status } = useSession();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<{ username: string; image: string; id: number; providerId: number }>();
  const [messages, setMessages] = useState<Array<{ user: string | null |  undefined; message: string; sentByUser: boolean }>>([]);
  const [listOfUsers, setListOfUsers] = useState<Array<{ email: string; id: number; image: string; name: string; provider: string; providerId: string }>>([]);
  const router = useRouter();
  const loadingBarRef = useRef<any>(null);

  useEffect(() => {
    if (!session) {
      router.push("/signin");
    } else {
      loadingBarRef.current.complete();
      fetchUsers();
    }
  }, [session, status]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/getAllUser");
      setListOfUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSignOut = async () => {
    loadingBarRef.current.continuousStart();
    await signOut({ redirect: true });
    loadingBarRef.current.complete();
  };

  const displayChats = async (imageUrl: string, name: string, id: number, providerId: string) => {
    setCurrentUser({ username: name, image: imageUrl, id, providerId: parseInt(providerId) });
    const res=await axios.post("/api/accessChat",{userId:providerId});
    console.log(res);
  };

  const sendMessage = async () => {
    if (inputMessage.trim() !== "") {
      setMessages([...messages, { user: session?.user?.name, message: inputMessage, sentByUser: true }]);
       console.log(inputMessage)
       console.log(currentUser?.providerId);
      const response = await axios.post("/api/sendMessage", {
        content: inputMessage,
        chatId: currentUser?.providerId, 
      });
      console.log(response)
      setInputMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className={`h-[100vh] w-[100vw] sm:flex bg-[#27272B]`}>
      <LoadingBar color="white" ref={loadingBarRef} />
      <div className="sm:w-[25%] bg-black sm:m-2 sm:rounded-custom sm:overflow-scroll w-full border-custom">
        <UserProfileCard imageUrl={session?.user?.image || null} name={session?.user?.name || null} />
        <form className="form-inline mx-4 h-10">
          <Input className="form-control h-full mr-sm-2 w-full bg-[#18181B]" type="search" placeholder="Search" aria-label="Search" />
        </form>
        {listOfUsers.map((profile, index) => (
          <div onClick={() => displayChats(profile?.image, profile?.name, profile.id, profile.providerId)} key={index} className="m-2">
            <ProfileCard imageUrl={profile.image} name={profile.name} lastMessage={"hi"} setActive={currentUser?.username === profile.name} />
          </div>
        ))}
        <button onClick={handleSignOut} className="">
          Sign Out
        </button>
      </div>

      <div className={`bg-black sm:w-[75%] sm:my-2 mr-2 sm:flex sm:flex-col justify-between rounded-custom hidden border-custom p-2`}>
        {!currentUser && <NoActiveChatsPage />}
        {currentUser && <ActiveChatTopBar username={currentUser.username} profileImage={currentUser.image} />}
        {currentUser && (
          <div className="w-full bg-black bg-dot-white/[0.2] relative flex flex-col items-center justify-center overflow-scroll p-2">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 my-2 rounded max-w-[75%] ${msg.sentByUser ? "bg-white text-black self-end" : "bg-gray-300 text-black self-start"}`}>
                <strong>{msg.user}: </strong>{msg.message}
                <p>{Date.now()}</p>
              </div>
            ))}
          </div>
        )}
        {currentUser && (
          <div className="w-full flex bg-[#27272B] rounded-b-custom px-2">
            <div className="w-[5%] h-full flex justify-center items-center relative">
              <label
                htmlFor="fileInput"
                onClick={() =>
                  toast("Event has been created", {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                    action: {
                      label: "Undo",
                      onClick: () => console.log("Undo"),
                    },
                  })
                }
                className="h-8 w-8 p-2 bg-black rounded-full flex justify-center items-center cursor-pointer"
              >
                <input type="file" id="fileInput" className="opacity-0 absolute inset-0 cursor-pointer" />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </label>
            </div>
            <div className="w-[85%] p-1">
              <Input
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                className="form-control h-full mr-sm-2 w-full bg-[#18181B] border-none"
                placeholder="Send Message"
                aria-label="Send Message"
              />
            </div>
            <div className="w-[10%] p-1">
              <button
                onClick={sendMessage}
                className="inline-flex h-full animate-shimmer w-full items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
