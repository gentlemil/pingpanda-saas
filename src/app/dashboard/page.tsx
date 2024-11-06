import { DashboardPage } from '@/components/dashboard-page'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DashboardPageContent } from './dashboard-page-content'

const Page = async () => {
  const auth = await currentUser()

  if (!auth) {
    redirect('/sign-in')
  }

  return (
    <DashboardPage title='Dashboard'>
      <DashboardPageContent />
    </DashboardPage>
  )
}

export default Page
