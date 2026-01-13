// components/ProtectedRoute.tsx
import React, { type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '@/hooks/useUser'

interface ProtectedRouteProps {
  children: JSX.Element
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useUser()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
