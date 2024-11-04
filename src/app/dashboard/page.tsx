import { DashboardPage } from '@/components/dashboard-page'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const Page = async () => {
  const auth = await currentUser()

  if (!auth) {
    redirect('/sign-in')
  }

  return <DashboardPage title='Dashboard'>Content</DashboardPage>
}

export default Page
