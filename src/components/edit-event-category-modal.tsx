'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { COLOR_OPTIONS, EMOJI_OPTIONS } from '@/lib/constants'
import { cn, toHexColor } from '@/utils'
import { useEffect } from 'react'
import { Category } from '@/app/dashboard/dashboard-page-content'
import { Button } from './ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EDIT_EVENT_CATEGORY_VALIDATOR } from '@/app/lib/validators/edit-event-category-validator'
import { client } from '@/app/lib/client'

interface EditEventCategoryModalProps {
  category: Category
  closeModal: any
}

type EditEventCategoryForm = z.infer<typeof EDIT_EVENT_CATEGORY_VALIDATOR>

export const EditEventCategoryModal = ({
  category,
  closeModal = false,
}: EditEventCategoryModalProps) => {
  const queryClient = useQueryClient()

  const { mutate: editEventCategory, isPending } = useMutation({
    mutationFn: async (data: EditEventCategoryForm) => {
      await client.category.editEventCategory.$post(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-event-categories'] })
      closeModal(true)
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditEventCategoryForm>({
    resolver: zodResolver(EDIT_EVENT_CATEGORY_VALIDATOR),
  })

  useEffect(() => {
    reset({
      id: category.id,
      name: category.name,
      color: toHexColor(category.color!),
      emoji: category.emoji || undefined,
    })
  }, [])

  const color = watch('color')
  const selectedEmoji = watch('emoji')

  const onSubmit = (data: EditEventCategoryForm) => {
    editEventCategory(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div>
        <h2 className='text-lg/7 font-medium tracking-tight text-gray-950'>
          Edit Event Category
        </h2>
        <p className='text-sm/6 text-gray-600'>
          Edit category for a better fit.
        </p>
      </div>
      <div className='space-y-5'>
        <Input className='hidden' id='id' {...register('id')} />
        <div>
          <Label htmlFor='name'>Name</Label>
          <Input
            autoFocus
            id='name'
            {...register('name')}
            placeholder='e.g. user-signup'
          />
          {errors.name ? (
            <p className='mt-1 text-sm text-red-500'>{errors.name.message}</p>
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
            <p className='mt-1 text-sm text-red-500'>{errors.color.message}</p>
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
            <p className='mt-1 text-sm text-red-500'>{errors.emoji.message}</p>
          ) : null}
        </div>
      </div>
      <div className='flex justify-end space-x-3 pt-4 border-t'>
        <Button
          type='button'
          variant='outline'
          onClick={() => closeModal(true)}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Updating...' : 'Update category'}
        </Button>
      </div>
    </form>
  )
}
