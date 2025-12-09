# How to Add Background Music Files

This guide shows you exactly how to download and add background music files to your app.

## Step-by-Step Instructions

### Step 1: Download Music Files

You need 5 music files. Here are the easiest ways to get them:

#### Option A: Pixabay (Recommended - Easiest)

1. Go to https://pixabay.com/music/
2. Search for each type:
   - Search "calm piano" → Download one
   - Search "ambient background" → Download one
   - Search "soft jazz" → Download one
   - Search "nature sounds" → Download one
   - Search "lo-fi beats" → Download one
3. Click "Free Download" on each track
4. Make sure to download as MP3 format

#### Option B: YouTube Audio Library

1. Go to https://www.youtube.com/audiolibrary
2. Browse by genre or mood
3. Download tracks that match each category
4. They're already in MP3 format

#### Option C: Freesound.org

1. Go to https://freesound.org/
2. Create a free account
3. Search for each music type
4. Download MP3 files

### Step 2: Rename Files

Rename your downloaded files to match these exact names:

- `calm-piano.mp3`
- `ambient-sounds.mp3`
- `soft-jazz.mp3`
- `nature-sounds.mp3`
- `lo-fi-beats.mp3`

**Important**: The names must match exactly (including hyphens and lowercase)!

### Step 3: Place Files in Directory

1. Navigate to your project folder:
   ```
   /Users/owensolano/Desktop/Briefly AI/briefly-ai-landing-page (1) 2/
   ```

2. Go to the `public/background-music/` folder:
   ```
   public/background-music/
   ```

3. Copy or move your 5 MP3 files into this folder

### Step 4: Verify Files Are in Place

Your folder structure should look like this:

```
briefly-ai-landing-page (1) 2/
  └── public/
      └── background-music/
          ├── calm-piano.mp3
          ├── ambient-sounds.mp3
          ├── soft-jazz.mp3
          ├── nature-sounds.mp3
          └── lo-fi-beats.mp3
```

### Step 5: Test It

1. Start your dev server: `npm run dev`
2. Go to the dashboard
3. Upload a document
4. Select a background music option (e.g., "Calm Piano")
5. Generate audio
6. The audio should now include background music!

## Quick Command Line Method

If you prefer using the terminal:

```bash
# Navigate to your project
cd "/Users/owensolano/Desktop/Briefly AI/briefly-ai-landing-page (1) 2"

# Go to the music directory
cd public/background-music

# Download files directly (example using curl - you'll need actual URLs)
# curl -o calm-piano.mp3 "URL_TO_MUSIC_FILE"
```

## File Requirements

- **Format**: MP3 (`.mp3` extension)
- **Duration**: At least 2-3 minutes (will loop if shorter than speech)
- **Size**: Typically 2-5 MB per file
- **Quality**: 128kbps or higher recommended

## Troubleshooting

### Files Not Working?

1. **Check file names**: Must be exact match (case-sensitive)
2. **Check file location**: Must be in `public/background-music/`
3. **Check file format**: Must be MP3
4. **Restart server**: After adding files, restart `npm run dev`

### Music Too Loud/Quiet?

The system automatically sets:
- Speech: 70% volume
- Music: 30% volume

If you need to adjust, edit the volume values in `app/api/audio/generate/route.ts`:
```typescript
"[0:a]volume=0.7[speech]",  // Change 0.7 to adjust speech volume
"[1:a]volume=0.3,aloop=...",  // Change 0.3 to adjust music volume
```

## Quick Start (Minimal Setup)

You can start with just ONE file to test:

1. Download any one music file (e.g., calm piano)
2. Rename it to `calm-piano.mp3`
3. Place it in `public/background-music/`
4. Test with "Calm Piano" option

The other options will work once you add their files!

## Need Help?

- Check console logs when generating audio
- Look for error messages about missing files
- Verify file paths are correct
- Make sure files are actually MP3 format (not renamed other formats)

