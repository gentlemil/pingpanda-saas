'use client'

import { CATEGORY_NAME_VALIDATOR } from '@/app/lib/validators/category-validator'
import { COLOR_VALIDATOR } from '@/app/lib/validators/color-validator'
import { useQueryClient } from '@tanstack/react-query'
import { PropsWithChildren, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Modal } from './ui/modal'

const EVENT_CATEGORY_VALIDATOR = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  color: COLOR_VALIDATOR,
  emoji: z.string().emoji('Invalid emoji').optional(),
})

type EventCategoryForm = z.infer<typeof EVENT_CATEGORY_VALIDATOR>

export const CreateEventCategoryModal = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { register, handleSubmit } = useForm<EventCategoryForm>({
    resolver: zodResolver(EVENT_CATEGORY_VALIDATOR),
  })

  const onSubmit = (data: EventCategoryForm) => {}

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      <Modal showModal={isOpen} setShowModal={setIsOpen}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <h2 className='text-lg/7 font-medium tracking-tight text-gray-950'>
              New Event Category
            </h2>
          </div>
        </form>
      </Modal>
    </>
  )
}
