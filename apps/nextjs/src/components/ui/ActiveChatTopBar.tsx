import React from 'react'
type TOPBARPROPS = {
    username: string,
    profileImage: string
}
const ActiveChatTopBar: React.FC<TOPBARPROPS> = ({ username, profileImage }) => {
    return (
        <div className="w-full h-[50px] flex justify-between bg-[#27272B] items-center p-4 rounded-t-custom text-white  ">
            <div className=" flex justify-center items-center text-base  ">
                <img
                    className='w-10 h-10 mr-2 rounded-full'
                    src={profileImage}
                />
                <div className='text-white font-normal text-sm max-w-sm '>{username}</div>
            </div>
        </div>
    )
}

export default ActiveChatTopBar
