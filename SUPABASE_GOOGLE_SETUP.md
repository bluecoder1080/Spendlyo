# Enabling Google OAuth in Supabase

## Steps to Enable Google Provider:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **Kharcha** (kuqljlyywdtztylqjtyn)
3. Navigate to **Authentication** → **Providers** in the left sidebar
4. Find **Google** in the list of providers
5. Click on **Google** to expand the configuration
6. Toggle **Enable Google provider** to ON
7. You'll need to configure Google OAuth credentials:

### Google Cloud Console Setup:

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if prompted
6. Set Application type to **Web application**
7. Add Authorized redirect URIs:
   ```
   https://kuqljlyywdtztylqjtyn.supabase.co/auth/v1/callback
   ```
8. Copy the **Client ID** and **Client Secret**

### Back to Supabase:

1. Paste the **Client ID** in the Supabase Google provider settings
2. Paste the **Client Secret** 
3. Click **Save**

## Alternative: Use Email/Password (Temporary)

If you want to test quickly without Google OAuth:

1. In Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider
3. Update the login page to use email/password instead of Google

## After Enabling:

Refresh your app at http://localhost:3000 and click "Login" again. It should now redirect to Google Sign-in.
