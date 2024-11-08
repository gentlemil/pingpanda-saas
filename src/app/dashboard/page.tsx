import { DashboardPage } from '@/components/dashboard-page'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DashboardPageContent } from './dashboard-page-content'
import { CreateEventCategoryModal } from '@/components/create-event-category-modal'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

const Page = async () => {
  const auth = await currentUser()

  if (!auth) {
    redirect('/sign-in')
  }

  return (
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
  )
}

export default Page
