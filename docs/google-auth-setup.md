# Google Authentication Setup for Numoraq

This guide explains how to set up Google OAuth authentication in Supabase for the Numoraq application.

## Prerequisites

- Supabase project set up
- Google Cloud Console account
- Basic understanding of OAuth 2.0

## Step 1: Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Name your OAuth client (e.g., "Numoraq Auth")

5. Configure authorized redirect URIs:
   - Add your Supabase callback URL:
     ```
     https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
     ```
   - Replace `YOUR_SUPABASE_PROJECT_REF` with your actual project reference

6. Save the credentials and copy:
   - Client ID
   - Client Secret

## Step 2: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" in the list and click to configure
4. Enable Google authentication
5. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
6. Save the configuration

## Step 3: Update Redirect URLs (Optional)

If you want to customize the redirect behavior:

1. In Google Cloud Console, go to your OAuth client
2. Update "Authorized redirect URIs" to include:
   ```
   https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
   https://yourdomain.com/auth (for production)
   http://localhost:3000/auth (for development)
   ```

## Step 4: Test the Integration

1. Start your Numoraq application
2. Go to the authentication page
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth consent screen
5. After approval, you should be redirected back to your application

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**:
   - Verify the redirect URI in Google Cloud Console exactly matches your Supabase callback URL
   - Check for trailing slashes or typos

2. **"invalid_client" error**:
   - Verify your Client ID and Client Secret are correct
   - Make sure the Google+ API is enabled

3. **User not redirected after authentication**:
   - Check that your application handles the auth state change properly
   - Verify the redirect URL in your AuthContext matches your domain

### Environment Variables

For production, you may want to set up environment variables:

```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Security Considerations

1. **Domain Restrictions**: Only add necessary domains to authorized redirect URIs
2. **API Quotas**: Monitor your Google API usage to avoid unexpected charges
3. **Scopes**: Only request necessary OAuth scopes (email, profile)
4. **Environment Variables**: Never commit OAuth secrets to version control

## Testing Checklist

- [ ] Google OAuth app created and configured
- [ ] Supabase Google provider enabled with correct credentials
- [ ] Redirect URIs properly configured
- [ ] Google sign-in button appears in auth forms
- [ ] Users can successfully sign in with Google
- [ ] Users are redirected to dashboard after authentication
- [ ] User profile information is properly stored

## Production Setup

For production deployment:

1. Update Google Cloud Console with your production domain
2. Set up proper environment variables
3. Configure CORS settings in Supabase if needed
4. Test the flow thoroughly in a production-like environment

## Support

If you encounter issues with Google authentication setup, check:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- Supabase project logs for detailed error messages

---

**Note**: This setup enables Google authentication for both sign-in and sign-up flows. Users who authenticate with Google will have their accounts automatically created in your Supabase auth system. 