"use client"

import { cn } from "@/lib/utils"
import { Lock, Volume2, Gauge, Music, FolderOpen, Globe, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { Folder } from "@/lib/storage"

export function SettingsPanel({
  selectedFile,
  onGenerateAudio,
  availableFolders = [],
  isGenerating = false,
  userPlan = "starter",
  extractedText = "",
  onTextChange,
  onSummaryTypeChange,
  onLanguageChange,
  isGeneratingSummary = false,
  isTranslating = false,
}: {
  selectedFile: File | null
  onGenerateAudio: (audioName: string, folderId: string | null, settings: any) => void
  availableFolders?: Folder[]
  isGenerating?: boolean
  userPlan?: "starter" | "pro"
  extractedText?: string
  onTextChange?: (text: string) => void
  onSummaryTypeChange?: (summaryType: string, text: string) => void
  onLanguageChange?: (language: string, text: string) => void
  isGeneratingSummary?: boolean
  isTranslating?: boolean
}) {
  const [summaryType, setSummaryType] = useState("summary")
  const [voiceType, setVoiceType] = useState("sarah")
  const [voiceSpeed, setVoiceSpeed] = useState([1])
  const [backgroundMusic, setBackgroundMusic] = useState("none")
  const [language, setLanguage] = useState("en")
  const [audioName, setAudioName] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const currentPlan = userPlan

  const voiceOptions = [
    { id: "sarah", name: "Sarah", gender: "female", description: "Clear & Professional" },
    { id: "emma", name: "Emma", gender: "female", description: "Warm & Friendly" },
    { id: "olivia", name: "Olivia", gender: "female", description: "Energetic & Young" },
    { id: "james", name: "James", gender: "male", description: "Deep & Authoritative" },
    { id: "liam", name: "Liam", gender: "male", description: "Calm & Soothing" },
    { id: "noah", name: "Noah", gender: "male", description: "Confident & Clear" },
  ]

  const handleGenerate = () => {
    if (selectedFile) {
      const name = audioName.trim() || selectedFile.name.replace(/\.[^/.]+$/, "")
      onGenerateAudio(name, selectedFolder, {
        summaryType,
        voiceType,
        voiceSpeed: voiceSpeed[0],
        backgroundMusic,
        language,
      })
      setAudioName("")
      setSelectedFolder(null)
    }
  }

  return (
    <div className="w-96 flex flex-col gap-4 overflow-auto">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Settings</h3>
          <p className="text-sm text-muted-foreground">Configure your audio based on your current plan</p>
        </div>

        <Card>
          <div className="p-4 space-y-4">
            {/* Audio Name Input */}
            <div>
              <h4 className="text-sm font-semibold text-card-foreground mb-2">Audio Name</h4>
              <p className="text-xs text-muted-foreground mb-3">Give your audio a memorable name</p>
              <Input
                placeholder="e.g., Chapter 5 Summary"
                value={audioName}
                onChange={(e) => setAudioName(e.target.value)}
                disabled={!selectedFile}
              />
            </div>

            {/* Folder Selection */}
            {availableFolders.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-semibold text-card-foreground">Select Folder</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Choose where to save your audio</p>
                <Select
                  value={selectedFolder || "none"}
                  onValueChange={(val) => setSelectedFolder(val === "none" ? null : val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a folder (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Folder</SelectItem>
                    {availableFolders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-sm">
                <div className="w-2.5 h-2.5 bg-white rounded-sm" />
              </div>
              <h4 className="text-sm font-semibold text-card-foreground">Summary Type</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Choose how detailed you want the summary</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSummaryType("summary")
                  if (onSummaryTypeChange && extractedText) {
                    onSummaryTypeChange("summary", extractedText)
                  }
                }}
                disabled={!extractedText || isGeneratingSummary}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  summaryType === "summary"
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-accent",
                  (!extractedText || isGeneratingSummary) && "opacity-50 cursor-not-allowed"
                )}
              >
                Summary
              </button>
              <button
                onClick={() => {
                  setSummaryType("median")
                  if (onSummaryTypeChange && extractedText) {
                    onSummaryTypeChange("median", extractedText)
                  }
                }}
                disabled={!extractedText || isGeneratingSummary}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  summaryType === "median"
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-accent",
                  (!extractedText || isGeneratingSummary) && "opacity-50 cursor-not-allowed"
                )}
              >
                Medium
              </button>
              <button
                onClick={() => {
                  setSummaryType("full")
                  if (onSummaryTypeChange && extractedText) {
                    onSummaryTypeChange("full", extractedText)
                  }
                }}
                disabled={!extractedText || isGeneratingSummary}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  summaryType === "full"
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-accent",
                  (!extractedText || isGeneratingSummary) && "opacity-50 cursor-not-allowed"
                )}
              >
                Full
              </button>
            </div>
            {isGeneratingSummary && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Generating summary...
              </p>
            )}
          </div>
        </Card>

        {/* Language Setting */}
        <Card>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-sm">
                <Globe className="w-3 h-3 text-white" />
              </div>
              <h4 className="text-sm font-semibold text-card-foreground">Language</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Select the language for audio generation</p>
            <Select 
              value={language} 
              onValueChange={(value) => {
                setLanguage(value)
                if (onLanguageChange && extractedText) {
                  onLanguageChange(value, extractedText)
                }
              }}
              disabled={!extractedText || isTranslating}
            >
              <SelectTrigger className="w-full" disabled={!extractedText || isTranslating}>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
            {isTranslating && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Translating text...
              </p>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-sm">
                <Volume2 className="w-3 h-3 text-white" />
              </div>
              <h4 className="text-sm font-semibold text-card-foreground">Voice Type</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Select your preferred narrator voice</p>
            <Select value={voiceType} onValueChange={setVoiceType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a voice" />
              </SelectTrigger>
              <SelectContent>
                {voiceOptions.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{voice.name}</span>
                      <span className="text-xs text-muted-foreground">• {voice.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Background Music */}
        <Card>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-sm">
                <Music className="w-3 h-3 text-white" />
              </div>
              <h4 className="text-sm font-semibold text-card-foreground">Background Music</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Add ambient music to enhance focus</p>
            <Select value={backgroundMusic} onValueChange={setBackgroundMusic}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select background music" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="calm-piano">Calm Piano</SelectItem>
                <SelectItem value="ambient-sounds">Ambient Sounds</SelectItem>
                <SelectItem value="soft-jazz">Soft Jazz</SelectItem>
                <SelectItem value="nature-sounds">Nature Sounds</SelectItem>
                <SelectItem value="lo-fi-beats">Lo-Fi Beats</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Voice Speed - Pro Feature */}
        <Card className={cn("relative", currentPlan !== "pro" && "border-border/50")}>
          {currentPlan !== "pro" && (
            <div className="absolute top-3 right-3 z-10">
              <div className="flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                <Lock className="w-3 h-3" />
                Pro
              </div>
            </div>
          )}

          <div className={cn("p-4", currentPlan !== "pro" && "opacity-60 pointer-events-none")}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-sm">
                <Gauge className="w-3 h-3 text-white" />
              </div>
              <h4 className="text-sm font-semibold text-card-foreground">Voice Speed</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Adjust playback speed from 0.5x to 2x</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Speed</span>
              <span className="text-sm font-medium text-foreground">{voiceSpeed[0]}x</span>
            </div>
            <Slider
              value={voiceSpeed}
              onValueChange={setVoiceSpeed}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
              disabled={currentPlan !== "pro"}
            />
          </div>

          {currentPlan !== "pro" && (
            <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent pointer-events-none rounded-lg" />
          )}
        </Card>

        {/* Updated Button with Cool Loading Animation */}
        <Button
          size="lg"
          className={cn(
            "w-full text-base font-semibold relative overflow-hidden transition-all duration-300",
            isGenerating 
              ? "bg-gradient-to-r from-primary via-primary/90 to-primary/80 cursor-wait" 
              : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
            (!selectedFile || isGenerating) && "opacity-90"
          )}
          onClick={handleGenerate}
          disabled={!selectedFile || isGenerating}
        >
          {isGenerating && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></div>
          )}
          <span className="relative flex items-center justify-center gap-2">
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="animate-pulse">Generating Audio...</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span>Generate Audio</span>
              </>
            )}
          </span>
        </Button>
      </div>
    </div>
  )
}


