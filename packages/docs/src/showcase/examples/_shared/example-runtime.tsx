import * as React from "react"
import { useShowcaseLanguage, type ShowcaseLanguage } from "../../language"
import { toast as publicToast, type CarouselApi, Carousel } from "@exre/exui"
import { enUS, zhCN } from "date-fns/locale"
import { exampleLocales } from "./example-locales"
import { formatExampleTemplate } from "./example-copy-format"

export const EXAMPLE_EPOCH = Date.UTC(2026, 1, 9, 10, 0)
export function createExampleRandom(seed: string) {
  let state = Array.from(seed).reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 2147483647, 48271)
  return () => { state = (state * 48271) % 2147483647; return state / 2147483647 }
}

export interface ExampleTimers {
  setTimeout(handler: TimerHandler, timeout?: number, ...args: unknown[]): number
  setInterval(handler: TimerHandler, timeout?: number, ...args: unknown[]): number
  delay(timeout: number): Promise<void>
}

function createResources() {
  const timeouts = new Set<number>(), intervals = new Set<number>(), toasts = new Set<string | number>()
  const cancellations = new Set<() => void>()
  let active = true, generation = 0
  const scope = {
    wrap: (node: React.ReactNode): React.ReactNode => node,
    translate: (text: string): string => text,
    locale: enUS,
  }
  const timers: ExampleTimers = {
    setTimeout(handler, delay, ...args) {
      const id = window.setTimeout(() => { timeouts.delete(id); if (typeof handler === "function") handler(...args) }, delay)
      timeouts.add(id); return id
    },
    setInterval(handler, delay, ...args) { const id = window.setInterval(handler, delay, ...args); intervals.add(id); return id },
    delay(timeout) { return new Promise<void>((resolve, reject) => {
      const cancel = () => { window.clearTimeout(id); timeouts.delete(id); cancellations.delete(cancel); reject(new DOMException("Example unmounted", "AbortError")) }
      const id = window.setTimeout(() => { timeouts.delete(id); cancellations.delete(cancel); resolve() }, timeout)
      timeouts.add(id); cancellations.add(cancel)
    }) },
  }
  const track = <T extends string | number>(id: T): T => { toasts.add(id); return id }
  type Title = Parameters<typeof publicToast>[0]
  const title = (value: Title): Title => typeof value === "function" ? () => scope.wrap(value()) : typeof value === "string" ? scope.translate(value) : scope.wrap(value)
  type Options = Parameters<typeof publicToast>[1]
  const options = (value: Options): Options => {
    if (!value) return value
    const description = value.description
    return { ...value, description: typeof description === "function" ? () => scope.wrap(description()) : typeof description === "string" ? scope.translate(description) : scope.wrap(description) }
  }
  const noopId = () => `disposed-example-${promiseSequence++}`
  const publish = (method: typeof publicToast.success, value:Title, data?:Options) => active ? track(method(title(value),options(data))) : noopId()
  const toast = Object.assign((value: Title, data?: Options) => publish(publicToast,value,data), {
    success: (value: Title, data?: Options) => publish(publicToast.success,value,data),
    error: (value: Title, data?: Options) => publish(publicToast.error,value,data),
    warning: (value: Title, data?: Options) => publish(publicToast.warning,value,data),
    info: (value: Title, data?: Options) => publish(publicToast.info,value,data),
    message: (value: Title, data?: Options) => publish(publicToast.message,value,data),
    loading: (value: Title, data?: Options) => publish(publicToast.loading,value,data),
    custom: (render: Parameters<typeof publicToast.custom>[0], data?: Parameters<typeof publicToast.custom>[1]) => active ? track(publicToast.custom(id => <>{scope.wrap(render(id))}</>, data)) : noopId(),
    promise: <T,>(promise: Parameters<typeof publicToast.promise<T>>[0], data?: Parameters<typeof publicToast.promise<T>>[1]) => {
      const id = track(data?.id ?? `example-promise-${promiseSequence++}`)
      const instance = generation
      const { loading, success, error, description, finally: onFinally, ...base } = data ?? {}
      if (active && loading !== undefined) publicToast.loading(title(loading), { ...base, id })
      const unwrap = Promise.resolve().then(() => typeof promise === "function" ? promise() : promise)
      const publish = async (result: React.ReactNode | (Options & { message: React.ReactNode }), kind: "success" | "error", desc: React.ReactNode) => {
        if (!active || instance !== generation) return
        if (result && typeof result === "object" && !React.isValidElement(result) && "message" in result) {
          const { message, ...details } = result
          publicToast[kind](title(message), options({ ...base, ...details, id }))
        } else publicToast[kind](title(result), options({ ...base, id, description: desc }))
      }
      void unwrap.then(async value => {
        if (!active || instance !== generation) return
        const result = typeof success === "function" ? await success(value) : success
        const desc = typeof description === "function" ? await description(value) : description
        if (result !== undefined) await publish(result, "success", desc)
        else publicToast.dismiss(id)
      }, async reason => {
        if (!active || instance !== generation) return
        const result = typeof error === "function" ? await error(reason) : error
        const desc = typeof description === "function" ? await description(reason) : description
        if (result !== undefined) await publish(result, "error", desc)
        else publicToast.dismiss(id)
      }).catch(() => { if (active && instance === generation) publicToast.dismiss(id) }).finally(() => { if (active && instance === generation) void onFinally?.() })
      return { unwrap: () => unwrap }
    },
    dismiss: (id?:string|number) => {if(id!==undefined){if(toasts.has(id))return publicToast.dismiss(id);return id}for(const ownId of toasts)publicToast.dismiss(ownId);return noopId()},
  })
  return { scope, timers, toast, activate() { active = true }, cleanup() {
    active = false; generation++
    for (const cancel of [...cancellations]) cancel()
    for (const id of timeouts) window.clearTimeout(id)
    for (const id of intervals) window.clearInterval(id)
    for (const id of toasts) publicToast.dismiss(id)
    timeouts.clear(); intervals.clear(); toasts.clear()
  } }
}
let promiseSequence = 0
const RuntimeContext = React.createContext<{prefix:string;dictionary:Readonly<Record<string,string>>;language:ShowcaseLanguage;resources:ReturnType<typeof createResources>}>({ prefix: "example", dictionary: {}, language:"en", resources: createResources() })

