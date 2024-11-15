'use client'

import { SignUp } from '@clerk/nextjs'

const Page = () => {
  return (
    <div className='w-full flex-1 flex justify-center items-center'>
      <SignUp
        fallbackRedirectUrl='/welcome'
        forceRedirectUrl='/welcome'
      ></SignUp>
    </div>
  )
}

export default Page
