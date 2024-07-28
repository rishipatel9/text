import React from 'react'

type CHATBOXPROPS={
    message:string
}
const ChatBox:React.FC<CHATBOXPROPS> = ({message}) => {
  return (
    <div className='h-10 bg-white rounded-sm p-5 flex'>
     <div> {message}</div>
     <div> {new Date().toLocaleDateString()}</div>
    </div>
  )
}

export default ChatBox
