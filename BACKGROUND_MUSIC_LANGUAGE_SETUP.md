# Background Music & Language Setup Guide

This guide explains how to implement real background music mixing and language selection for audio generation.

## Current Status

✅ **Language Selection**: Implemented using OpenAI translation
- Text is translated to the target language before audio generation
- Supports: English, French, Spanish
- Uses OpenAI GPT-4o-mini for translation

⚠️ **Background Music**: Partially implemented
- UI is ready and settings are passed to API
- Audio mixing requires ffmpeg installation
- See "Background Music Setup" section below

## 1. Language Implementation ✅

Language selection is **already implemented**! Here's how it works:

### How It Works

1. User selects language (English, French, or Spanish) in settings
2. Text is extracted from the document
3. Summary is generated in English
4. **If language is not English**, the summary is translated using OpenAI
5. Translated summary is sent to LemonFox for audio generation

### Supported Languages

- **English (en)** - Default, no translation needed
- **French (fr)** - Translated using OpenAI
- **Spanish (es)** - Translated using OpenAI

### Adding More Languages

To add more languages, update:
1. `components/settings-panel.tsx` - Add language option to Select
2. `app/api/audio/generate/route.ts` - Add language name to `languageNames` object

## 2. Background Music Setup ⚠️

Background music mixing requires additional setup:

### Step 1: Install FFmpeg

```bash
npm install fluent-ffmpeg @ffmpeg-installer/ffmpeg
```

### Step 2: Create Background Music Directory

```bash
mkdir -p public/background-music
```

### Step 3: Add Background Music Files

Download or create royalty-free music files and place them in `public/background-music/`:

- `calm-piano.mp3`
- `ambient-sounds.mp3`
- `soft-jazz.mp3`
- `nature-sounds.mp3`
- `lo-fi-beats.mp3`

### Step 4: Update Audio Mixing Function

Update the `mixBackgroundMusic` function in `app/api/audio/generate/route.ts`:

```typescript
import ffmpeg from "fluent-ffmpeg"
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg"
import { writeFile, readFile, unlink } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path)

async function mixBackgroundMusic(speechAudio: Buffer, musicType: string): Promise<Buffer> {
  const tempDir = join(process.cwd(), "tmp")
  const speechPath = join(tempDir, `speech-${randomUUID()}.mp3`)
  const musicPath = `public/background-music/${musicType}.mp3`
  const outputPath = join(tempDir, `mixed-${randomUUID()}.mp3`)

  try {
    // Write speech audio to temp file
    await writeFile(speechPath, speechAudio)

    // Mix audio using ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(speechPath)
        .input(musicPath)
        .complexFilter([
          "[0:a]volume=0.7[speech]",
          "[1:a]volume=0.3[music]",
          "[speech][music]amix=inputs=2:duration=first:dropout_transition=2"
        ])
        .output(outputPath)
        .on("end", resolve)
        .on("error", reject)
        .run()
    })

    // Read mixed audio
    const mixedAudio = await readFile(outputPath)

    // Cleanup temp files
    await unlink(speechPath).catch(() => {})
    await unlink(outputPath).catch(() => {})

    return mixedAudio
  } catch (error) {
    console.error("Error mixing audio:", error)
    // Cleanup on error
    await unlink(speechPath).catch(() => {})
    await unlink(outputPath).catch(() => {})
    return speechAudio // Return original if mixing fails
  }
}
```

### Free Background Music Sources

- **Freesound.org** - https://freesound.org/ (Free sound effects and music)
- **Incompetech** - https://incompetech.com/music/ (Royalty-free music)
- **Bensound** - https://www.bensound.com/ (Free music tracks)
- **YouTube Audio Library** - https://www.youtube.com/audiolibrary (Free music for projects)
- **Pixabay Music** - https://pixabay.com/music/ (Free music tracks)

### Music Requirements

- Format: MP3
- Duration: At least 10 minutes (will loop if needed)
- Volume: Normalized to avoid clipping
- License: Must be royalty-free or properly licensed

## 3. Testing

### Test Language Selection

1. Upload a document
2. Select a language (French or Spanish)
3. Generate audio
4. Check console logs for translation confirmation
5. Verify audio is in the selected language

### Test Background Music

1. Install ffmpeg (see Step 1 above)
2. Add background music files (see Step 3 above)
3. Update mixing function (see Step 4 above)
4. Select background music option
5. Generate audio
6. Verify background music is mixed with speech

## 4. Performance Considerations

- **Translation**: Adds ~1-2 seconds to generation time
- **Audio Mixing**: Adds ~2-5 seconds to generation time
- **File Size**: Mixed audio files are larger than speech-only
- **Caching**: Consider caching translated summaries and mixed audio

## 5. Troubleshooting

### Language Not Working

- Check OpenAI API key is valid
- Verify language code matches supported languages
- Check console logs for translation errors

### Background Music Not Working

- Verify ffmpeg is installed: `ffmpeg -version`
- Check music files exist in `public/background-music/`
- Verify file paths in `musicFiles` object
- Check console logs for mixing errors

## 6. Next Steps

1. ✅ Language selection is working
2. ⚠️ Install ffmpeg and add music files for background music
3. Consider adding more languages
4. Consider adding more background music options
5. Optimize audio mixing performance
