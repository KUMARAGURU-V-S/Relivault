"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin, Upload, FileText, AlertCircle } from "lucide-react"
import { submitClaim, uploadToIPFS, saveAadharToIPFS, saveCIDToFirestore } from "@/lib/api"
import { ClaimFormData, ClaimSubmissionData } from "@/lib/types"
import { toast } from "sonner"

interface ClaimFormProps {
  onSuccess: () => void
}

export function ClaimForm({ onSuccess }: ClaimFormProps) {
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [aadhaarVerified, setAadhaarVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [formData, setFormData] = useState<ClaimFormData>({
    disasterType: "",
    description: "",
    requestedAmount: "",
    location: "",
    aadharNumber: "",
    documents: [],
  })

  const validateAadhaar = (aadhaar: string) => {
    const cleanAadhaar = aadhaar.replace(/\s/g, '')
    return /^\d{12}$/.test(cleanAadhaar)
  }

  const handleAadhaarVerify = async () => {
    if (!validateAadhaar(formData.aadharNumber)) {
      toast.error('Please enter a valid 12-digit Aadhaar number')
      return
    }
    
    setIsVerifying(true)
    
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAadhaarVerified(true)
      setShowSuccessPopup(true)
      toast.success("Aadhaar verified successfully!")
      
      // Hide popup after 3 seconds
      setTimeout(() => setShowSuccessPopup(false), 3000)
    } catch (error) {
      toast.error('Aadhaar verification failed. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lng: longitude })
          setFormData((prev) => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }))
          toast.success("Location captured successfully")
        },
        () => {
          toast.error("Failed to get location. Please enter manually.")
        },
      )
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        documents: Array.from(e.target.files),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if both Aadhaar verification and geo-location are completed
    if (!aadhaarVerified) {
      toast.error('Please verify your Aadhaar number first')
      return
    }
    
    if (!location) {
      toast.error('Please capture your geo-location first')
      return
    }
    
    setLoading(true)

    try {
      // 1. Save Aadhar number to IPFS
      let aadharCID = null
      if (formData.aadharNumber.trim()) {
        aadharCID = await saveAadharToIPFS(formData.aadharNumber)
        
        // 2. Save Aadhar CID to Firestore in separate collection
        await saveCIDToFirestore({
          type: "aadhar",
          userId: "demo-victim-123", // 🔹 replace with Firebase auth UID later
          cid: aadharCID,
          timestamp: new Date().toISOString(),
          claimId: null // Will be updated after claim submission
        })
        
        toast.success("Aadhar number saved to IPFS successfully")
      }

      // 3. Upload docs to IPFS
      const documentHashes: string[] = []
      for (const file of formData.documents) {
        const hash = await uploadToIPFS(file)
        documentHashes.push(hash)
      }

      // 4. Submit claim
      const claimData: ClaimSubmissionData = {
        userId: "demo-victim-123", // 🔹 replace with Firebase auth UID later
        disasterType: formData.disasterType,
        description: formData.description,
        requestedAmount: Number.parseFloat(formData.requestedAmount),
        location: formData.location,
        coordinates: location,
        documentHashes,
        aadharCID,
        status: "pending",
      }
      
      const claimResult = await submitClaim(claimData)

      // 5. Update the Aadhar CID record with claim ID if available
      if (aadharCID && claimResult?.claimId) {
        await saveCIDToFirestore({
          type: "aadhar",
          userId: "demo-victim-123",
          cid: aadharCID,
          timestamp: new Date().toISOString(),
          claimId: claimResult.claimId
        })
      }

      toast.success("✅ Claim submitted successfully!")
      setFormData({
        disasterType: "",
        description: "",
        requestedAmount: "",
        location: "",
        aadharNumber: "",
        documents: [],
      })
      setLocation(null)
      setAadhaarVerified(false)
      onSuccess()
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit claim")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Relief Claim</CardTitle>
        <CardDescription>
          Fill out this form to request disaster relief assistance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Disaster type */}
          <div>
            <Label htmlFor="disasterType">Disaster Type</Label>
            <Select
              value={formData.disasterType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, disasterType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select disaster type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="earthquake">Earthquake</SelectItem>
                <SelectItem value="cyclone">Cyclone</SelectItem>
                <SelectItem value="fire">Fire</SelectItem>
                <SelectItem value="drought">Drought</SelectItem>
                <SelectItem value="landslide">Landslide</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Aadhaar Number with Verification */}
          <div>
            <Label htmlFor="aadharNumber">Aadhaar Number *</Label>
            <div className="flex gap-2">
              <Input
                id="aadharNumber"
                type="text"
                placeholder="Enter 12-digit Aadhaar number"
                value={formData.aadharNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 12)
                  setFormData((prev) => ({ ...prev, aadharNumber: value }))
                  // Reset verification if user changes the number
                  if (aadhaarVerified && value !== formData.aadharNumber) {
                    setAadhaarVerified(false)
                  }
                }}
                pattern="[0-9]{12}"
                maxLength={12}
                required
                disabled={aadhaarVerified}
                className={aadhaarVerified ? "bg-green-50 border-green-300" : ""}
              />
              <Button
                type="button"
                onClick={handleAadhaarVerify}
                disabled={isVerifying || aadhaarVerified || formData.aadharNumber.length !== 12}
                variant={aadhaarVerified ? "default" : "outline"}
                className={aadhaarVerified ? "bg-green-500 hover:bg-green-600 text-white" : ""}
              >
                {isVerifying ? 'Verifying...' : aadhaarVerified ? 'Verified ✅' : 'Verify'}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your Aadhaar number will be securely stored on IPFS and CID saved in Firestore
            </p>
            {aadhaarVerified && (
              <p className="text-xs text-green-600 mt-1 font-medium">
                ✅ Aadhaar verification completed
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the disaster impact and your situation..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              required
              rows={4}
            />
          </div>

          {/* Requested amount */}
          <div>
            <Label htmlFor="requestedAmount">Requested Amount (₹)</Label>
            <Input
              id="requestedAmount"
              type="number"
              placeholder="Enter amount needed"
              value={formData.requestedAmount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  requestedAmount: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="flex space-x-2">
              <Input
                id="location"
                placeholder="Enter location or use GPS"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                required
              />
              <Button type="button" onClick={getLocation} variant="outline">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            {location && (
              <p className="text-sm text-green-600 mt-1">
                ✓ GPS coordinates captured
              </p>
            )}
          </div>

          {/* Documents */}
          <div>
            <Label htmlFor="documents">Supporting Documents</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                id="documents"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="documents" className="cursor-pointer">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload damage photos and other proofs
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG up to 10MB each
                  </p>
                </div>
              </label>
              {formData.documents.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Selected files:</p>
                  {formData.documents.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info banner */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>All information will be verified by our NGO partners</li>
                  <li>False claims may result in legal action</li>
                  <li>Documents and Aadhar number will be stored securely on IPFS</li>
                  <li>Aadhar CID will be stored in Firestore for verification</li>
                  <li>You'll receive updates via email and SMS</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !aadhaarVerified || !location}
            title={
              !aadhaarVerified || !location 
                ? 'Please verify Aadhaar and enable Geo-location to continue'
                : 'Submit your claim'
            }
          >
            {loading ? "Submitting Claim..." : "Submit Relief Claim"}
          </Button>
          
          {/* Validation Status */}
          {(!aadhaarVerified || !location) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-sm text-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Please complete: 
                  {!aadhaarVerified && " Aadhaar verification"}
                  {!aadhaarVerified && !location && " and"}
                  {!location && " Geo-location capture"}
                </span>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      
      {/* Aadhaar Verification Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-4">
            <div className="text-center">
              <div className="text-green-500 text-4xl mb-2">✅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aadhaar Verified Successfully
              </h3>
              <p className="text-gray-600">You can now proceed with your claim submission.</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
