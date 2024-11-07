import { z } from 'zod'

export const COLOR_VALIDATOR = z
  .string()
  .min(1, 'Color is required')
  .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
