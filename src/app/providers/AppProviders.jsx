import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../modules/auth/context/AuthContext'
import CrudPopupProvider from '../../shared/components/CrudPopupProvider'

export default function AppProviders({ children }) {
  return (
    <BrowserRouter   future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}>
      <AuthProvider>
        <CrudPopupProvider>
          {children}
        </CrudPopupProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}