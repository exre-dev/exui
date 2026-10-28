import { createElement, useId, type ComponentPropsWithRef } from 'react'

export type GlassIconColor = 'blue' | 'green' | 'purple' | 'pink' | 'coral' | 'orange'

export type GlassIconProps = Omit<ComponentPropsWithRef<'svg'>, 'children' | 'dangerouslySetInnerHTML' | 'title' | 'color'> & {
  size?: number | string
  title?: string
  color?: GlassIconColor
}

type PaintRole = 'start' | 'end' | 'body' | 'shade' | 'tint'
type GlassPalette = Record<PaintRole, string> & { shadow: readonly [number, number, number] }

const palettes: Record<GlassIconColor, GlassPalette> = {
  blue: { start: '#39AFFD', end: '#477FFF', body: '#4096FE', shade: '#0062FF', tint: '#3EA0FE', shadow: [0.15375, 0.522433, 0.9] },
  green: { start: '#9BF763', end: '#26AB5B', body: '#72DC60', shade: '#30AD31', tint: '#72DC60', shadow: [0.454902, 0.870588, 0.376471] },
  purple: { start: '#BC94FF', end: '#9F66FF', body: '#BA90FF', shade: '#8237FF', tint: '#BA90FF', shadow: [0.577356, 0.359375, 0.9375] },
  pink: { start: '#FF759F', end: '#FF196E', body: '#FF749F', shade: '#E31352', tint: '#FF749F', shadow: [1, 0.321569, 0.54902] },
  coral: { start: '#FFA78F', end: '#F23E2C', body: '#FFAC95', shade: '#EF5641', tint: '#FFAC95', shadow: [1, 0.447059, 0.368627] },
  orange: { start: '#FFB37F', end: '#FF7B0D', body: '#FFCBB9', shade: '#EB6F0A', tint: '#FFCBB9', shadow: [1, 0.52549, 0.137255] },
}

// Canonical artwork includes hand-tuned variants; map their material roles
// rather than replacing every colored surface with a single flat paint.
const paintRoles: Record<string, PaintRole> = {
  '#FF759F': 'start', '#FFA78F': 'start', '#FFB37F': 'start', '#9BF763': 'start',
  '#39AFFD': 'start', '#BC94FF': 'start', '#51B7FF': 'start',
  '#FF196E': 'end', '#F23E2C': 'end', '#FF7B0D': 'end', '#26AB5B': 'end',
  '#477FFF': 'end', '#9F66FF': 'end', '#0B72E7': 'end', '#3A76FF': 'end',
  '#4096FE': 'body',
  '#FF749F': 'tint', '#FFAC95': 'tint', '#FFCBB9': 'tint', '#72DC60': 'tint',
  '#3EA0FE': 'tint', '#BA90FF': 'tint', '#4FAFF8': 'tint',
  '#E31352': 'shade', '#30AD31': 'shade', '#EF5641': 'shade', '#2BA22C': 'shade',
  '#0062FF': 'shade', '#FA452D': 'shade', '#EB6F0A': 'shade', '#2AA42B': 'shade',
  '#FF624D': 'shade', '#8237FF': 'shade', '#E46800': 'shade', '#2481E4': 'shade',
  '#F86652': 'shade', '#EE2965': 'shade', '#004FFF': 'shade', '#F41E59': 'shade',
  '#1EA51F': 'shade', '#FF3D22': 'shade', '#39B93A': 'shade', '#FC5D00': 'shade',
}

function recolor(markup: string, color: GlassIconColor | undefined): string {
  if (!color || !Object.hasOwn(palettes, color)) return markup
  const palette = palettes[color]
  return markup.replace(/\b(fill|stroke|stop-color)="(#[0-9a-f]+)"/gi, (match, attribute: string, value: string) => {
    const role = paintRoles[value.toUpperCase()]
    return role ? `${attribute}="${palette[role]}"` : match
  }).replace(/(<feColorMatrix\b[^>]*\bvalues=")([^"]+)(")/g, (match, before: string, value: string, after: string) => {
    const matrix = value.trim().split(/\s+/).map(Number)
    // RGB offsets color the shadow. Alpha-only matrices also drive masks;
    // preserve them, the shadow alpha row, and every other filter parameter.
    if (matrix.length !== 20 || ![4, 9, 14].some(index => matrix[index] !== 0)) return match
    matrix[4] = palette.shadow[0]
    matrix[9] = palette.shadow[1]
    matrix[14] = palette.shadow[2]
    return before + matrix.join(' ') + after
  })
}

function escapeText(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

export function createGlassIcon(markup: string) {
  return function GlassIcon({ size = '8rem', width, height, title, color, ...props }: GlassIconProps) {
    const scope = `exui-${Array.from(useId(), (character) => character.codePointAt(0)!.toString(16)).join('-')}`
    const scopedId = (id: string) => `${scope}-${Array.from(id, (character) => character.codePointAt(0)!.toString(16)).join('-')}`
    const content = recolor(markup, color).replace(/\bid="([^"]+)"|url\(#([^)]*)\)|((?:xlink:)?href)="#([^"]+)"/g,
      (_match, id: string | undefined, url: string | undefined, attribute: string | undefined, href: string | undefined) => {
        if (id) return `id="${scopedId(id)}"`
        if (url) return `url(#${scopedId(url)})`
        return `${attribute}="#${scopedId(href!)}"`
      })
    const explicitLabel = props['aria-label'] != null || props['aria-labelledby'] != null
    const labelled = explicitLabel || Boolean(title)
    return createElement('svg', {
      width: width ?? size,
      height: height ?? size,
      viewBox: '0 0 128 128',
      fill: 'none',
      ...(labelled ? { role: 'img' } : { 'aria-hidden': true }),
      ...(title && !explicitLabel ? { 'aria-labelledby': `${scope}-title` } : {}),
      ...props,
      dangerouslySetInnerHTML: { __html: `${title ? `<title id="${scope}-title">${escapeText(title)}</title>` : ''}${content}` },
    })
  }
}
