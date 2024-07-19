import React from 'react'
type USERPROFILECARDPROPS = {
  imageUrl: string,
  name: string
}
const UserProfileCard: React.FC<USERPROFILECARDPROPS> = ({ imageUrl, name }) => {
  return (
    <div
      className={`text-white rounded-lg shadow-md p-2 sm:m-2 m-4 flex items-center space-x-4 hover:bg-[#27272B] justify-between`}>
      <div>
        <h2 className="text-3xl sm:text-4xl text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-2">
          text.
        </h2>
      </div>
      <div onClick={()=>{console.log(name)}}>
        <img
          src={imageUrl}
          alt={name}
          className="h-12 w-12 rounded-full object-cover"
        />
      </div>
    </div>
  )
}

export default UserProfileCard
