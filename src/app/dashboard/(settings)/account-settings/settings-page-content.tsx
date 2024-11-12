'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { client } from '@/app/lib/client'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export const AccountSettings = ({
  discordId: initialDiscordId,
}: {
  discordId: string
}) => {
  const [discordId, setDiscordId] = useState(initialDiscordId)

  const { mutate, isPending } = useMutation({
    mutationFn: async (discordId: string) => {
      const res = await client.project.setDiscordId.$post({ discordId })
      return await res.json()
    },
    onSuccess: (res) => {},
  })

  return (
    <Card className='max-w-xl w-full space-y-4'>
      <div>
        <Label>Discord ID</Label>
        <Input
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          placeholder='Enter your Discord ID'
          className='mt-1'
        />
      </div>

      <p className='mt-2 text-sm/6 text-gray-600'>
        Don't know how to find your Discord ID?{' '}
        <Link
          href='https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID'
          className='text-brand-600 hover:text-brand-500'
        >
          Learn how to obtain it here
        </Link>
        .
      </p>

      <div className='pt-4'>
        <Button onClick={() => mutate(discordId)} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </Card>
  )
}
