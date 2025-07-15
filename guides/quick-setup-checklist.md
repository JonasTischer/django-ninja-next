# Quick Setup Checklist ✅

Use this checklist to quickly set up Google OAuth authentication in your Django Ninja + Next.js project.

## 🚀 Prerequisites
- [ ] Google Cloud Console account
- [ ] Django project with django-allauth installed
- [ ] Next.js project running

## 📋 Setup Checklist

### 1. Google Cloud Console (5 minutes)
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create new project or select existing one
- [ ] Enable Google+ API or Google Identity API
- [ ] Create OAuth 2.0 Client ID (Web application)
- [ ] Add authorized JavaScript origins:
  - [ ] `http://localhost:3000`
  - [ ] `http://127.0.0.1:3000`
- [ ] Add authorized redirect URIs:
  - [ ] `http://localhost:3000`
  - [ ] `http://127.0.0.1:3000`
- [ ] Copy Client ID and Client Secret

### 2. Frontend Environment (1 minute)
Create `frontend/.env.local`:
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### 3. Backend Environment (1 minute)
Create `backend/.env.local`:
```bash
GOOGLE_OAUTH2_CLIENT_ID=same_as_frontend_client_id
GOOGLE_OAUTH2_CLIENT_SECRET=your_google_client_secret_here
DEVELOPMENT_MODE=True
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 4. Backend Setup (2 minutes)
- [ ] Run migrations: `python manage.py migrate`
- [ ] Start Django server: `python manage.py runserver`
- [ ] Verify server runs on `http://localhost:8000`

### 5. Frontend Setup (1 minute)
- [ ] Start Next.js server: `npm run dev`
- [ ] Verify app runs on `http://localhost:3000`
- [ ] Check Google Sign-In button appears on login/signup pages

### 6. Test Authentication (2 minutes)
- [ ] Click "Continue with Google" button
- [ ] Verify Google popup appears
- [ ] Complete Google sign-in
- [ ] Check you're redirected to dashboard
- [ ] Verify JWT token is set in browser

## 🐛 Common Issues & Quick Fixes

### Issue: "The given origin is not allowed"
**Fix**: Double-check authorized origins in Google Cloud Console match exactly:
- Use `http://localhost:3000` (not `https://`)
- No trailing slashes
- Wait 5 minutes for changes to propagate

### Issue: Google button shows "Configure Google OAuth"
**Fix**: Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `frontend/.env.local`

### Issue: "Invalid token audience"
**Fix**: Ensure Client ID matches in both frontend and backend `.env.local` files

### Issue: CORS errors
**Fix**: Verify `CORS_ALLOWED_ORIGINS` in Django settings includes your frontend URL

### Issue: Google button not loading
**Fix**:
- Check browser console for errors
- Clear browser cache
- Try incognito mode
- Restart Next.js dev server

## 🔍 Debug Tools

### Browser Console Logs
Look for these messages when testing:
- `🔍 Debug Info:` - Shows configuration
- `✅ Google script loaded` - Confirms Google library loaded
- `🎉 Google credential received` - Shows successful authentication

### Test URLs
- Frontend: `http://localhost:3000/login`
- Backend API: `http://localhost:8000/api/auth/social`
- Django Admin: `http://localhost:8000/admin`

## ✅ Success Indicators

You'll know it's working when:
- [ ] Google Sign-In button loads without errors
- [ ] Clicking button opens Google popup
- [ ] After Google sign-in, you're redirected to dashboard
- [ ] User is created in Django admin
- [ ] JWT token is stored in browser localStorage
- [ ] Subsequent API calls work with authentication

## 🚀 Next Steps

Once basic Google OAuth is working:
1. **Add other providers** (Facebook, GitHub)
2. **Implement logout** functionality
3. **Add user profile** management
4. **Set up production** deployment
5. **Add error handling** for edge cases

## 📞 Need Help?

If you get stuck:
1. Check the detailed [Google OAuth Setup Guide](./google-oauth-setup.md)
2. Look at browser console for error messages
3. Verify all environment variables are set correctly
4. Test with a fresh incognito browser window

**Estimated Total Setup Time**: 10-15 minutes