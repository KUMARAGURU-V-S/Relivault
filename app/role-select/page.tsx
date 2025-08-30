'use client'

import React from 'react'
import { RoleSelector } from '@/components/role-selector'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase'
import { updateUserRole } from '@/services/userService'
import { useRouter } from 'next/navigation'

export default function RoleSelectPage() {
  const [user] = useAuthState(auth)
  const router = useRouter()

  const handleRoleSelect = async (role) => {
    console.log("Role selected:", role, "User:", user?.email)
    
    if (user) {
      try {
        console.log("Saving role to Firestore...")
        // Save role to Firestore
        await updateUserRole(user.uid, role)
        console.log("Role saved successfully")
        
        // Also save to localStorage for immediate access
        if (typeof window !== 'undefined') {
          localStorage.setItem('role', role)
        }
        
        // Redirect to role-specific dashboard
        router.push(`/${role}`)
      } catch (error) {
        console.error('Error saving role:', error)
        // Fallback to localStorage only
        if (typeof window !== 'undefined') {
          localStorage.setItem('role', role)
          window.location.href = `/${role}`
        }
      }
    } else {
      console.error("No user found when trying to save role")
      // Fallback behavior
      if (typeof window !== 'undefined') {
        localStorage.setItem('role', role)
        window.location.href = `/${role}`
      }
    }
  }

  return (
    <RoleSelector
      onRoleSelect={handleRoleSelect}
      onBack={() => {
        router.push('/')
      }}
    />
  )
}
