'use client'

import { SignIn } from '@clerk/nextjs'

const Page = () => {
  return (
    <div className='w-full flex-1 flex justify-center items-center'>
      <SignIn></SignIn>
    </div>
  )
}

export default Page
