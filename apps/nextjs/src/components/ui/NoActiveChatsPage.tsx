import React from 'react'
import { BorderBeam } from '../magicui/border-beam'

const NoActiveChatsPage = () => {
    return (
        <div className="h-full w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="max-w-md w-full mx-auto rounded-xl md:rounded-2xl md:p-8 flex justify-center items-center">
                <BorderBeam />
                <h2 className="text-4xl sm:text-6xl text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-2">
                    Start Your Conversation with text.
                </h2>
            </div>
        </div>

    )
}

export default NoActiveChatsPage
