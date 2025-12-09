export interface AudioFile {
  id: string
  name: string
  folderId: string | null
  createdAt: Date
  duration: string
  size: string
  url?: string // Audio file URL for playback
}

export interface Folder {
  id: string
  name: string
  count: number
}

// In-memory storage (replace with real database later)
let folders: Folder[] = []

let audioFiles: AudioFile[] = []

export function getFolders(): Folder[] {
  return folders
}

export function createFolder(name: string): Folder {
  const newFolder: Folder = {
    id: Math.random().toString(36).substring(7),
    name,
    count: 0,
  }
  folders.push(newFolder)
  return newFolder
}

export function deleteFolder(id: string): void {
  folders = folders.filter((f) => f.id !== id)
  // Also remove audio files in this folder
  audioFiles = audioFiles.filter((a) => a.folderId !== id)
}

export function getAudioFiles(folderId: string | null): AudioFile[] {
  return audioFiles.filter((a) => a.folderId === folderId)
}

export function getAllAudioFiles(): AudioFile[] {
  return audioFiles
}

export function moveAudioToFolder(audioId: string, folderId: string): void {
  const audio = audioFiles.find((a) => a.id === audioId)
  if (audio) {
    // Update old folder count
    if (audio.folderId) {
      const oldFolder = folders.find((f) => f.id === audio.folderId)
      if (oldFolder) oldFolder.count--
    }

    // Update audio folder
    audio.folderId = folderId

    // Update new folder count
    const newFolder = folders.find((f) => f.id === folderId)
    if (newFolder) newFolder.count++
  }
}

export function createAudioFile(name: string, folderId: string | null, url?: string): AudioFile {
  const newAudio: AudioFile = {
    id: Math.random().toString(36).substring(7),
    name,
    folderId,
    createdAt: new Date(),
    duration: "5:23",
    size: "2.3 MB",
    url, // Store the audio URL for playback
  }
  audioFiles.push(newAudio)

  // Update folder count
  if (folderId) {
    const folder = folders.find((f) => f.id === folderId)
    if (folder) folder.count++
  }

  return newAudio
}

export function deleteAudioFile(id: string): void {
  const audio = audioFiles.find((a) => a.id === id)
  if (audio && audio.folderId) {
    const folder = folders.find((f) => f.id === audio.folderId)
    if (folder) folder.count--
  }
  audioFiles = audioFiles.filter((a) => a.id !== id)
}




