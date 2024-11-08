import { HTTPException } from 'hono/http-exception'
import { db } from '@/db'
import { router } from '../__internals/router'
import { privateProcedure } from '../procedures'
import { startOfMonth } from 'date-fns'
import { z } from 'zod'
import { EVENT_CATEGORY_VALIDATOR } from '@/app/lib/validators/event-category-validator'
import { parseColor } from '@/utils'
import { EDIT_EVENT_CATEGORY_VALIDATOR } from '@/app/lib/validators/edit-event-category-validator'
import { CATEGORY_NAME_VALIDATOR } from '@/app/lib/validators/category-validator'

export const categoryRouter = router({
  getEventCategories: privateProcedure.query(async ({ c, ctx }) => {
    const categories = await db.eventCategory.findMany({
      where: { userId: ctx.user.id },
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const now = new Date()
        const firstDayOfMonth = startOfMonth(now)

        const [uniqueFieldCount, eventsCount, lastPing] = await Promise.all([
          db.event
            .findMany({
              where: {
                EventCategory: { id: category.id },
                createdAt: { gte: firstDayOfMonth },
              },
              select: { fields: true },
              distinct: ['fields'],
            })
            .then((events) => {
              const fieldsName = new Set<string>()
              events.forEach((event) => {
                Object.keys(event.fields as object).forEach((fieldName) => {
                  fieldsName.add(fieldName)
                })
              })
              return fieldsName.size
            }),
          db.event.count({
            where: {
              EventCategory: { id: category.id },
              createdAt: { gte: firstDayOfMonth },
            },
          }),
          db.event.findFirst({
            where: { EventCategory: { id: category.id } },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true },
          }),
        ])
        return {
          ...category,
          uniqueFieldCount,
          eventsCount,
          lastPing: lastPing?.createdAt || null,
        }
      })
    )

    return c.superjson({ categories: categoriesWithCount })
  }),

  deleteCategory: privateProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ c, input, ctx }) => {
      const { name } = input

      await db.eventCategory.delete({
        where: { name_userId: { name, userId: ctx.user.id } },
      })

      return c.json({ success: true })
    }),

  createEventCategory: privateProcedure
    .input(EVENT_CATEGORY_VALIDATOR)
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { name, color, emoji } = input

      // todo: payment logic

      const eventCategory = await db.eventCategory.create({
        data: {
          name: name.toLowerCase(),
          color: parseColor(color),
          emoji,
          userId: user.id,
        },
      })

      return c.json({ eventCategory })
    }),

  editEventCategory: privateProcedure
    .input(EDIT_EVENT_CATEGORY_VALIDATOR)
    .mutation(async ({ c, ctx, input }) => {
      try {
        const { user } = ctx
        const { id, name, color, emoji } = input

        const editCategory = await db.eventCategory.update({
          data: {
            name: name.toLowerCase(),
            color: parseColor(color),
            emoji,
            userId: user.id,
          },
          where: {
            id,
          },
        })
        return c.json({ editCategory })
      } catch (error) {
        console.error(error)
        throw new HTTPException(400, {})
      }
    }),

  insertQuickStartCategories: privateProcedure.mutation(async ({ ctx, c }) => {
    const categories = await db.eventCategory.createMany({
      data: [
        { name: 'bug', emoji: '🐛', color: 0xff6b6b },
        { name: 'sale', emoji: '💰', color: 0xffeb3b },
        { name: 'question', emoji: '🤔', color: 0x6c5ce7 },
      ].map((category) => ({
        ...category,
        userId: ctx.user.id,
      })),
    })

    return c.json({ success: true, count: categories.count })
  }),

  pollCategory: privateProcedure
    .input(z.object({ name: CATEGORY_NAME_VALIDATOR }))
    .query(async ({ c, ctx, input }) => {
      const { name } = input
      const category = await db.eventCategory.findUnique({
        where: {
          name_userId: {
            name,
            userId: ctx.user.id,
          },
        },
        include: {
          _count: {
            select: {
              events: true,
            },
          },
        },
      })

      if (!category) {
        throw new HTTPException(404, { message: `Category ${name} not found.` })
      }

      const hasEvents = category._count.events > 0

      return c.json({ hasEvents })
    }),
})
