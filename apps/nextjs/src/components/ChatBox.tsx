import React from 'react'

const ChatBox = ({message:any}) => {
  return (
    <div className='h-10 bg-white rounded-sm p-5'>
      {message}
    </div>
  )
}

export default ChatBox
