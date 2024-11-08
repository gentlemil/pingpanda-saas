import { z } from 'zod'
import { CATEGORY_NAME_VALIDATOR } from './category-validator'
import { COLOR_VALIDATOR } from './color-validator'

export const EVENT_CATEGORY_VALIDATOR = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  color: COLOR_VALIDATOR,
  emoji: z.string().emoji('Invalid emoji').optional(),
})
