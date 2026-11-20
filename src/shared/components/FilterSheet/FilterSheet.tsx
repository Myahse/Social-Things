import { useCallback, useState } from 'react'
import { BottomSheet } from '@/shared/components/BottomSheet'

export interface FilterSheetOption {
  id: string
  label: string
}

interface FilterSheetProps {
  /** Button and sheet eyebrow, e.g. "Filter". */
  filterLabel: string
  title: string
  hint: string
  closeLabel: string
  options: FilterSheetOption[]
  value: string
  onChange: (id: string) => void
}

/**
 * "Filter · <current>" button that opens the site's bottom sheet of options (first written for the
 * Gallery's colour folders, shared with the Products page).
 */
export function FilterSheet({ filterLabel, title, hint, closeLabel, options, value, onChange }: FilterSheetProps) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const current = options.find((o) => o.id === value)?.label ?? options[0]?.label ?? ''

  return (
    <>
      <button
        type="button"
        className="btn-slam inline-flex items-center gap-2 !px-4 !py-2.5"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>
          {filterLabel} · {current}
        </span>
      </button>

      <BottomSheet open={open} onClose={close} eyebrow={filterLabel} title={title} hint={hint} closeLabel={closeLabel}>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3" role="listbox">
          {options.map((option) => (
            <FilterOption
              key={option.id}
              label={option.label}
              active={value === option.id}
              onClick={() => {
                onChange(option.id)
                setOpen(false)
              }}
            />
          ))}
        </div>
      </BottomSheet>
    </>
  )
}

function FilterOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onClick={onClick}
      className={`min-h-12 border-[2.5px] border-ink px-3 py-3 text-left font-display text-xs tracking-[0.16em] uppercase transition-colors ${
        active
          ? 'bg-ink text-white shadow-[4px_4px_0_#fff]'
          : 'bg-canvas text-ink active:bg-ink active:text-white sm:hover:bg-ink sm:hover:text-white'
      }`}
      style={{ transform: 'skewX(-8deg)' }}
    >
      <span style={{ display: 'inline-block', transform: 'skewX(8deg)' }}>{label}</span>
    </button>
  )
}
