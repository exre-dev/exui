/** Expands an explicitly selected display template once. Values remain verbatim,
 * including braces, dollar signs, whitespace and words found in the dictionary.
 */
export function formatExampleTemplate(
  template: string,
  values: Readonly<Record<string, string | number>>,
  translate: (template: string) => string = (template) => template,
) {
  return translate(template).replace(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g, (_placeholder, name: string) => {
    if (!Object.hasOwn(values, name)) throw new Error(`Missing example copy parameter: ${name}`)
    return String(values[name])
  })
}
