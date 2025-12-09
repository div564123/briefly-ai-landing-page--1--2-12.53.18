# How to Start Your Dev Server

## Quick Start

```bash
cd "/Users/owensolano/Desktop/Briefly AI/briefly-ai-landing-page (1) 2"
npm run dev
```

## If You Get "Port in Use" or "Lock File" Error

### Option 1: Kill All Next.js Processes (Recommended)

```bash
# Kill all Next.js processes
pkill -f "next dev"

# Clear lock files
cd "/Users/owensolano/Desktop/Briefly AI/briefly-ai-landing-page (1) 2"
rm -rf .next/dev/lock

# Start fresh
npm run dev
```

### Option 2: Kill Specific Port

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Then start
npm run dev
```

### Option 3: Use Different Port

```bash
# Start on port 3002 instead
PORT=3002 npm run dev
```

## What to Expect

After running `npm run dev`, you should see:

```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
- Ready in 2.3s
```

Then open: **http://localhost:3000** (or whatever port it shows)

## Stop the Server

Press `Ctrl + C` in the terminal

## Troubleshooting

- **"Port in use"**: Another server is running - kill it first
- **"Lock file"**: Clear `.next/dev/lock` and try again
- **"Module not found"**: Run `npm install` first

