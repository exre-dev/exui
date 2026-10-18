"use client"

import { GlobeIcon } from "lucide-react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"

import type { ComponentProps } from "react"
import { createContext, useContext, useMemo, useState } from "react"
import * as BasePhoneInput from "react-phone-number-input"
import flags from "react-phone-number-input/flags"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
type PhoneInputSize = "sm" | "default" | "lg"

const PhoneInputContext = createContext<{
  variant: PhoneInputSize
  popupClassName?: string
  scrollAreaClassName?: string
}>({
  variant: "default",
  popupClassName: undefined,
  scrollAreaClassName: undefined,
})

type PhoneInputProps = Omit<
  ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<
    BasePhoneInput.Props<typeof BasePhoneInput.default>,
    "onChange" | "variant" | "popupClassName" | "scrollAreaClassName"
  > & {
    onChange?: (value: BasePhoneInput.Value) => void
    variant?: PhoneInputSize
    popupClassName?: string
    scrollAreaClassName?: string
  }

function PhoneInput({
  className,
  variant,
  popupClassName,
  scrollAreaClassName,
  onChange,
  value,
  ...props
}: PhoneInputProps) {
  const phoneInputSize = variant || "default"
  return (
    <PhoneInputContext.Provider
      value={{ variant: phoneInputSize, popupClassName, scrollAreaClassName }}
    >
      <BasePhoneInput.default
        className={cn(
          "flex",
          props["aria-invalid"] &&
            "[&_*[data-slot=combobox-trigger]]:border-destructive [&_*[data-slot=combobox-trigger]]:ring-destructive/50",
          className
        )}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret={false}
        value={value || undefined}
        onChange={(value) => onChange?.(value || ("" as BasePhoneInput.Value))}
        {...props}
      />
    </PhoneInputContext.Provider>
  )
}

function InputComponent({ className, ...props }: ComponentProps<typeof Input>) {
  const { variant } = useContext(PhoneInputContext)

  return (
    <Input
      className={cn(
        "rounded-s-none focus:z-1",
        variant === "sm" && "h-[var(--exui-component-button-small-height)]",
        variant === "lg" && "h-[var(--exui-component-button-large-height)]",
        className
      )}
      {...props}
    />
  )
}

type CountryEntry = { label: string; value: BasePhoneInput.Country | undefined }

type CountrySelectProps = {
  disabled?: boolean
  value: BasePhoneInput.Country
  options: CountryEntry[]
  onChange: (country: BasePhoneInput.Country) => void
}

function CountrySelect({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) {
  const { variant, popupClassName } = useContext(PhoneInputContext)
  const [searchValue, setSearchValue] = useState("")

  const filteredCountries = useMemo(() => {
    const query = searchValue.toLowerCase()
    return countryList.filter(
      ({ value, label }) => value && label.toLowerCase().includes(query)
    )
  }, [countryList, searchValue])

  return (
    <Combobox
      items={filteredCountries}
      value={selectedCountry || ""}
      onValueChange={(country: BasePhoneInput.Country | null) => {
        if (country) {
          onChange(country)
        }
      }}
    >
      <ComboboxTrigger
        render={
          <Button
            variant="outline"
            size={variant}
            className={cn(
              "rounded-s-3xl flex gap-1 rounded-e-none border-e-0 px-2.5 py-0 leading-none focus:z-10 [background:var(--exui-component-form-control-base-background)] hover:[background:var(--exui-component-form-control-hover-background)] active:[background:var(--exui-component-form-control-hover-background)] focus-visible:[background:var(--exui-component-form-control-focus-background)] data-pressed:[background:var(--exui-component-form-control-focus-background)] disabled:[background:var(--exui-component-form-control-disabled-background)]",
              disabled && "opacity-50"
            )}
            disabled={disabled}
          >
            <span className="sr-only">
              <ComboboxValue />
            </span>
            <FlagComponent
              country={selectedCountry}
              countryName={selectedCountry}
            />
          </Button>
        }
      />
      <ComboboxContent className={cn("w-xs", popupClassName)}>
        <div className="p-1.5 pb-0">
          <ComboboxPrimitive.Input
            render={<Input />}
            placeholder="e.g. United States"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <ComboboxSeparator />
        <ComboboxEmpty className={cn("px-4 py-2.5 text-sm", filteredCountries.length === 0 && "flex")}>
          No country found.
        </ComboboxEmpty>
        {/* The rows scroll inside the list's own max height, its per-style
            padding moved inside, so the last country can be reached; the list
            itself must not scroll too. Not rendered while nothing matches: an
            emptied scroll area kept its old thumb below the popup. */}
        <ComboboxList className="p-0">
          {filteredCountries.length > 0 && (
            <div className="relative flex max-h-[inherit]">
              <div className="flex max-h-[inherit] w-full scroll-pt-2 scroll-pb-2 flex-col overscroll-contain p-1.5">
                <ScrollArea className="size-full min-h-0 **:data-[slot=scroll-area-scrollbar]:m-0 [&_[data-slot=scroll-area-viewport]]:h-full [&_[data-slot=scroll-area-viewport]]:overscroll-contain">
                  {filteredCountries.map((item: CountryEntry) =>
                    item.value ? (
                      <ComboboxItem
                        key={item.value}
                        value={item.value}
                        className="flex items-center gap-2"
                      >
                        <FlagComponent
                          country={item.value}
                          countryName={item.label}
                        />
                        <span className="flex-1 text-sm">{item.label}</span>
                        <span className="text-foreground/50 text-sm">
                          {`+${BasePhoneInput.getCountryCallingCode(item.value)}`}
                        </span>
                      </ComboboxItem>
                    ) : null
                  )}
                </ScrollArea>
              </div>
            </div>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function FlagComponent({ country, countryName }: BasePhoneInput.FlagProps) {
  const Flag = flags[country]

  return (
    <span className="flex h-4 w-4 items-center justify-center [&_svg:not([class*='size-'])]:size-full! [&_svg:not([class*='size-'])]:rounded-[0.3125rem]">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <GlobeIcon aria-hidden="true"
          className="size-4 opacity-60"
        />
      )}
    </span>
  )
}

export { PhoneInput }
