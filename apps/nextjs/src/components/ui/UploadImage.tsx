import React from 'react'

const UploadImage = () => {
  return (
    <div className="w-[5%] h-full flex justify-center items-center relative">
                <label
                  htmlFor="fileInput"
                  className="h-8 w-8 p-2 bg-black rounded-full flex justify-center items-center cursor-pointer"
                >
                  <input
                    type="file"
                    id="fileInput"
                    className="opacity-0 absolute inset-0 cursor-pointer"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="white"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </label>
              </div>
  )
}

export default UploadImage
