import { z } from 'zod'
import { EVENT_CATEGORY_VALIDATOR } from './event-category-validator'

export const EDIT_EVENT_CATEGORY_VALIDATOR = EVENT_CATEGORY_VALIDATOR.extend({
  id: z.string().readonly(),
})
