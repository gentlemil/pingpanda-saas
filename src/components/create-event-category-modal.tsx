'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PropsWithChildren, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Modal } from './ui/modal'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { cn } from '@/utils'
import { Button } from './ui/button'
import { EVENT_CATEGORY_VALIDATOR } from '@/app/lib/validators/event-category-validator'
import { client } from '@/app/lib/client'
import { COLOR_OPTIONS, EMOJI_OPTIONS } from '@/lib/constants'

type EventCategoryForm = z.infer<typeof EVENT_CATEGORY_VALIDATOR>

interface CreateEventCategoryModalProps extends PropsWithChildren {
  containerClassName?: string
}

export const CreateEventCategoryModal = ({
  children,
  containerClassName,
}: CreateEventCategoryModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutate: createEventCategory, isPending } = useMutation({
    mutationFn: async (data: EventCategoryForm) => {
      await client.category.createEventCategory.$post(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-event-categories'] })
      setIsOpen(false)
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EventCategoryForm>({
    resolver: zodResolver(EVENT_CATEGORY_VALIDATOR),
  })

  const color = watch('color')
  const selectedEmoji = watch('emoji')

  const onSubmit = (data: EventCategoryForm) => {
    createEventCategory(data)
    reset()
  }

  return (
    <>
      <div
        className={(cn(containerClassName), 'inline')}
        onClick={() => setIsOpen(true)}
      >
        {children}
      </div>

      <Modal
        showModal={isOpen}
        setShowModal={setIsOpen}
        className='max-w-xl p-8'
      >
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <h2 className='text-lg/7 font-medium tracking-tight text-gray-950'>
              New Event Category
            </h2>
            <p className='text-sm/6 text-gray-600'>
              Create a new category to organize your events.
            </p>
          </div>
          <div className='space-y-5'>
            <div>
              <Label htmlFor='name'>Name</Label>
              <Input
                autoFocus
                id='name'
                {...register('name')}
                placeholder='e.g. user-signup'
              />
              {errors.name ? (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div>
              <Label htmlFor='color'>Color</Label>
              <div className='flex flex-wrap gap-3'>
                {COLOR_OPTIONS.map((premadecolor) => (
                  <button
                    key={premadecolor}
                    type='button'
                    className={cn(
                      `bg-[${premadecolor}]`,
                      'size-10 rounded-full ring-2 ring-offset-2 transition-all',
                      color === premadecolor
                        ? 'ring-brand-700 scale-110'
                        : 'ring-transparent hover:scale-105'
                    )}
                    onClick={() => setValue('color', premadecolor)}
                  ></button>
                ))}
              </div>
              {errors.color ? (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.color.message}
                </p>
              ) : null}
            </div>

            <div>
              <Label htmlFor='color'>Emoji</Label>
              <div className='flex flex-wrap gap-3'>
                {EMOJI_OPTIONS.map(({ emoji, label }) => (
                  <button
                    key={emoji}
                    type='button'
                    className={cn(
                      'size-10 flex items-center justify-center text-xl rounded-md transition-all',
                      selectedEmoji === emoji
                        ? 'bg-brand-100 ring-2 ring-brand-700 scale-110'
                        : 'bg-brand-100 hover:bg-brand-200'
                    )}
                    onClick={() => setValue('emoji', emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {errors.emoji ? (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.emoji.message}
                </p>
              ) : null}
            </div>
          </div>
          <div className='flex justify-end space-x-3 pt-4 border-t'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Creating...' : 'Create category'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