export function ExampleRuntimeProvider({ children, dictionary }: { children: React.ReactNode; dictionary: Readonly<Record<string, string>> }) {
  const prefix = React.useId(), { language } = useShowcaseLanguage()
  const resources = React.useMemo(createResources, [])
  React.useEffect(() => { resources.activate(); return () => resources.cleanup() }, [resources])
  const value = React.useMemo(() => ({ prefix, dictionary, resources, language }), [prefix, dictionary, resources,language])
  resources.scope.wrap = node => <RuntimeContext value={value}>{node}</RuntimeContext>
  resources.scope.translate = text => language === "zh-CN" ? dictionary[text] ?? text : text
  resources.scope.locale = language === "zh-CN" ? zhCN : enUS
  return <RuntimeContext value={value}>{children}</RuntimeContext>
}

export function useExampleRuntime() {
  const { prefix, dictionary, resources } = React.useContext(RuntimeContext)
  const { language } = useShowcaseLanguage()
  function id(value: string): string
  function id(value: undefined): undefined
  function id(value: string | undefined): string | undefined
  function id(value: string | undefined) { return value?.split(/\s+/).map(part => `${prefix}-${part}`).join(" ") }
  const translate = React.useCallback((value: string) => resources.scope.translate(value.replace(/\s+/g, " ").trim()) === value.replace(/\s+/g, " ").trim() ? value : resources.scope.translate(value.replace(/\s+/g, " ").trim()), [resources])
  const copy = React.useMemo(() => {
    function copyDisplay(value:string):string
    function copyDisplay(value:undefined):undefined
    function copyDisplay(value:string|undefined):string|undefined
    function copyDisplay(value:string|undefined) { return value === undefined ? undefined : translate(value) }
    return copyDisplay
  }, [translate])
  const getLocale = React.useCallback(() => resources.scope.locale, [resources])
  const format = React.useCallback((template: string, values: Readonly<Record<string, string | number>>) =>
    formatExampleTemplate(template, values, copy), [copy])
  const copyState = React.useMemo(() => ({ dictionary, language, values: new WeakMap<object, unknown>() }), [dictionary, language])
  function copyData<T>(input: T): T {
    if (copyState.language !== "zh-CN" || !input || typeof input !== "object" || React.isValidElement(input) || input instanceof Date) return input
    const cached = copyState.values.get(input); if (cached) return cached as T
    const mapped = Array.isArray(input) ? input.map(item => copyData(item)) : Object.fromEntries(Object.entries(input).map(([key, value]) => [key,
      typeof value === "string" && /^(label|title|description|header|headerTitle|placeholder|empty|emptyText|loadingText|text|message)$/.test(key) ? key === "label" && value === "Lead" && "id" in input && input.id === "lead" && "type" in input ? "负责人" : copyState.dictionary[value.replace(/\s+/g, " ").trim()] ?? value : value && typeof value === "object" ? copyData(value) : value]))
    copyState.values.set(input, mapped); return mapped as T
  }
  return { id, copy, format, copyData, getLocale, language, locale: language === "zh-CN" ? zhCN : enUS, locales:exampleLocales[language], timers: resources.timers, toast: resources.toast }
}

