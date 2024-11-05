import { db } from '@/db'
import { router } from '../__internals/router'
import { privateProcedure } from '../procedures'

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
    return c.json({})
  }),
})
