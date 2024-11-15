import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/db'
import { DashboardPage } from '@/components/dashboard-page'
import { createCheckoutSession } from '../lib/stripe'
import { PaymentSuccessModal } from '@/components/payment-success-modal'
import { DashboardPageContent } from './dashboard-page-content'
import { CreateEventCategoryModal } from '@/components/create-event-category-modal'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}
const Page = async ({ searchParams }: PageProps) => {
  const auth = await currentUser()

  if (!auth) {
    redirect('/sign-in')
  }

  const user = await db.user.findUnique({
    where: {
      externalId: auth.id,
    },
  })

  if (!user) {
    redirect('/welcome')
  }

  const intent = searchParams.intent

  if (intent) {
    const session = await createCheckoutSession({
      userEmail: user.email,
      userId: user.id,
    })

    if (session.url) redirect(session.url)
  }

  const success = searchParams.success

  return (
    <>
      {success ? <PaymentSuccessModal /> : null}
      <DashboardPage
        cta={
          <CreateEventCategoryModal>
            <Button>
              <PlusIcon className='size-4 sm:mr-2' />
              <p className='hidden sm:block'>Add Category</p>
            </Button>
          </CreateEventCategoryModal>
        }
        title='Dashboard'
      >
        <DashboardPageContent />
      </DashboardPage>
    </>
  )
}

export default Page
