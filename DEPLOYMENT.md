# Deployment Guide

## Quick Deploy Options

### 1. GitHub Pages

```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Add homepage to package.json:
"homepage": "https://yourusername.github.io/seismicity-app"

# Deploy
npm run deploy
```

### 2. Netlify

**Option A: Drag & Drop**
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `build` folder

**Option B: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### 3. Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend folder
cd frontend
vercel
```

### 4. AWS S3 + CloudFront

```bash
# Build
npm run build

# Install AWS CLI and configure
aws configure

# Create S3 bucket
aws s3 mb s3://seismicity-app

# Upload build folder
aws s3 sync build/ s3://seismicity-app --acl public-read

# Enable static website hosting
aws s3 website s3://seismicity-app --index-document index.html
```

### 5. Azure Static Web Apps

```bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Build
npm run build

# Deploy
swa deploy ./build
```

## Environment Configuration

No environment variables needed! The app is completely self-contained.

## Build Configuration

The app uses Create React App defaults:
- Output directory: `build/`
- Build command: `npm run build`
- Assets are automatically optimized and minified

## Performance Tips

### 1. Enable Compression
Most hosting providers enable gzip/brotli automatically. If not:

**Netlify** (netlify.toml):
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Encoding = "gzip"
```

**Nginx**:
```nginx
gzip on;
gzip_types text/css application/javascript text/csv;
```

### 2. Caching Strategy
Set cache headers for static assets:

**Netlify** (netlify.toml):
```toml
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.csv"
  [headers.values]
    Cache-Control = "public, max-age=86400"
```

### 3. CSV File Optimization
The CSV files are large (~7-10 MB). Consider:
- Enabling compression (reduces size by ~80%)
- Using CDN for faster delivery
- Pre-loading on landing page

## Post-Deployment Checklist

- [ ] CSV files load correctly
- [ ] Map displays earthquakes
- [ ] Filtering works as expected
- [ ] All tabs/visualizations render
- [ ] Charts display correctly
- [ ] Responsive design works on mobile
- [ ] Browser console has no errors

## Troubleshooting

### CSV Not Loading
- Check browser console for errors
- Verify CSV files are in the public folder
- Check CORS headers (shouldn't be an issue with same-origin)

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Large Bundle Size
The CSV files are the main size contributor. This is expected and necessary for the offline-first design.

## Custom Domain

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS records as shown

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records

### GitHub Pages
1. Add CNAME file to public folder
2. Configure DNS with your provider
3. Enable HTTPS in repository settings

## Monitoring

Consider adding:
- Google Analytics
- Sentry for error tracking
- Performance monitoring (Lighthouse CI)

## Security

Since this is a static site with no backend:
- No authentication needed
- No API keys to secure
- No server-side vulnerabilities
- Set appropriate security headers

**Netlify** (_headers):
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Cost Estimates

- **Netlify Free Tier**: 100 GB bandwidth/month (sufficient for most use cases)
- **Vercel Free Tier**: Unlimited personal projects
- **GitHub Pages**: Free for public repositories
- **AWS S3**: ~$0.50-2/month for storage + CloudFront costs
- **Azure Static Web Apps**: Free tier available

## Need Help?

- Create React App Docs: https://create-react-app.dev/docs/deployment
- Netlify Docs: https://docs.netlify.com
- Vercel Docs: https://vercel.com/docs
