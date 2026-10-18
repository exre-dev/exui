"use client"

import { StarIcon } from "lucide-react"

import { useRef, useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
const ratingVariants = cva("flex items-center", {
  variants: {
    size: {
      sm: "gap-2",
      default: "gap-2.5",
      lg: "gap-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const starVariants = cva("", {
  variants: {
    size: {
      sm: "w-4 h-4",
      default: "w-5 h-5",
      lg: "w-6 h-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const valueVariants = cva("text-muted-foreground w-5", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

function Rating({
  rating,
  maxRating = 5,
  size,
  className,
  starClassName,
  showValue = false,
  editable = false,
  onRatingChange,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof ratingVariants> & {
    /**
     * Current rating value (supports decimal values for partial stars)
     */
    rating: number
    /**
     * Maximum rating value (number of stars to show)
     */
    maxRating?: number
    /**
     * Whether to show the numeric rating value
     */
    showValue?: boolean
    /**
     * Class name for the value span
     */
    starClassName?: string
    /**
     * Whether the rating is editable (clickable)
     */
    editable?: boolean
    /**
     * Callback function called when rating changes
     */
    onRatingChange?: (rating: number) => void
  }) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const starsRef = useRef<(HTMLButtonElement | null)[]>([])
  const displayRating =
    editable && hoveredRating !== null ? hoveredRating : rating

  const handleStarClick = (starRating: number) => {
    if (editable && onRatingChange) {
      onRatingChange(starRating)
    }
  }

  const handleStarMouseEnter = (starRating: number) => {
    if (editable) {
      setHoveredRating(starRating)
    }
  }

  const handleStarMouseLeave = () => {
    if (editable) {
      setHoveredRating(null)
    }
  }

  const handleStarKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, selected: number) => {
    let next: number
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = Math.min(maxRating, selected + 1)
        break
      case "ArrowLeft":
      case "ArrowDown":
        next = Math.max(1, selected - 1)
        break
      case "Home":
        next = 1
        break
      case "End":
        next = maxRating
        break
      default:
        return
    }
    event.preventDefault()
    starsRef.current[next - 1]?.focus()
    onRatingChange?.(next)
  }

  const renderStars = () => {
    const stars = []

    for (let i = 1; i <= maxRating; i++) {
      const filled = displayRating >= i
      const partiallyFilled = displayRating > i - 1 && displayRating < i
      const fillPercentage = partiallyFilled
        ? (displayRating - (i - 1)) * 100
        : 0

      stars.push(
        editable ? <button
          key={i}
          ref={(element) => { starsRef.current[i - 1] = element }}
          type="button"
          role="radio"
          aria-label={`${i} of ${maxRating}`}
          aria-checked={Math.round(rating) === i}
          tabIndex={Math.round(rating) === i || (rating < 1 && i === 1) ? 0 : -1}
          className="relative cursor-pointer rounded-sm border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          onClick={() => handleStarClick(i)}
          onKeyDown={(event) => handleStarKeyDown(event, i)}
          onMouseEnter={() => handleStarMouseEnter(i)}
          onMouseLeave={handleStarMouseLeave}
        >
          {/* Background star (empty) */}
          <StarIcon aria-hidden="true"
            data-slot="rating-star-empty"
            className={cn(starVariants({ size }), "text-muted-foreground/30")}
          />

          {/* Filled star */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              width: filled ? "100%" : `${fillPercentage}%`,
            }}
          >
            <StarIcon aria-hidden="true"
              data-slot="rating-star-filled"
              className={cn(
                starVariants({ size }),
                "fill-yellow-400 text-yellow-400"
              )}
            />
          </div>
        </button> : <span key={i} className="relative" aria-hidden="true">
          <StarIcon data-slot="rating-star-empty" className={cn(starVariants({ size }), "text-muted-foreground/30")} />
          <span className="absolute inset-0 overflow-hidden" style={{ width: filled ? "100%" : `${fillPercentage}%` }}>
            <StarIcon data-slot="rating-star-filled" className={cn(starVariants({ size }), "fill-yellow-400 text-yellow-400")} />
          </span>
        </span>
      )
    }

    return stars
  }

  return (
    <div
      data-slot="rating"
      className={cn(ratingVariants({ size }), className)}
      {...props}
      role={editable ? "radiogroup" : "meter"}
      aria-label={props["aria-label"] ?? "Rating"}
      aria-valuemin={editable ? undefined : 0}
      aria-valuemax={editable ? undefined : maxRating}
      aria-valuenow={editable ? undefined : rating}
    >
      <div className="flex items-center">{renderStars()}</div>
      {showValue && (
        <span
          data-slot="rating-value"
          className={cn(valueVariants({ size }), starClassName)}
        >
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export { Rating }
