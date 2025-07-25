'use client'

import React from 'react'
import { RoleSelector } from '@/components/role-selector'

export default function RoleSelectPage() {
  return (
    <RoleSelector
      onRoleSelect={(role) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('role', role)
          window.location.href = `/${role}`
        }
      }}
      onBack={() => {
        window.location.href = '/'
      }}
    />
  )
}
