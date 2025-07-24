"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { VictimDashboard } from "@/components/dashboards/victim-dashboard"
import { DonorDashboard } from "@/components/dashboards/donor-dashboard"
import { NGODashboard } from "@/components/dashboards/ngo-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { PublicDashboard } from "@/components/dashboards/public-dashboard"
import { RoleSelector } from "@/components/role-selector"

export default function Home() {
  const [currentView, setCurrentView] = useState("landing")
  const [userRole, setUserRole] = useState<string | null>(null)

  const renderDashboard = () => {
    switch (userRole) {
      case "victim":
        return <VictimDashboard />
      case "donor":
        return <DonorDashboard />
      case "ngo":
        return <NGODashboard />
      case "admin":
        return <AdminDashboard />
      default:
        return <PublicDashboard />
    }
  }

  const renderContent = () => {
    switch (currentView) {
      case "public":
        return <PublicDashboard />
      case "role-select":
        return (
          <RoleSelector
            onRoleSelect={(role) => {
              setUserRole(role)
              setCurrentView("dashboard")
            }}
            onBack={() => setCurrentView("landing")}
          />
        )
      case "dashboard":
        return renderDashboard()
      default:
        return (
          <LandingPage
            onShowRoleSelect={() => setCurrentView("role-select")}
            onViewPublic={() => setCurrentView("public")}
            onViewDashboard={() => setCurrentView("dashboard")}
            userRole={userRole}
          />
        )
    }
  }

  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">{renderContent()}</div>
}
