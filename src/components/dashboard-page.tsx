'use client'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/heading'
import { ArrowLeft } from 'lucide-react'

interface DashboardPageProps {
  title: string
  children?: ReactNode
  hideBackButton?: boolean
  cta?: ReactNode
}

export const DashboardPage = ({
  title,
  children,
  hideBackButton,
  cta,
}: DashboardPageProps) => {
  const router = useRouter()
  return (
    <section className='flex-1 h-full w-full flex flex-col'>
      <div className='p-6 sm:p-8 flex justify-between border-b border-gray-200'>
        <div className='w-full flex flex-row justify-between sm:items-center gap-6'>
          <div className='flex items-center gap-8 w-full'>
            {!hideBackButton && (
              <Button
                onClick={() => router.push('/dashboard')}
                className='w-fit bg-white'
                variant='outline'
              >
                <ArrowLeft className='size-4' />
              </Button>
            )}
            <Heading>{title}</Heading>
          </div>

          {cta && <div>{cta}</div>}
        </div>
      </div>

      <div className='flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto'>
        {children}
      </div>
    </section>
  )
}
