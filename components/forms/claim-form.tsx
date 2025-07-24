"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Upload, FileText, AlertCircle } from "lucide-react"
import { submitClaim, uploadToIPFS } from "@/lib/api"
import { toast } from "sonner"

interface ClaimFormProps {
  onSuccess: () => void
}

export function ClaimForm({ onSuccess }: ClaimFormProps) {
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [formData, setFormData] = useState({
    disasterType: "",
    description: "",
    requestedAmount: "",
    location: "",
    documents: [] as File[],
  })

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
        (error) => {
          toast.error("Failed to get location. Please enter manually.")
        },
      )
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        documents: Array.from(e.target.files!),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    try {
      // Upload documents to IPFS
      const documentHashes = []
      for (const file of formData.documents) {
        const hash = await uploadToIPFS(file)
        documentHashes.push(hash)
      }

      // Submit claim with mock user ID
      await submitClaim({
        userId: "demo-victim-123",
        disasterType: formData.disasterType,
        description: formData.description,
        requestedAmount: Number.parseFloat(formData.requestedAmount),
        location: formData.location,
        coordinates: location,
        documentHashes,
        status: "pending",
      })

      toast.success("Claim submitted successfully!")
      onSuccess()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Relief Claim</CardTitle>
        <CardDescription>Fill out this form to request disaster relief assistance</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="disasterType">Disaster Type</Label>
            <Select
              value={formData.disasterType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, disasterType: value }))}
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

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the disaster impact and your situation..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              required
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="requestedAmount">Requested Amount (₹)</Label>
            <Input
              id="requestedAmount"
              type="number"
              placeholder="Enter amount needed"
              value={formData.requestedAmount}
              onChange={(e) => setFormData((prev) => ({ ...prev, requestedAmount: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <div className="flex space-x-2">
              <Input
                id="location"
                placeholder="Enter location or use GPS"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                required
              />
              <Button type="button" onClick={getLocation} variant="outline">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            {location && <p className="text-sm text-green-600 mt-1">✓ GPS coordinates captured</p>}
          </div>

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
                  <p className="text-sm text-gray-600">Click to upload Aadhaar, damage photos, and other proofs</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB each</p>
                </div>
              </label>
              {formData.documents.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Selected files:</p>
                  {formData.documents.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>All information will be verified by our NGO partners</li>
                  <li>False claims may result in legal action</li>
                  <li>Documents will be stored securely on IPFS</li>
                  <li>You'll receive updates via email and SMS</li>
                </ul>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting Claim..." : "Submit Relief Claim"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
