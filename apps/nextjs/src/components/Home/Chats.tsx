"use client";
import { CURRENT_USER, LIST_OF_USERS, MESSAGE } from "@/lib/types";
import NoActiveChatsPage from "../ui/NoActiveChatsPage";
import { signOut, useSession } from "next-auth/react";
import ProfileCard from "@/components/ui/ProfileCard";
import ActiveChatTopBar from "../ui/ActiveChatTopBar";
import { useEffect, useState, useRef } from "react";
import UserProfileCard from "../ui/UserProfileCard";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";
import axios from "axios";

export default function Chats() {
  const { data: session, status } = useSession();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<CURRENT_USER | null>(null);
  const [messages, setMessages] = useState<Array<MESSAGE>>([]);
  const [listOfUsers, setListOfUsers] = useState<Array<LIST_OF_USERS>>([]);
  const [chatRoom, setChatRoom] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [newId, setNewId] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadingBarRef = useRef<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/signin");
    } else {
      loadingBarRef.current.complete();
      fetchUsers();
    }
  }, [session, status]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/getAllUser");
      const filteredUsers = res.data.filter((user: LIST_OF_USERS) => {
        if (user.name !== session?.user?.name) {
          setNewId(user.id);
          return true;
        }
        return false;
      });
      setListOfUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSignOut = async () => {
    loadingBarRef.current.continuousStart();
    await signOut({ redirect: true });
    loadingBarRef.current.complete();
  };

  const displayChats = async (
    imageUrl: string,
    name: string,
    id: number,
    providerId: string,
  ) => {
    setCurrentUser({
      username: name,
      image: imageUrl,
      id,
      providerId: parseInt(providerId),
    });
    try {
      let res = await axios.post("/api/accessChat", { userId: id });
      setChatRoom(res.data.id);
      res = await axios.post("/api/getAllMessages", { chatId: res.data.id });
      setMessages(
        res.data.map((msg: any) => ({
          user: msg.sender.name,
          message: msg.content,
          sentByUser: msg.senderId === newId,
          Date: msg.createdAt,
        })),
      );
    } catch (error) {
      console.error("Error accessing chat:", error);
    }
  };

  const sendMessage = async () => {
    if (inputMessage.trim() !== "") {
      const newMessage = {
        user: session?.user?.name,
        message: inputMessage,
        sentByUser: true,
        Date: new Date().toLocaleDateString(),
      };
      setMessages([...messages, newMessage]);
      setLoading(true);
      setInputMessage("");
      try {
        await axios.post("/api/sendMessage", {
          content: inputMessage,
          chatId: chatRoom,
        });
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] sm:flex bg-[#27272B]">
      <LoadingBar color="white" ref={loadingBarRef} />
      <div
        className={`sm:w-[25%] bg-black sm:m-2 sm:rounded-custom sm:overflow-scroll w-full border-custom sm:h-auto h-full  `}
      >
        <UserProfileCard
          imageUrl={session?.user?.image || ""}
          name={session?.user?.name || ""}
        />
        <form className="form-inline mx-4 h-10">
          <Input
            className="form-control h-full mr-sm-2 w-full bg-[#18181B]"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
        </form>
        {listOfUsers.map((profile, index) => (
          <div
            onClick={() =>
              displayChats(
                profile?.image,
                profile?.name,
                profile.id,
                profile.providerId,
              )
            }
            key={index}
            className="m-2 cursor-pointer"
          >
            <ProfileCard
              imageUrl={profile.image}
              name={profile.name}
              lastMessage={"hi"}
              setActive={currentUser?.username === profile.name}
            />
          </div>
        ))}
        <button onClick={handleSignOut} className="">
          Sign Out
        </button>
      </div>

      <div
        className={`bg-black sm:w-[75%] sm:my-2 mr-2 sm:flex sm:flex-col justify-between rounded-custom  border-custom p-2 hidden `}
      >
        {!currentUser ? (
          <NoActiveChatsPage />
        ) : (
          <>
            <ActiveChatTopBar
              username={currentUser.username}
              profileImage={currentUser.image}
            />
            <div className="w-full bg-black bg-dot-white/[0.2] relative flex flex-col overflow-scroll p-2 h-full">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 my-2 rounded max-w-[75%] ${msg.user === session?.user?.name ? "bg-white text-black self-end" : "bg-[#27272B] text-white self-start"}`}
                >
                  <strong>{msg.user}: </strong>
                  {msg.message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="w-full flex bg-[#27272B] rounded-b-custom px-2">
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
                  onClick={() => {
                    sendMessage();
                    toast({
                      title: "Message Sent",
                      description: "Your message has been sent.",
                    });
                  }}
                  className="inline-flex h-full w-full items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
