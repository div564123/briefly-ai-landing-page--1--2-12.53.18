"use client"

import { Folder, Music, Zap, Settings, Download } from "lucide-react"

export default function DashboardPreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Your Learning Workspace</h2>
          <p className="text-lg text-muted-foreground">Simple, intuitive, designed for students.</p>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative rounded-2xl overflow-hidden soft-shadow border border-border bg-gradient-to-br from-white to-muted">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-primary to-secondary px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap className="text-white" size={20} />
              <h3 className="font-bold text-white text-lg">Briefly AI Dashboard</h3>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-white/30"></div>
              <div className="w-3 h-3 rounded-full bg-white/30"></div>
              <div className="w-3 h-3 rounded-full bg-white/30"></div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-12 gap-4 p-8">
            {/* Sidebar */}
            <div className="col-span-12 md:col-span-3 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
                <Folder size={14} />
                MY COURSES
              </div>
              <div className="bg-primary/10 text-primary text-sm font-semibold rounded-lg p-3 cursor-pointer hover:bg-primary/20 transition flex items-center gap-2">
                <span>📚</span> Mathematics
              </div>
              <div className="text-sm font-semibold text-muted-foreground rounded-lg p-3 cursor-pointer hover:bg-muted transition flex items-center gap-2">
                <span>📖</span> History
              </div>
              <div className="text-sm font-semibold text-muted-foreground rounded-lg p-3 cursor-pointer hover:bg-muted transition flex items-center gap-2">
                <span>🧬</span> Science
              </div>
              <div className="text-sm font-semibold text-muted-foreground rounded-lg p-3 cursor-pointer hover:bg-muted transition flex items-center gap-2">
                <span>🌍</span> Geography
              </div>
            </div>

            {/* Main Player */}
            <div className="col-span-12 md:col-span-6 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-foreground">Integral Calculus - Summary</h4>
                  <Download size={18} className="text-muted-foreground cursor-pointer hover:text-primary" />
                </div>

                {/* Waveform */}
                <div className="mb-6 space-y-2">
                  <div className="h-16 bg-gradient-to-r from-primary/20 via-secondary/40 to-primary/20 rounded-lg flex items-center justify-center gap-1 px-4">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary to-secondary rounded"
                        style={{ height: `${Math.random() * 100}%`, minHeight: "4px" }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0:00</span>
                    <span>12:34</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button className="text-muted-foreground hover:text-primary transition">⏮</button>
                  <button className="w-12 h-12 rounded-full gradient-purple text-white flex items-center justify-center hover:shadow-lg">
                    ▶
                  </button>
                  <button className="text-muted-foreground hover:text-primary transition">⏭</button>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-white rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Summary generated:</span> Oct 28, 2024
                </p>
              </div>
            </div>

            {/* Settings Panel */}
            <div className="col-span-12 md:col-span-3 space-y-4">
              <div className="bg-white rounded-xl p-4 border border-border">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
                  <Settings size={14} />
                  VOICE
                </label>
                <select className="w-full bg-muted rounded-lg py-2 px-3 text-sm text-foreground border border-border">
                  <option>Clara</option>
                  <option>James</option>
                  <option>Sophie</option>
                </select>
              </div>

              <div className="bg-white rounded-xl p-4 border border-border">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
                  <Zap size={14} />
                  SPEED
                </label>
                <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" className="w-full" />
                <p className="text-xs text-muted-foreground mt-2">1.0x</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-border">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
                  <Music size={14} />
                  BACKGROUND
                </label>
                <select className="w-full bg-muted rounded-lg py-2 px-3 text-sm text-foreground border border-border">
                  <option>None</option>
                  <option>White Noise</option>
                  <option>Soft Music</option>
                </select>
              </div>
            </div>
          </div>

          {/* Gradient Accent */}
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-secondary/30 to-transparent rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  )
}
