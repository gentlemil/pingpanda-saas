'use client'
import { SignIn } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'

const Page = () => {
  const searchParams = useSearchParams()
  const intent = searchParams.get('intent')

  return (
    <div className='w-full flex-1 flex justify-center items-center'>
      <SignIn
        forceRedirectUrl={intent ? `/dashboard?intent=${intent}` : `/dashboard`}
      ></SignIn>
    </div>
  )
}

export default Page
