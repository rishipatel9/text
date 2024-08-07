"use client";
import { CURRENT_USER, MESSAGE } from "@/lib/types";
import { useEffect, useState, useRef } from "react";
import { useSessionData } from "@/hooks/useSessionData";
import NoActiveChatsPage from "../ui/NoActiveChatsPage";
import { signOut } from "next-auth/react";
import ProfileCard from "@/components/ui/ProfileCard";
import ActiveChatTopBar from "../ui/ActiveChatTopBar";
import UserProfileCard from "../ui/UserProfileCard";
import LoadingBar from "react-top-loading-bar";
import SendButtom from "../ui/SendButtom";
import { Input } from "../ui/input";
import axios from "axios";
import useFetchUsers from "@/hooks/useFetchUsers";
import { useSubscribeChats } from "@/hooks/useSubscribeChats";
import WebSocketManager from "@/lib/WebSocketManager";

export default function Chats() {
  const { session } = useSessionData();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<CURRENT_USER | null>(null);
  const [messages, setMessages] = useState<Array<MESSAGE>>([]);
  const { listOfUsers, loading, error } = useFetchUsers(session?.user?.name);
  const [chatRoom, setChatRoom] = useState<number>();
  const [newId, setNewId] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadingBarRef = useRef<any>(null);
  const SubscribeChats = useSubscribeChats();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    WebSocketManager.getInstance();
  }, [messages]);

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
      WebSocketManager.getInstance().sendMessage({
        type: "PUBLISH",
        chatId: chatRoom,
        message: inputMessage,
      });
      try {
        await axios.post("/api/sendMessage", {
          content: inputMessage,
          chatId: chatRoom,
        });
        setInputMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
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
        className={`sm:w-[25%] bg-black sm:m-2 sm:rounded-custom sm:overflow-scroll w-full border-custom sm:h-auto h-full`}
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
        className={`bg-black sm:w-[75%] sm:my-2 mr-2 sm:flex sm:flex-col justify-between rounded-custom border-custom p-2 ${
          currentUser ? "" : "hidden"
        }`}
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
                  className={`p-2 my-2 rounded max-w-[75%] ${
                    msg.user === session?.user?.name
                      ? "bg-white text-black self-end"
                      : "bg-[#27272B] text-white self-start"
                  }`}
                >
                  <strong>{msg.user}: </strong>
                  {msg.message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="w-full flex group rounded-b-custom bg-[#27272B] px-2">
              <div className="flex-grow p-1 transition-all duration-300 group-hover:pr-2">
                <Input
                  value={inputMessage}
                  onChange={(event) => setInputMessage(event.target.value)}
                  onKeyDown={handleKeyDown}
                  className="form-control h-full w-full bg-[#18181B] border-none transition-all duration-300 group-hover:w-[calc(100%-3rem)]"
                  placeholder="Send Message"
                  aria-label="Send Message"
                />
              </div>
              <div className="p-1">
                <SendButtom />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
