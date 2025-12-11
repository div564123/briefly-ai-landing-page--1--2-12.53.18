"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import { AppSidebar } from "@/components/app-sidebar"
import { UploadSection } from "@/components/upload-section"
import { SettingsPanel } from "@/components/settings-panel"
import { DashboardHeader } from "@/components/dashboard-header"
import { FolderView } from "@/components/folder-view"
import { AudioPlayerDialog } from "@/components/audio-player-dialog"
import { UpgradeBlocker } from "@/components/upgrade-blocker"
import { ErrorModal } from "@/components/error-modal"
import { getAudioFiles, createAudioFile, deleteAudioFile, getFolders, type AudioFile } from "@/lib/storage"
import { ThemeProvider } from "@/lib/theme-provider"

export default function DashboardPage() {
  const { data: session, status } = useSession()

  const [userPlan, setUserPlan] = useState<"starter" | "pro">("starter")
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFolderForUpload, setSelectedFolderForUpload] = useState<string | null>(null)
  const [availableFolders, setAvailableFolders] = useState(getFolders())
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [generationSuccess, setGenerationSuccess] = useState<string | null>(null)
  const [recentlyGeneratedAudio, setRecentlyGeneratedAudio] = useState<{ url: string; name: string } | null>(null)
  const [usage, setUsage] = useState<{ current: number; limit: number; tier: string; remaining: number } | null>(null)
  const [showUpgradeBlocker, setShowUpgradeBlocker] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorModalError, setErrorModalError] = useState<string>("")
  const [errorModalFileName, setErrorModalFileName] = useState<string>("")
  const [extractedText, setExtractedText] = useState<string>("")
  const [isExtractingText, setIsExtractingText] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    setAudioFiles(getAudioFiles(activeFolderId))
  }, [activeFolderId])

  // Extract text when file is selected
  useEffect(() => {
    const extractText = async () => {
      if (!selectedFile) {
        setExtractedText("")
        return
      }

      setIsExtractingText(true)
      setExtractedText("")

      try {
        const formData = new FormData()
        formData.append("file", selectedFile)

        const response = await fetch("/api/audio/extract-text", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: response.statusText }))
          
          if (errorData.errorType === "file_error") {
            setErrorModalError(errorData.error)
            setErrorModalFileName(selectedFile.name)
            setShowErrorModal(true)
            setSelectedFile(null)
          } else {
            setGenerationError(errorData.error || "Failed to extract text")
          }
          return
        }

        const data = await response.json()
        setExtractedText(data.text || "")
      } catch (error: any) {
        console.error("Error extracting text:", error)
        setGenerationError(error.message || "Failed to extract text")
      } finally {
        setIsExtractingText(false)
      }
    }

    extractText()
  }, [selectedFile])

  // Fetch usage data and verify subscription status
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        // First verify subscription status (updates tier if payment was made or subscription canceled)
        try {
          const verifyResponse = await fetch("/api/checkout/verify-session", { method: "POST" })
          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json()
            // Update user plan if tier changed (e.g., subscription canceled)
            if (verifyData.tier) {
              setUserPlan(verifyData.tier)
            }
          }
        } catch (error) {
          // Ignore errors, just try to get usage
        }
        
        // Then get usage data
        const response = await fetch("/api/audio/usage")
        if (response.ok) {
          const data = await response.json()
          setUsage(data)
          setUserPlan(data.tier)
        }
      } catch (error) {
        console.error("Failed to fetch usage:", error)
      }
    }
    
    if (status === "authenticated") {
      fetchUsage()
    }
  }, [status])

  // Auto-dismiss success/error messages after 5 seconds
  useEffect(() => {
    if (generationSuccess) {
      const timer = setTimeout(() => setGenerationSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [generationSuccess])

  useEffect(() => {
    if (generationError) {
      const timer = setTimeout(() => setGenerationError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [generationError])

  const handleSummaryTypeChange = async (summaryType: string, text: string) => {
    if (!selectedFile || !text.trim()) {
      return
    }

    setIsGeneratingSummary(true)
    setGenerationError(null)

    try {
      const summaryLengthMap: Record<string, "short" | "medium" | "full"> = {
        summary: "short",
        median: "medium",
        full: "full",
      }

      const summaryLength = summaryLengthMap[summaryType] || "medium"
      const language = "en" // We'll translate later if needed

      // Generate summary from extracted text
      const summaryFormData = new FormData()
      summaryFormData.append("file", selectedFile)
      summaryFormData.append("summaryLength", summaryType)
      summaryFormData.append("language", language)

      console.log("🌐 Generating summary for type:", summaryType)
      const summaryResponse = await fetch("/api/audio/generate-summary", {
        method: "POST",
        body: summaryFormData,
      })

      if (!summaryResponse.ok) {
        const errorData = await summaryResponse.json().catch(() => ({ error: summaryResponse.statusText }))
        throw new Error(errorData.error || "Failed to generate summary")
      }

      const summaryData = await summaryResponse.json()
      console.log("✅ Summary generated:", summaryData.summary.substring(0, 100) + "...")

      // Update the textarea with the generated summary
      setExtractedText(summaryData.summary)
    } catch (error: any) {
      console.error("Error generating summary:", error)
      setGenerationError(error.message || "Failed to generate summary")
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const handleLanguageChange = async (language: string, text: string) => {
    if (!selectedFile || !text.trim()) {
      return
    }

    // If language is English, we don't need to translate
    // But we might want to restore original text if we had it
    if (language === "en") {
      // For now, we'll just keep the current text
      // In the future, we could store the original English text
      return
    }

    setIsTranslating(true)
    setGenerationError(null)

    try {
      // Translate the current text
      const translateFormData = new FormData()
      translateFormData.append("file", selectedFile)
      translateFormData.append("summaryLength", "medium") // Not used for translation
      translateFormData.append("language", language)
      translateFormData.append("customText", text) // Use current textarea content

      console.log(`🌐 Translating text to ${language}...`)
      const translateResponse = await fetch("/api/audio/generate-summary", {
        method: "POST",
        body: translateFormData,
      })

      if (!translateResponse.ok) {
        const errorData = await translateResponse.json().catch(() => ({ error: translateResponse.statusText }))
        throw new Error(errorData.error || "Failed to translate text")
      }

      const translateData = await translateResponse.json()
      console.log("✅ Text translated:", translateData.summary.substring(0, 100) + "...")

      // Update the textarea with the translated text
      setExtractedText(translateData.summary)
    } catch (error: any) {
      console.error("Error translating text:", error)
      setGenerationError(error.message || "Failed to translate text")
    } finally {
      setIsTranslating(false)
    }
  }

  const handleGenerateAudio = async (audioName: string, folderId: string | null, settings: any) => {
    if (!selectedFile) {
      setGenerationError("Please select a file first")
      return
    }

    if (!extractedText || !extractedText.trim()) {
      setGenerationError("Please wait for text extraction or generate a summary first")
      return
    }

    // Check usage limit before generating (only for Starter plan)
    if (usage && usage.tier !== "pro" && usage.remaining <= 0 && usage.limit !== Infinity) {
      setShowUpgradeBlocker(true)
      return
    }

    console.log("🎵 Starting audio generation...")
    console.log("📁 File:", selectedFile.name)
    console.log("📝 Using text from textarea:", extractedText.length, "characters")
    console.log("⚙️  Settings:", settings)

    setIsGenerating(true)
    setGenerationError(null)
    setGenerationSuccess(null)

    try {
      const summaryLengthMap: Record<string, "short" | "medium" | "full"> = {
        summary: "short",
        median: "medium",
        full: "full",
      }

      const summaryLength = summaryLengthMap[settings.summaryType] || "medium"
      const speed = settings.voiceSpeed || 1.0
      const voiceName = settings.voiceType || "sarah"
      const backgroundMusic = settings.backgroundMusic || "none"
      const language = settings.language || "en"

      // Use the textarea content directly (it's already translated if language is not English)
      // The textarea is updated when user changes language, so we use it as-is
      const finalText = extractedText

      // Create form data with the textarea content
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("speed", speed.toString())
      formData.append("tone", voiceName)
      formData.append("summaryLength", summaryLength)
      formData.append("language", language)
      formData.append("backgroundMusic", backgroundMusic)
      formData.append("customSummary", finalText) // Use textarea content (already translated if needed)

      // Call the API with timeout
      console.log("🌐 Calling /api/audio/generate with custom summary...")
      
      // Create an AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 minutes timeout
      
      let response: Response
      try {
        response = await fetch("/api/audio/generate", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
      } catch (error: any) {
        clearTimeout(timeoutId)
        if (error.name === "AbortError") {
          throw new Error("Request timed out. Audio generation is taking too long. Please try again.")
        }
        throw error
      }

      console.log("📥 Response status:", response.status, response.statusText)
      console.log("📥 Content-Type:", response.headers.get("content-type"))

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        // Response is not JSON (likely HTML error page)
        const text = await response.text()
        console.error("❌ Non-JSON response received:", text.substring(0, 200))
        throw new Error(`Server returned an error page. Status: ${response.status}. Check server logs for details.`)
      }

      let data: any
      try {
        data = await response.json()
        console.log("📦 Response data keys:", Object.keys(data))
        console.log("📦 Has audioData:", !!data.audioData)
        console.log("📦 Has audio.downloadUrl:", !!data.audio?.downloadUrl)
        if (data.audioData) {
          console.log("📦 audioData length:", data.audioData.length)
        }
      } catch (parseError) {
        console.error("❌ Failed to parse JSON response:", parseError)
        throw new Error("Failed to parse server response. The response may be too large.")
      }

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 403) {
          // Only show blocker if user is not Pro
          if (data.tier !== "pro" && userPlan !== "pro") {
            setShowUpgradeBlocker(true)
            // Refresh usage to get latest count
            const usageResponse = await fetch("/api/audio/usage")
            if (usageResponse.ok) {
              const usageData = await usageResponse.json()
              setUsage(usageData)
            }
          }
          throw new Error(data.error || "Monthly upload limit reached. Please upgrade to Pro for unlimited uploads.")
        }
        if (response.status === 401) {
          throw new Error("Please log in to generate audio")
        }
        if (response.status === 500) {
          throw new Error(data.error || "Server error. Check your API keys in .env.local")
        }
        throw new Error(data.error || "Failed to generate audio")
      }

      // Success! Handle audio response
      if (data.audioData || data.audio?.downloadUrl) {
        const finalName = audioName || selectedFile.name.replace(/\.[^/.]+$/, "")
        
        // Create audio URL from base64 data if available
        let audioUrl: string
        if (data.audioData) {
          // audioData is already a data URL (data:audio/mpeg;base64,...)
          // Can be used directly in audio element
          audioUrl = data.audioData
          console.log("✅ Using audio data URL directly")
        } else if (data.audio?.downloadUrl) {
          audioUrl = data.audio.downloadUrl
          console.log("✅ Using download URL")
        } else {
          throw new Error("No audio data or download URL provided")
        }
        
        // Create audio file entry in local storage
        const newAudio = createAudioFile(finalName, folderId, audioUrl)
        setAudioFiles(getAudioFiles(activeFolderId))
        setSelectedFile(null)
        setAvailableFolders(getFolders())
        setGenerationSuccess(`Audio generated successfully!`)
        
        // Refresh usage data
        const usageResponse = await fetch("/api/audio/usage")
        if (usageResponse.ok) {
          const usageData = await usageResponse.json()
          setUsage(usageData)
        }
        
        // Show audio player instead of auto-downloading
        setRecentlyGeneratedAudio({
          url: audioUrl,
          name: finalName,
        })
        
        console.log("✅ Audio generated successfully!")
        console.log("🔗 Audio URL:", audioUrl)
      } else {
        throw new Error("Audio generated but no audio data or download URL provided")
      }
    } catch (error) {
      console.error("❌ Audio generation error:", error)
      const errorMessage = error instanceof Error ? error.message : "Something went wrong"
      console.error("Error details:", error)
      
      // Check if it's a PDF/file-related error that should show in modal
      const errorLower = errorMessage.toLowerCase()
      if (
        errorLower.includes("empty") ||
        errorLower.includes("only images") ||
        errorLower.includes("selectable text") ||
        errorLower.includes("parse") ||
        errorLower.includes("parsing") ||
        errorLower.includes("failed to parse") ||
        errorLower.includes("unsupported") ||
        errorLower.includes("file type") ||
        errorLower.includes("size") ||
        errorLower.includes("too large") ||
        errorLower.includes("exceeds") ||
        errorLower.includes("corrupted")
      ) {
        // Show error modal for file-related errors
        setErrorModalError(errorMessage)
        setErrorModalFileName(selectedFile?.name || "")
        setShowErrorModal(true)
      } else {
        // Show inline error for other errors
        setGenerationError(errorMessage)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeleteAudio = (id: string) => {
    deleteAudioFile(id)
    setAudioFiles(getAudioFiles(activeFolderId))
  }

  const handleBackToDashboard = () => {
    setActiveFolderId(null)
  }

  const getActiveFolderName = () => {
    if (!activeFolderId) return ""
    const folders = getFolders()
    const folder = folders.find((f) => f.id === activeFolderId)
    return folder?.name || ""
  }

  const handleFolderChange = () => {
    setAvailableFolders(getFolders())
  }

  // Don't block on loading - show content immediately
  // Session will load in background
  if (status === "loading") {
    return (
      <ThemeProvider>
        <div className="flex h-screen bg-background">
          <AppSidebar
            activeFolderId={activeFolderId}
            onFolderSelect={setActiveFolderId}
            onFolderChange={handleFolderChange}
            userPlan={userPlan}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            {!activeFolderId && <DashboardHeader />}
            <main className="flex-1 flex gap-6 overflow-hidden items-center justify-center">
              <div className="text-muted-foreground">Loading...</div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    )
  }
  
  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    // This will be handled by middleware, but show a message
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to access the dashboard</p>
          <a href="/login" className="text-primary hover:underline">Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar
          activeFolderId={activeFolderId}
          onFolderSelect={setActiveFolderId}
          onFolderChange={handleFolderChange}
          userPlan={userPlan}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {!activeFolderId && <DashboardHeader />}

          <main className="flex-1 flex gap-6 overflow-hidden">
            {activeFolderId ? (
              <FolderView
                folderId={activeFolderId}
                folderName={getActiveFolderName()}
                audioFiles={audioFiles}
                onDelete={handleDeleteAudio}
                onBack={handleBackToDashboard}
                onAudioAdded={() => setAudioFiles(getAudioFiles(activeFolderId))}
              />
            ) : (
              <>
                <div className="flex-1 flex flex-col overflow-hidden">
                  <UploadSection 
                    selectedFile={selectedFile} 
                    onFileSelect={setSelectedFile}
                    usage={usage}
                    extractedText={extractedText}
                    onTextChange={setExtractedText}
                    isExtractingText={isExtractingText}
                  />
                </div>

                <div className="p-8 overflow-auto">
                  {generationError && (
                    <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive flex items-start gap-2">
                      <span className="text-destructive">⚠️</span>
                      <span>{generationError}</span>
                    </div>
                  )}
                  {generationSuccess && (
                    <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-600 dark:text-green-400 flex items-start gap-2">
                      <span>✅</span>
                      <span>{generationSuccess}</span>
                    </div>
                  )}
                  
                  <SettingsPanel
                    selectedFile={selectedFile}
                    onGenerateAudio={handleGenerateAudio}
                    availableFolders={availableFolders}
                    isGenerating={isGenerating}
                    userPlan={userPlan}
                    extractedText={extractedText}
                    onTextChange={setExtractedText}
                    onSummaryTypeChange={handleSummaryTypeChange}
                    onLanguageChange={handleLanguageChange}
                    isGeneratingSummary={isGeneratingSummary}
                    isTranslating={isTranslating}
                  />
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Audio Player Modal Popup with Bright Background */}
      {recentlyGeneratedAudio && (
        <AudioPlayerDialog
          open={!!recentlyGeneratedAudio}
          onOpenChange={(open) => !open && setRecentlyGeneratedAudio(null)}
          audioUrl={recentlyGeneratedAudio.url}
          audioName={recentlyGeneratedAudio.name}
        />
      )}

      {/* Upgrade Blocker Modal */}
      {usage && (
        <UpgradeBlocker
          open={showUpgradeBlocker}
          onOpenChange={setShowUpgradeBlocker}
          current={usage.current}
          limit={usage.limit}
        />
      )}

      {/* Error Modal for File-Related Errors */}
      <ErrorModal
        open={showErrorModal}
        onOpenChange={setShowErrorModal}
        error={errorModalError}
        fileName={errorModalFileName}
      />
    </ThemeProvider>
  )
}


