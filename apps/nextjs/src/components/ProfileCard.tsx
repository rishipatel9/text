import React from 'react'

const ProfileCard = () => {
    return (
        <div className="flex items-start p-4 text-white">
            <div className="flex items-start gap-4 text-sm justify-center">
                <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-black">AS</span>
                </span>
                <div className="flex h-full w-full items-center justify-center ">
                        <div className="font-semibold ">Alice Smith</div>                        
                    </div>
                </div>
        </div>
    )
}

export default ProfileCard
