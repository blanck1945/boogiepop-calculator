import { useCallback, useState } from 'react'

type Op = '+' | '-' | '×' | '÷'

function formatDisplay(value: number): string {
  if (!Number.isFinite(value)) return 'Error'
  const s = String(value)
  if (s.length <= 12) return s
  return value.toExponential(6)
}

function compute(a: number, b: number, op: Op): number {
  switch (op) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '×':
      return a * b
    case '÷':
      if (b === 0) return NaN
      return a / b
  }
}

export function CalculatorPage() {
  const [display, setDisplay] = useState('0')
  const [stored, setStored] = useState<number | null>(null)
  const [pendingOp, setPendingOp] = useState<Op | null>(null)
  const [freshEntry, setFreshEntry] = useState(true)

  const clearAll = useCallback(() => {
    setDisplay('0')
    setStored(null)
    setPendingOp(null)
    setFreshEntry(true)
  }, [])

  const appendDigit = useCallback(
    (digit: string) => {
      setDisplay((prev) => {
        if (freshEntry || prev === 'Error') {
          setFreshEntry(false)
          return digit === '.' ? '0.' : digit
        }
        if (digit === '.' && prev.includes('.')) return prev
        if (prev === '0' && digit !== '.') return digit
        return prev + digit
      })
    },
    [freshEntry],
  )

  const applyPending = useCallback(
    (nextOp: Op | null) => {
      const current = Number.parseFloat(display)
      if (stored === null || pendingOp === null) {
        setStored(current)
      } else if (!freshEntry) {
        const result = compute(stored, current, pendingOp)
        setStored(result)
        setDisplay(formatDisplay(result))
      }
      setPendingOp(nextOp)
      setFreshEntry(true)
    },
    [display, freshEntry, pendingOp, stored],
  )

  const equals = useCallback(() => {
    if (stored === null || pendingOp === null) return
    const current = Number.parseFloat(display)
    const result = compute(stored, current, pendingOp)
    setDisplay(formatDisplay(result))
    setStored(null)
    setPendingOp(null)
    setFreshEntry(true)
  }, [display, pendingOp, stored])

  const keys: { label: string; action: () => void; className?: string }[] = [
    { label: 'C', action: clearAll, className: 'col-span-2 bg-st-muted-bg text-st-body' },
    {
      label: '÷',
      action: () => applyPending('÷'),
      className: 'bg-st-primary text-white hover:bg-st-primary-hover',
    },
    {
      label: '×',
      action: () => applyPending('×'),
      className: 'bg-st-primary text-white hover:bg-st-primary-hover',
    },
    { label: '7', action: () => appendDigit('7') },
    { label: '8', action: () => appendDigit('8') },
    { label: '9', action: () => appendDigit('9') },
    {
      label: '-',
      action: () => applyPending('-'),
      className: 'bg-st-primary text-white hover:bg-st-primary-hover',
    },
    { label: '4', action: () => appendDigit('4') },
    { label: '5', action: () => appendDigit('5') },
    { label: '6', action: () => appendDigit('6') },
    {
      label: '+',
      action: () => applyPending('+'),
      className: 'bg-st-primary text-white hover:bg-st-primary-hover',
    },
    { label: '1', action: () => appendDigit('1') },
    { label: '2', action: () => appendDigit('2') },
    { label: '3', action: () => appendDigit('3') },
    {
      label: '=',
      action: equals,
      className: 'row-span-2 bg-st-link text-white hover:opacity-90',
    },
    { label: '0', action: () => appendDigit('0'), className: 'col-span-2' },
    { label: '.', action: () => appendDigit('.') },
  ]

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <header className="space-y-1 text-left">
        <h1 className="text-[1.5rem] font-semibold text-st-body">Calculadora</h1>
        <p className="text-sm text-st-muted-text">Remote MF · calculatorRemote/Shell</p>
      </header>

      <div
        className="rounded-xl border border-st-border bg-st-muted-bg px-4 py-3 text-right font-mono text-3xl font-medium tabular-nums text-st-body"
        aria-live="polite"
        aria-label="Resultado"
      >
        {display}
        {pendingOp && stored !== null ? (
          <p className="mt-1 text-xs font-normal text-st-muted-text">
            {formatDisplay(stored)} {pendingOp}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {keys.map((key) => (
          <button
            key={key.label}
            type="button"
            onClick={key.action}
            className={`min-h-12 rounded-lg border border-st-border bg-white text-lg font-medium text-st-body transition hover:bg-st-muted-bg ${key.className ?? ''}`}
          >
            {key.label}
          </button>
        ))}
      </div>
    </div>
  )
}
