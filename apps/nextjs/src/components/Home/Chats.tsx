"use client";
import { useEffect, useState, useRef } from "react";
import { useSessionData } from "@/hooks/useSessionData";
import NoActiveChatsPage from "../ui/NoActiveChatsPage";
import { signOut } from "next-auth/react";
import ProfileCard from "@/components/ui/ProfileCard";
import ActiveChatTopBar from "../ui/ActiveChatTopBar";
import UserProfileCard from "../ui/UserProfileCard";
import LoadingBar from "react-top-loading-bar";
import { Input } from "../ui/input";
import useFetchUsers from "@/hooks/useFetchUsers";
import { useSubscribeChats } from "@/utils/SubscribeChats";
import { ChatManager } from "@/lib/ChatManager";
import SendButtom from "../ui/SendButtom";
import { CURRENT_USER, MESSAGE } from "@/lib/types";

export default function Chats() {
  const { session } = useSessionData();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<CURRENT_USER | null>(null);
  const [messages, setMessages] = useState<Array<MESSAGE>>([]);
  const { listOfUsers, loading, error, loggedId } = useFetchUsers(
    session?.user?.name,
  );
  const [chatRoom, setChatRoom] = useState<number>();
  const [newId, setNewId] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadingBarRef = useRef<any>(null);
  const SubscribeChats = useSubscribeChats();
  const [fetching, setFetching] = useState<boolean>(false);
  const [isMobileChatActive, setIsMobileChatActive] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const chatManager = new ChatManager(
    session?.user?.name || "",
    newId,
    setMessages,
    setFetching,
  );

  const handleSignOut = async () => {
    loadingBarRef.current.continuousStart();
    await signOut({ redirect: true });
    loadingBarRef.current.complete();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      chatManager.sendMessage(inputMessage, chatRoom, setInputMessage);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col sm:flex-row overflow-clip bg-[#27272B] sm:pb-4">
      <LoadingBar color="white" ref={loadingBarRef} />
      <div
        className={`sm:w-1/4 bg-black sm:m-2 sm:rounded-custom sm:overflow-scroll w-full border-custom h-full ${isMobileChatActive ? "hidden sm:block" : ""}`}
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
              chatManager.displayChats(
                profile?.image,
                profile?.name,
                profile.id,
                profile.providerId,
                setCurrentUser,
                setChatRoom,
                setIsMobileChatActive,
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
        className={`bg-black sm:w-3/4 sm:my-2 mr-2 sm:flex sm:flex-col justify-between rounded-custom border-custom h-full p-2 ${currentUser ? "" : "hidden"} ${isMobileChatActive ? "flex flex-col" : "hidden sm:flex"}`}
      >
        {!currentUser ? (
          <NoActiveChatsPage />
        ) : (
          <>
            <ActiveChatTopBar
              username={currentUser.username}
              profileImage={currentUser.image}
            />
            <div className="flex-grow overflow-y-auto bg-black bg-dot-white/[0.2] relative flex flex-col p-2">
              {fetching && error ? (
                <div className="w-full overflow-scroll max-h-screen bg-slate-50"></div>
              ) : (
                messages.map((msg, index) => (
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
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="w-full flex items-center group rounded-b-custom bg-[#27272B] px-2 ">
              <div className="flex-grow p-1 transition-all duration-300 group-hover:pr-2">
                <Input
                  value={inputMessage}
                  onChange={(event) => setInputMessage(event.target.value)}
                  onKeyDown={handleKeyDown}
                  className="form-control h-full w-full bg-[#18181B] border-none transition-all duration-300 "
                  placeholder="Send Message"
                  aria-label="Send Message"
                />
              </div>
              <div className="p-1">
                <SendButtom
                  handleClick={() =>
                    chatManager.sendMessage(
                      inputMessage,
                      chatRoom,
                      setInputMessage,
                    )
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
