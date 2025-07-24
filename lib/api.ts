// Mock API functions - In production, these would connect to your backend
export async function getUserRole(uid: string): Promise<string> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const roles = ["victim", "donor", "ngo", "admin"]
      resolve(roles[Math.floor(Math.random() * roles.length)])
    }, 500)
  })
}

export async function createUser(userData: any): Promise<void> {
  // Mock implementation
  console.log("Creating user:", userData)
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}

export async function getUserClaims(uid: string): Promise<any[]> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          disasterType: "Flood",
          location: "Kerala, India",
          requestedAmount: 25000,
          status: "approved",
          amount: 25000,
          createdAt: new Date().toISOString(),
          transactionHash: "0x1234567890abcdef",
          documents: ["doc1.pdf", "doc2.jpg"],
        },
        {
          id: "2",
          disasterType: "Earthquake",
          location: "Gujarat, India",
          requestedAmount: 50000,
          status: "pending",
          createdAt: new Date().toISOString(),
          documents: ["doc3.pdf"],
        },
      ])
    }, 500)
  })
}

export async function getUserProfile(uid: string): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "John Doe",
        email: "john@example.com",
        phone: "+91 9876543210",
        aadhaar: "1234-5678-9012",
        verified: true,
      })
    }, 500)
  })
}

export async function submitClaim(claimData: any): Promise<void> {
  console.log("Submitting claim:", claimData)
  return new Promise((resolve) => {
    setTimeout(resolve, 2000)
  })
}

export async function uploadToIPFS(file: File): Promise<string> {
  // Mock IPFS upload
  console.log("Uploading to IPFS:", file.name)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Qm${Math.random().toString(36).substring(2, 15)}`)
    }, 1000)
  })
}

export async function getDonorStats(uid: string): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalDonated: 150000,
        totalDonations: 12,
        nftCount: 12,
        impactScore: 95,
      })
    }, 500)
  })
}

export async function getDonorTransactions(uid: string): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          disasterType: "Kerala Floods 2024",
          amount: 50000,
          timestamp: new Date().toISOString(),
          transactionHash: "0xabcdef1234567890",
          nftTokenId: "123",
        },
        {
          id: "2",
          disasterType: "Gujarat Earthquake 2024",
          amount: 75000,
          timestamp: new Date().toISOString(),
          transactionHash: "0x1234567890abcdef",
          nftTokenId: "124",
        },
      ])
    }, 500)
  })
}

export async function getPublicStats(): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalDonations: 2500000,
        totalDisbursed: 2350000,
        totalVictims: 1250,
        activeClaims: 45,
        totalDonors: 890,
      })
    }, 500)
  })
}

export async function getRecentTransactions(): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          type: "donation",
          amount: 25000,
          disasterType: "Kerala Floods",
          location: "Kerala, India",
          timestamp: new Date().toISOString(),
          transactionHash: "0x1234567890abcdef",
        },
        {
          id: "2",
          type: "disbursement",
          amount: 30000,
          disasterType: "Gujarat Earthquake",
          location: "Gujarat, India",
          timestamp: new Date().toISOString(),
          transactionHash: "0xabcdef1234567890",
        },
      ])
    }, 500)
  })
}

export async function getDisasterStats(): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: "Floods", value: 850000 },
        { name: "Earthquakes", value: 650000 },
        { name: "Cyclones", value: 450000 },
        { name: "Fires", value: 350000 },
        { name: "Droughts", value: 200000 },
      ])
    }, 500)
  })
}

export async function getPendingClaims(): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          disasterType: "Flood",
          userName: "Rajesh Kumar",
          location: "Patna, Bihar",
          requestedAmount: 35000,
          description: "House damaged due to severe flooding, need immediate assistance for repairs",
          createdAt: new Date().toISOString(),
          documents: ["aadhaar.pdf", "damage_photo.jpg"],
          coordinates: { lat: 25.5941, lng: 85.1376 },
        },
        {
          id: "2",
          disasterType: "Earthquake",
          userName: "Priya Sharma",
          location: "Bhuj, Gujarat",
          requestedAmount: 75000,
          description: "Complete house collapse, family of 5 needs shelter and basic necessities",
          createdAt: new Date().toISOString(),
          documents: ["aadhaar.pdf"],
          coordinates: null,
        },
      ])
    }, 500)
  })
}

export async function getNGOStats(uid: string): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalReviewed: 156,
        approved: 134,
        rejected: 22,
        pending: 8,
      })
    }, 500)
  })
}

export async function reviewClaim(claimId: string, decision: string, notes: string, reviewerId: string): Promise<void> {
  console.log("Reviewing claim:", { claimId, decision, notes, reviewerId })
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}

export async function getAdminStats(): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalUsers: 2456,
        totalClaims: 1234,
        totalDonations: 2500000,
        systemHealth: 99,
      })
    }, 500)
  })
}

export async function getAllUsers(): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "victim",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "donor",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "NGO Helper",
          email: "ngo@example.com",
          role: "ngo",
          createdAt: new Date().toISOString(),
        },
      ])
    }, 500)
  })
}

export async function updateUserRole(userId: string, newRole: string): Promise<void> {
  console.log("Updating user role:", { userId, newRole })
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}

export async function getSystemHealth(): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        uptime: 99.9,
        apiResponseTime: 120,
        databasePerformance: 95,
        ipfsAvailability: 99,
      })
    }, 500)
  })
}
