interface OptionPickerProps {
  label: string
  options: string[]
  selected: string
  onSelect: (value: string) => void
}

export function OptionPicker({ label, options, selected, onSelect }: OptionPickerProps) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              selected === option
                ? 'border-ink bg-ink text-canvas'
                : 'border-line hover:border-ink'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
