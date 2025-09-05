"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Shield, Users, Settings, Database, TrendingUp, CheckCircle, UserCheck } from "lucide-react"
import { getAdminStats, getAllUsers, updateUserRole, getPendingVerificationRequests, approveVerificationRequest } from "@/lib/api";
import { getUserProfile } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";
import { useReliefContract } from "@/hooks/useReliefContract";
import { toast } from "sonner"

export function AdminDashboard() {
  const { user } = useAuth();
  const { addVerifiedVictim, loading: contractLoading } = useReliefContract();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClaims: 0,
    totalDonations: 0,
    systemHealth: 100,
  })
  const [users, setUsers] = useState([])
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true)
  const [victimAddress, setVictimAddress] = useState("");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      if (!user) return;
      const [statsData, usersData, profileData, requestsData] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getUserProfile(user.uid),
        getPendingVerificationRequests(),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setProfile(profileData);
      setPendingRequests(requestsData);
    } catch (error) {
      console.error("Error loading admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole)
      toast.success("User role updated successfully")
      loadAdminData()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleManualVerify = async () => {
    if (!victimAddress) {
      toast.error("Please enter a wallet address.");
      return;
    }
    await handleVerifyVictim(victimAddress, null);
    setVictimAddress(""); // Clear input on success
  };

  const handleVerifyVictim = async (walletAddress: string, requestId: string | null) => {
    try {
      toast.loading("Sending verification transaction...");
      const tx = await addVerifiedVictim(walletAddress);
      toast.dismiss();
      toast.success("Wallet verified successfully!", {
        description: `Tx: ${tx.transactionHash.slice(0, 10)}...`,
      });

      if (requestId) {
        await approveVerificationRequest(requestId);
      }
      // Refresh data after verification
      loadAdminData();
    } catch (error: any) {
      toast.dismiss();
      toast.error("Verification failed", {
        description: error.message || "An unknown error occurred.",
      });
    }
  };

  const systemMetrics = [
    { name: "Users", value: stats.totalUsers, color: "#3B82F6" },
    { name: "Claims", value: stats.totalClaims, color: "#10B981" },
    { name: "Donations", value: stats.totalDonations, color: "#F59E0B" },
  ]

  if (loading && !profile) { // Only show full page loader on initial load
    return <div className="p-6">Loading admin dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">System administration and user management</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
           {/* Cards for stats */}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="verification">Pending Verifications</TabsTrigger>
            <TabsTrigger value="blockchainActions">Manual Actions</TabsTrigger>
            <TabsTrigger value="system">System Metrics</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain Status</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Pending Wallet Verifications</CardTitle>
                <CardDescription>
                  Users who have connected their wallet and are awaiting verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map((req) => (
                      <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{req.userName}</h3>
                          <p className="text-sm text-gray-500 font-mono">{req.walletAddress}</p>
                        </div>
                        <Button 
                          onClick={() => handleVerifyVictim(req.walletAddress, req.id)}
                          disabled={contractLoading}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          {contractLoading ? 'Verifying...' : 'Verify'}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No pending verification requests.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            {/* User management content from before */}
          </TabsContent>

          <TabsContent value="blockchainActions">
            <Card>
              <CardHeader>
                <CardTitle>Manual Wallet Verification</CardTitle>
                <CardDescription>
                  Manually add a wallet address to the smart contract's list of verified victims.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="victimAddress">Victim Wallet Address</Label>
                  <Input 
                    id="victimAddress" 
                    placeholder="0x..." 
                    value={victimAddress} 
                    onChange={(e) => setVictimAddress(e.target.value)} 
                  />
                </div>
                <Button onClick={handleManualVerify} disabled={contractLoading || !victimAddress}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {contractLoading ? 'Verifying...' : 'Verify Wallet on Blockchain'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs from before */}

        </Tabs>
      </div>
    </div>
  )
}

