# Vercel Deployment Guide for AgriMitra

## Environment Variables Setup

To deploy AgriMitra on Vercel, you need to configure the following environment variables in your Vercel dashboard:

### Required Environment Variables

1. **VITE_OPENWEATHER_API_KEY** (Required)
   - Get your API key from: https://openweathermap.org/api
   - This is essential for weather data functionality

### Optional Environment Variables

2. **VITE_AGROMONITORING_API_KEY** (Optional)
   - Get your API key from: https://agromonitoring.com/
   - Enhances soil data capabilities

3. **VITE_AMBEE_API_KEY** (Optional)
   - Get your API key from: https://www.getambee.com/
   - Provides additional soil analysis features

4. **VITE_OPENCAGE_API_KEY** (Optional)
   - Get your API key from: https://opencagedata.com/
   - Improves location services

## How to Set Environment Variables in Vercel

### Method 1: Vercel Dashboard
1. Go to your project in the Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: `VITE_OPENWEATHER_API_KEY`
   - **Value**: Your actual API key
   - **Environment**: Select `Production`, `Preview`, and `Development`
4. Click **Save**
5. Repeat for other optional variables as needed

### Method 2: Vercel CLI
```bash
vercel env add VITE_OPENWEATHER_API_KEY
# Enter your API key when prompted
# Select environments: Production, Preview, Development
```

### Method 3: During Deployment
If you're deploying for the first time, Vercel will prompt you to add environment variables if they're detected in your code.

## Important Notes

- **Never commit API keys to your repository**
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Environment variables in Vercel are encrypted and secure
- You can update environment variables anytime without redeploying
- After adding/updating environment variables, redeploy your application

## Deployment Commands

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to Vercel
vercel

# Or deploy with specific environment
vercel --prod
```

## Troubleshooting

### Error: "Environment Variable references Secret which does not exist"
This error occurs when the `vercel.json` file references secrets that haven't been created. The fix is to:
1. Remove the `env` section from `vercel.json` (already done)
2. Set environment variables through the Vercel dashboard instead

### Missing Weather Data
If weather features aren't working:
1. Verify `VITE_OPENWEATHER_API_KEY` is set correctly
2. Check that your OpenWeatherMap API key is valid and active
3. Ensure the API key has the necessary permissions

## Local Development

For local development, create a `.env` file in the project root:

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
VITE_AGROMONITORING_API_KEY=your_agromonitoring_api_key_here
VITE_AMBEE_API_KEY=your_ambee_api_key_here
VITE_OPENCAGE_API_KEY=your_opencage_api_key_here
```

The application will work with just the OpenWeatherMap API key, but additional features require the optional API keys.