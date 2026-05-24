import { useCallback, useReducer } from 'react'
import {
  COLS,
  MINE_COUNT,
  ROWS,
  countFlags,
  createEmptyBoard,
  revealAt,
  toggleFlag,
  type Board,
  type GameStatus,
} from '../lib/minesweeper'

const NUMBER_COLORS = [
  '',
  'text-st-link',
  'text-emerald-600',
  'text-red-600',
  'text-indigo-700',
  'text-amber-700',
  'text-teal-700',
  'text-st-body',
  'text-st-muted-text',
]

type GameState = {
  board: Board
  status: GameStatus
}

type GameAction =
  | { type: 'reveal'; row: number; col: number }
  | { type: 'flag'; row: number; col: number }
  | { type: 'reset' }

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'reveal': {
      const result = revealAt(state.board, action.row, action.col, state.status)
      return { board: result.board, status: result.status }
    }
    case 'flag':
      return { board: toggleFlag(state.board, action.row, action.col, state.status), status: state.status }
    case 'reset':
      return { board: createEmptyBoard(), status: 'idle' }
  }
}

function statusMessage(status: GameStatus): string | null {
  switch (status) {
    case 'idle':
      return 'Clic para empezar'
    case 'playing':
      return null
    case 'won':
      return '¡Ganaste!'
    case 'lost':
      return 'Boom — perdiste'
  }
}

const initialState: GameState = { board: createEmptyBoard(), status: 'idle' }

export function MinesweeperPage() {
  const [{ board, status }, dispatch] = useReducer(gameReducer, initialState)

  const reset = useCallback(() => dispatch({ type: 'reset' }), [])
  const handleReveal = useCallback(
    (row: number, col: number) => dispatch({ type: 'reveal', row, col }),
    [],
  )
  const handleFlag = useCallback(
    (row: number, col: number) => dispatch({ type: 'flag', row, col }),
    [],
  )

  const flags = countFlags(board)
  const minesLeft = Math.max(0, MINE_COUNT - flags)
  const message = statusMessage(status)

  return (
    <div className="mx-auto flex w-full max-w-fit flex-col gap-4">
      <header className="space-y-1 text-left">
        <h1 className="text-[1.5rem] font-semibold text-st-body">Buscamina</h1>
        <p className="text-sm text-st-muted-text">
          {ROWS}×{COLS} · {MINE_COUNT} minas
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-lg border border-st-border bg-st-muted-bg px-3 py-1.5 font-mono text-sm tabular-nums text-st-body">
          Minas: {minesLeft}
        </span>
        <button type="button" onClick={reset} className="st-btn-secondary">
          Reiniciar
        </button>
        {message ? (
          <span
            className={`text-sm font-medium ${status === 'won' ? 'text-emerald-600' : status === 'lost' ? 'text-st-primary' : 'text-st-muted-text'}`}
            aria-live="polite"
          >
            {message}
          </span>
        ) : null}
      </div>

      <div
        className="inline-grid gap-px rounded-xl border border-st-border bg-st-border p-1"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1.75rem))` }}
        role="grid"
        aria-label="Tablero buscamina"
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const key = `${rowIndex}-${colIndex}`
            const isLostMine = status === 'lost' && cell.mine && cell.revealed

            let content: string | number = ''
            let cellClass = 'bg-white hover:bg-st-muted-bg'

            if (cell.flagged && !cell.revealed) {
              content = '⚑'
              cellClass = 'bg-amber-50 text-amber-700'
            } else if (cell.revealed) {
              if (cell.mine) {
                content = '*'
                cellClass = isLostMine ? 'bg-st-primary text-white' : 'bg-st-muted-text text-white'
              } else if (cell.adjacent > 0) {
                content = cell.adjacent
                cellClass = 'bg-st-muted-bg'
              } else {
                cellClass = 'bg-st-muted-bg'
              }
            }

            return (
              <button
                key={key}
                type="button"
                role="gridcell"
                aria-label={`Celda ${rowIndex + 1}, ${colIndex + 1}`}
                disabled={status === 'won' || status === 'lost'}
                onClick={() => handleReveal(rowIndex, colIndex)}
                onContextMenu={(event) => {
                  event.preventDefault()
                  handleFlag(rowIndex, colIndex)
                }}
                className={`flex h-7 w-7 items-center justify-center text-xs font-bold select-none transition ${cellClass} ${cell.revealed && !cell.mine && cell.adjacent > 0 ? NUMBER_COLORS[cell.adjacent] : ''}`}
              >
                {content}
              </button>
            )
          }),
        )}
      </div>
    </div>
  )
}
