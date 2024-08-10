import Image from "next/image";

type ProfileCardProps = {
  imageUrl: string;
  name: string;
  lastMessage: string;
  setActive: boolean | null;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  imageUrl,
  name,
  lastMessage,
  setActive,
}) => {
  return (
    <div
      className={`rounded-lg shadow-md p-2 sm:m-2 m-4 flex items-center space-x-4 ${
        !setActive && "hover:bg-[#27272B]"
      } ${setActive && "bg-white"}`}
    >
      <Image
        src={imageUrl}
        alt={name}
        className={`h-12 w-12 rounded-full object-cover`}
        width={48}
        height={48}
      />
      <div className="flex-1">
        <div
          className={`font-normal text-sm max-w-sm ${
            setActive ? "text-black" : "text-white"
          }`}
        >
          {name}
        </div>
        <div
          className={` ${
            setActive ? "text-black" : "text-neutral-300"
          } text-xs`}
        >
          {lastMessage}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
