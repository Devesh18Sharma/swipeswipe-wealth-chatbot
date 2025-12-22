# 🔑 How to Add Your OpenAI API Key

## Quick Setup Guide

You have **2 options** to add your OpenAI API key:

---

## Option 1: Direct in Code (Quickest - For Private Repo) ✅

**Best for:** Private repos, quick testing, development

### Step 1: Open `src/App.tsx`

### Step 2: Find line 62 (in `OpenAIExample` function)

### Step 3: Replace this:
```tsx
apiKey={process.env.REACT_APP_OPENAI_API_KEY} // Use env variable!
```

### Step 4: With your actual API key:
```tsx
apiKey="sk-your-actual-openai-api-key-here"
```

**Example:**
```tsx
<WealthChatbot 
  apiKey="sk-proj-abc123xyz..." // Your OpenAI API key
  companyName="SwipeSwipe"
  brandColor="#6366f1"
  onProjectionComplete={handleProjectionComplete}
/>
```

**Also update the Landing Page example** (line 140-143):
```tsx
<WealthChatbot 
  apiKey="sk-your-actual-openai-api-key-here" // Add here too
  companyName="SwipeSwipe"
  brandColor="#6366f1"
/>
```

---

## Option 2: Environment Variable (Better Practice) ✅

**Best for:** More secure, easier to manage

### Step 1: Create `.env` file in project root

Create a file named `.env` in the root directory:
```
/Users/deveshsharma/Desktop/swipeswipe/swipe/swipeswipe-wealth-chatbot/.env
```

### Step 2: Add your API key

**For Vite projects** (which you're using), use `VITE_` prefix:

```env
VITE_OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### Step 3: Update `src/App.tsx`

**Replace line 62:**
```tsx
apiKey={process.env.REACT_APP_OPENAI_API_KEY}
```

**With:**
```tsx
apiKey={import.meta.env.VITE_OPENAI_API_KEY}
```

**Also update line 140-143** (LandingPageExample):
```tsx
<WealthChatbot 
  apiKey={import.meta.env.VITE_OPENAI_API_KEY}
  companyName="SwipeSwipe"
  brandColor="#6366f1"
/>
```

### Step 4: Add `.env` to `.gitignore`

Make sure `.env` is in your `.gitignore` file so you don't commit your API key:

```gitignore
.env
.env.local
.env.*.local
```

### Step 5: Restart dev server

After creating `.env`, restart your dev server:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## 🎯 Recommended: Option 1 for Now

Since you mentioned this is a **private repo**, **Option 1 (direct in code)** is fine for now. You can switch to environment variables later.

---

## 📍 Exact Locations to Update

### Location 1: `src/App.tsx` - Line 62
```tsx
// In OpenAIExample function
<WealthChatbot 
  apiKey="sk-your-key-here"  // ← Add here
  companyName="SwipeSwipe"
  brandColor="#6366f1"
  onProjectionComplete={handleProjectionComplete}
/>
```

### Location 2: `src/App.tsx` - Line 140-143
```tsx
// In LandingPageExample function
<WealthChatbot 
  apiKey="sk-your-key-here"  // ← Add here too
  companyName="SwipeSwipe"
  brandColor="#6366f1"
/>
```

---

## 🔍 How to Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Paste it in the code

**Note:** The key will look like: `sk-proj-abc123xyz789...`

---

## ✅ Quick Test

After adding your API key:

1. Start the dev server: `npm run dev`
2. Click "With OpenAI" button in the nav
3. Complete the projection flow
4. Ask a follow-up question
5. ✅ AI should respond intelligently!

---

## 🛡️ Security Note

**For Private Repo (Current):**
- ✅ Option 1 (direct in code) is fine
- ✅ Just don't make the repo public

**For Public Repo (Future):**
- ❌ Never commit API keys to code
- ✅ Use environment variables
- ✅ Use backend proxy (best practice)

---

## 🆘 Troubleshooting

### Issue: "Invalid API key"
- ✅ Check you copied the full key (starts with `sk-`)
- ✅ Make sure there are no extra spaces
- ✅ Verify the key is active in OpenAI dashboard

### Issue: "Rate limit exceeded"
- ✅ Wait a minute and try again
- ✅ Check your OpenAI account usage limits
- ✅ Consider upgrading your OpenAI plan

### Issue: Environment variable not working
- ✅ Make sure you use `VITE_` prefix (not `REACT_APP_`)
- ✅ Restart dev server after creating `.env`
- ✅ Check `.env` file is in project root

---

**That's it!** Once you add the API key, the chatbot will use OpenAI for intelligent responses. 🚀
