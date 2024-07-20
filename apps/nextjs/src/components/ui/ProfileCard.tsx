type ProfileCardProps = {
  imageUrl: any;
  name: any;
  lastMessage: string,
  setActive:boolean | null
};

const ProfileCard: React.FC<ProfileCardProps> = ({ imageUrl, name, lastMessage,setActive }) => {
  return (
    <div
      className={`text-white rounded-lg shadow-md p-2 sm:m-2 m-4 flex items-center space-x-4 hover:bg-[#27272B]  ${setActive ? "bg-[#27272B]" : ""}`}
    >
      <img
        src={imageUrl}
        alt={name}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="text-white font-normal text-sm max-w-sm  ">{name}</div>
       { <div className="text-xs text-neutral-300">{lastMessage}</div>}
      </div>
    </div>
  );
};

export default ProfileCard;
