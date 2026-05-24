import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'
import { CalculatorPage } from '../pages/CalculatorPage'
import { MinesweeperPage } from '../pages/MinesweeperPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<CalculatorPage />} />
        <Route path="buscamina" element={<MinesweeperPage />} />
        <Route path="*" element={<Navigate to="." replace relative="path" />} />
      </Route>
    </Routes>
  )
}
