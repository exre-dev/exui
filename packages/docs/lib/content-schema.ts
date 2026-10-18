import { frontmatterSchema } from "fumadocs-mdx/config"
import { z } from "zod"

const idSchema = z.string().regex(/^(?:getting-started|components|exui|tokens)\/[a-z0-9]+(?:-[a-z0-9]+)*$/)

export const docsFrontmatterSchema = frontmatterSchema.extend({
  id: idSchema,
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  exampleFamily: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  full: z.boolean().optional(),
})

export type DocsFrontmatter = z.infer<typeof docsFrontmatterSchema>