export function ExampleRuntimeConsumer({ render }: { render: (runtime: ReturnType<typeof useExampleRuntime>) => React.ReactNode }) { return <>{render(useExampleRuntime())}</> }
export function ExampleText({ children }: { children: React.ReactNode }) {
  const { dictionary } = React.useContext(RuntimeContext)
  const { language } = useShowcaseLanguage()
  return <>{React.Children.map(children, child => typeof child === "string" && language === "zh-CN" ? dictionary[child.replace(/\s+/g," ").trim()] ?? child : child)}</>
}
export function useExampleFilter(_options?: { sensitivity?: Intl.CollatorOptions["sensitivity"] }) {
  const collator = React.useMemo(() => new Intl.Collator(undefined, { usage: "search", sensitivity: "base" }), [])
  return React.useMemo(() => ({ contains(value: string, query: string) {
    if (!query) return true
    const v = Array.from(value), q = Array.from(query)
    return v.some((_, i) => collator.compare(v.slice(i, i + q.length).join(""), query) === 0)
  } }), [collator])
}
export function arrayMove<T>(items: readonly T[], from: number, to: number): T[] {
  const result = [...items], start = from < 0 ? items.length + from : from, end = to < 0 ? items.length + to : to
  if (start < 0 || start >= result.length) return result
  result.splice(end, 0, ...result.splice(start, 1)); return result
}

/** Uses only the public Carousel API and cleans every timer/listener on destroy. */
export function createExampleAutoplay({ delay }: { delay: number }): NonNullable<React.ComponentProps<typeof Carousel>["plugins"]>[number] {
  let api: NonNullable<CarouselApi> | undefined, timer: number | undefined, stopped = false
  const stop = () => { if (timer !== undefined) window.clearInterval(timer); timer = undefined }
  const play = () => { stop(); if (!stopped && !document.hidden) timer = window.setInterval(() => { if (api?.canScrollNext()) api.scrollNext(); else api?.scrollTo(0) }, delay) }
  const onInteraction = () => { stopped = true; stop() }
  const onVisibility = () => { if (document.hidden) stop(); else play() }
  return { name: "example-autoplay", options: { active: true, breakpoints: {} }, init(instance) {
    api = instance; stopped = false; api.on("pointerDown", onInteraction); api.rootNode().addEventListener("focusin", onInteraction)
    document.addEventListener("visibilitychange", onVisibility); play()
  }, destroy() { stop(); api?.off("pointerDown", onInteraction); api?.rootNode().removeEventListener("focusin", onInteraction); document.removeEventListener("visibilitychange", onVisibility) } }
}
