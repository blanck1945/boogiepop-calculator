export const ROWS = 8
export const COLS = 8
export const MINE_COUNT = 10

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

export type Cell = {
  mine: boolean
  adjacent: number
  revealed: boolean
  flagged: boolean
}

export type Board = Cell[][]

export function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      mine: false,
      adjacent: 0,
      revealed: false,
      flagged: false,
    })),
  )
}

function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < ROWS && col >= 0 && col < COLS
}

function neighbors(row: number, col: number): [number, number][] {
  const result: [number, number][] = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = row + dr
      const nc = col + dc
      if (inBounds(nr, nc)) result.push([nr, nc])
    }
  }
  return result
}

function placeMines(board: Board, safeRow: number, safeCol: number): Board {
  const next = board.map((row) => row.map((cell) => ({ ...cell })))
  const positions: [number, number][] = []

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (r === safeRow && c === safeCol) continue
      positions.push([r, c])
    }
  }

  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[positions[i], positions[j]] = [positions[j], positions[i]]
  }

  for (let i = 0; i < MINE_COUNT; i++) {
    const [r, c] = positions[i]
    next[r][c].mine = true
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (next[r][c].mine) continue
      next[r][c].adjacent = neighbors(r, c).filter(([nr, nc]) => next[nr][nc].mine).length
    }
  }

  return next
}

function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({ ...cell })))
}

function revealCell(board: Board, row: number, col: number): Board {
  const next = cloneBoard(board)
  const stack: [number, number][] = [[row, col]]

  while (stack.length > 0) {
    const [r, c] = stack.pop()!
    const cell = next[r][c]
    if (cell.revealed || cell.flagged) continue

    cell.revealed = true
    if (cell.adjacent === 0 && !cell.mine) {
      for (const [nr, nc] of neighbors(r, c)) {
        if (!next[nr][nc].revealed) stack.push([nr, nc])
      }
    }
  }

  return next
}

function revealAllMines(board: Board): Board {
  const next = cloneBoard(board)
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (next[r][c].mine) next[r][c].revealed = true
    }
  }
  return next
}

function checkWin(board: Board): boolean {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c]
      if (!cell.mine && !cell.revealed) return false
    }
  }
  return true
}

export function countFlags(board: Board): number {
  let count = 0
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].flagged) count++
    }
  }
  return count
}

export type RevealResult = {
  board: Board
  status: GameStatus
}

export function revealAt(board: Board, row: number, col: number, status: GameStatus): RevealResult {
  const cell = board[row][col]
  if (status === 'won' || status === 'lost') return { board, status }
  if (cell.flagged || cell.revealed) return { board, status }

  let nextBoard = board
  const nextStatus: GameStatus = status === 'idle' ? 'playing' : status

  if (status === 'idle') {
    nextBoard = placeMines(board, row, col)
  }

  const target = nextBoard[row][col]
  if (target.mine) {
    return { board: revealAllMines(nextBoard), status: 'lost' }
  }

  nextBoard = revealCell(nextBoard, row, col)
  if (checkWin(nextBoard)) {
    return { board: nextBoard, status: 'won' }
  }

  return { board: nextBoard, status: nextStatus }
}

export function toggleFlag(board: Board, row: number, col: number, status: GameStatus): Board {
  if (status === 'won' || status === 'lost') return board

  const cell = board[row][col]
  if (cell.revealed) return board

  const next = cloneBoard(board)
  next[row][col].flagged = !next[row][col].flagged
  return next
}
