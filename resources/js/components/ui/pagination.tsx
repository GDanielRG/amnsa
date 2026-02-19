import { Link } from "@inertiajs/react"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn(
        "mx-auto flex w-full justify-center",
        className
      )}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1 max-lg:w-full max-lg:justify-between", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  Omit<React.ComponentProps<typeof Link>, "size">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  disabled,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={cn(disabled && "pointer-events-none opacity-50", className)}
      render={
        <Link
          as="button"
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          {...props}
        />
      }
    />
  )
}

function PaginationPrevious({
  className,
  text = "Anterior",
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string; disabled?: boolean }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      disabled={disabled}
      className={cn("pl-2!", className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">
        {text}
      </span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = "Siguiente",
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string; disabled?: boolean }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      disabled={disabled}
      className={cn("pr-2!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4 flex items-center justify-center",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon
      />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
