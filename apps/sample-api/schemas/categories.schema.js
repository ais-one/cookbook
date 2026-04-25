import { z } from 'zod';

export const CategoryBodySchema = z
  .object({
    name: z.string().min(1).meta({ example: 'Technology' }),
    description: z.string().optional().meta({ example: 'Tech related posts' }),
  })
  .meta({ id: 'CategoryBody' });

export const CategoryUpdateSchema = CategoryBodySchema.partial().meta({ id: 'CategoryUpdate' });

export const CategoryParamsSchema = z
  .object({
    id: z.coerce.number().int().positive().meta({ example: 1 }),
  })
  .meta({ id: 'CategoryParams' });

export const CategoryQuerySchema = z
  .object({
    limit: z.coerce.number().int().positive().max(100).default(10).meta({ example: 10 }),
    page: z.coerce.number().int().min(0).default(0).meta({ example: 0 }),
  })
  .meta({ id: 'CategoryQuery' });
