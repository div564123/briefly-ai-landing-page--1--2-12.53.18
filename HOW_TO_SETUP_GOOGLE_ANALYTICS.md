# 📊 How to Set Up Google Analytics for Your Website

This guide will help you track how many people visit your website using Google Analytics (free).

## 🎯 What You'll Get

- **Number of visitors** per day/week/month
- **Which pages** are most popular
- **Where visitors come from** (Google, social media, etc.)
- **How long** people stay on your site
- **What devices** they use (mobile, desktop, tablet)

---

## 📝 Step 1: Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **"Start measuring"** or **"Get started"**
3. Sign in with your Google account (or create one)

---

## 📝 Step 2: Create a Property

1. Click **"Create Property"**
2. Fill in:
   - **Property name**: `Capso AI` (or your site name)
   - **Reporting time zone**: Choose your timezone
   - **Currency**: Choose your currency
3. Click **"Next"**

---

## 📝 Step 3: Set Up Data Stream

1. Select **"Web"** as the platform
2. Enter your website URL: `https://capsoai.com`
3. Enter a stream name: `Capso AI Website`
4. Click **"Create stream"**

---

## 📝 Step 4: Get Your Measurement ID

After creating the stream, you'll see a page with your **Measurement ID**.

It looks like: `G-XXXXXXXXXX` (starts with "G-")

**Copy this ID** - you'll need it in the next step!

---

## 📝 Step 5: Add the ID to Your Website

### Option A: Add to Netlify (Recommended for Production)

1. Go to **Netlify Dashboard** → Your site → **Site settings**
2. Go to **Build & deploy** → **Environment variables**
3. Click **"Add variable"**
4. Add:
   - **Key**: `NEXT_PUBLIC_GA_ID`
   - **Value**: Your Measurement ID (e.g., `G-XXXXXXXXXX`)
   - **Scopes**: All scopes
   - **Deploy contexts**: All deploy contexts
5. Click **"Save"**
6. **Redeploy your site** (or wait for the next automatic deploy)

### Option B: Add to Local Development (.env.local)

1. Open `.env.local` in your project root
2. Add this line:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
   (Replace `G-XXXXXXXXXX` with your actual Measurement ID)
3. Save the file
4. Restart your dev server (`npm run dev`)

---

## ✅ Step 6: Verify It's Working

1. Visit your website: `https://capsoai.com`
2. Go to [Google Analytics](https://analytics.google.com/)
3. Click **"Reports"** → **"Realtime"**
4. You should see **"1 user"** if you're currently on the site!

**Note**: It may take a few minutes for data to appear.

---

## 📊 How to View Your Analytics

### Real-time Data (See visitors right now)
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **"Reports"** → **"Realtime"**
3. See who's on your site right now!

### Daily/Weekly/Monthly Reports
1. Go to **"Reports"** → **"Overview"**
2. See:
   - **Users**: Total visitors
   - **Sessions**: Total visits
   - **Page views**: Total pages viewed
   - **Average session duration**: How long people stay

### Most Popular Pages
1. Go to **"Reports"** → **"Engagement"** → **"Pages and screens"**
2. See which pages get the most traffic

### Where Visitors Come From
1. Go to **"Reports"** → **"Acquisition"** → **"Traffic acquisition"**
2. See:
   - **Organic Search**: Google searches
   - **Direct**: Typed URL directly
   - **Social**: Social media links
   - **Referral**: Links from other websites

---

## 🔧 Troubleshooting

### No data showing up?

1. **Wait 24-48 hours**: Google Analytics can take time to show data
2. **Check the Measurement ID**: Make sure it's correct in Netlify
3. **Check your browser**: Try visiting your site in an incognito/private window
4. **Check Real-time**: Go to "Realtime" in Google Analytics to see if it's working immediately

### Still not working?

1. **Verify the environment variable**:
   - In Netlify: Check `NEXT_PUBLIC_GA_ID` is set correctly
   - Make sure it starts with `G-`
   - No extra spaces or quotes

2. **Check browser console**:
   - Press `F12` → Go to **Console** tab
   - Look for any errors related to Google Analytics

3. **Redeploy your site**:
   - After adding the environment variable, trigger a new deploy in Netlify

---

## 📱 Mobile App

You can also view your analytics on your phone:
- **iOS**: Download "Google Analytics" app
- **Android**: Download "Google Analytics" app

---

## 🎉 You're Done!

Now you can track:
- ✅ How many people visit your site
- ✅ Which pages are popular
- ✅ Where visitors come from
- ✅ How long they stay
- ✅ What devices they use

**Check your analytics regularly** to understand your audience better!

---

## 💡 Pro Tips

1. **Check daily** for the first week to see if it's working
2. **Set up goals** in Google Analytics to track specific actions (like sign-ups)
3. **Use the mobile app** to check stats on the go
4. **Share access** with team members if needed (Settings → Access management)

---

## 📚 More Resources

- [Google Analytics Help Center](https://support.google.com/analytics)
- [Google Analytics Academy](https://analytics.google.com/analytics/academy/) (Free courses)



