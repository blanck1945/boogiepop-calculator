import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'
import { CalculatorPage } from '../pages/CalculatorPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<CalculatorPage />} />
        <Route path="*" element={<CalculatorPage />} />
      </Route>
    </Routes>
  )
}
