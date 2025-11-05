# GitHub Push Guide

This guide will help you push your Seismicity Analysis Platform to GitHub.

## Pre-Push Checklist

✅ All files are ready:
- [x] README.md updated with VLab integration
- [x] CONTRIBUTING.md created
- [x] LICENSE created (MIT)
- [x] CHANGELOG.md created
- [x] DEPLOYMENT.md exists
- [x] .gitignore updated (excludes *.bak, build/, node_modules/)
- [x] package.json updated with metadata

✅ Code is clean:
- [x] No console errors
- [x] All components working
- [x] VLab navigation functional
- [x] Simulation working properly
- [x] Tests pass (if any)

## Step 1: Review Files to Commit

Run this command to see what will be committed:

```bash
cd "c:\Users\Sameer Rawat\OneDrive\Desktop\SeismicityApp\seismicity-app"
git status
```

Expected files:
- Modified: frontend/src/*.js, frontend/public/index.html
- New: VLabWrapper.js, pages/, utils/, CONTRIBUTING.md, LICENSE, CHANGELOG.md
- New: VLab assets (bootstrap/, dist/, plugins/, images/)
- New: CSV data files

## Step 2: Stage All Changes

Add all the new and modified files:

```bash
git add .
```

Or selectively add files:

```bash
# Add documentation
git add README.md CONTRIBUTING.md LICENSE CHANGELOG.md DEPLOYMENT.md .gitignore

# Add frontend changes
git add frontend/

# Add VLab template files
git add Vlab/

# Add data files
git add *.csv *.kmz
```

## Step 3: Review Staged Changes

Check what's staged:

```bash
git status
```

Verify:
- No node_modules/ folder
- No *.bak files
- No build/ folder
- No .env files
- No IDE-specific files (.vscode/, .idea/)

## Step 4: Commit Changes

Create a comprehensive commit message:

```bash
git commit -m "v1.0.0: Major release with VLab integration

Features:
- Integrated IIT Roorkee Virtual Labs template framework
- Added complete educational flow (Aim, Theory, Pre-Test, Procedure, Simulation, Post-Test, References)
- Implemented AdminLTE theme with Bootstrap 3
- Enhanced UI with improved sizing and spacing
- Added React Router for multi-page navigation
- Created educational content and quizzes
- Improved component visualization

Technical:
- Added react-router-dom for navigation
- Integrated AdminLTE and Bootstrap assets
- Updated styling for VLab compatibility
- Fixed zoom/scaling issues
- Added comprehensive documentation

Documentation:
- Updated README with VLab information
- Created CONTRIBUTING.md
- Added LICENSE (MIT)
- Created CHANGELOG.md
- Updated package.json metadata"
```

## Step 5: Push to GitHub

### If this is your first push to a new repository:

```bash
# Create repository on GitHub first, then:
git remote add origin https://github.com/sammy-1904/Seismicity-app.git
git branch -M master
git push -u origin master
```

### If you're updating an existing repository:

```bash
git push origin master
```

Or if you're on main branch:

```bash
git push origin main
```

## Step 6: Verify on GitHub

1. Go to https://github.com/sammy-1904/Seismicity-app
2. Check that all files are present:
   - ✅ README.md displays properly
   - ✅ LICENSE is visible
   - ✅ frontend/ folder with all files
   - ✅ Vlab/ folder with template
   - ✅ CSV files are present
3. Check file sizes (CSV files should be uploaded)
4. Verify no sensitive data was committed

## Step 7: Create a Release (Optional)

1. Go to repository → Releases → "Create a new release"
2. Tag: `v1.0.0`
3. Title: `Version 1.0.0 - VLab Integration`
4. Description: Copy from CHANGELOG.md
5. Click "Publish release"

## Step 8: Update Repository Settings

### Description
```
Educational Virtual Lab for analyzing global earthquake data using ISC-GEM catalogue. Interactive simulation with Gutenberg-Richter analysis, depth distribution, and temporal patterns.
```

### Topics/Tags
Add these topics:
- seismology
- earthquake
- data-visualization
- education
- virtual-lab
- react
- isc-gem
- gutenberg-richter
- leaflet
- adminlte

### GitHub Pages (Optional)

To enable GitHub Pages:

1. Go to Settings → Pages
2. Source: Deploy from branch
3. Branch: Select `gh-pages` (after setting up deployment)
4. Click Save

Then update package.json:

```json
"homepage": "https://sammy-1904.github.io/Seismicity-app",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

Install gh-pages and deploy:

```bash
cd frontend
npm install --save-dev gh-pages
npm run deploy
```

## Common Issues & Solutions

### Issue: Files too large

If CSV files are too large (>100MB), use Git LFS:

```bash
git lfs install
git lfs track "*.csv"
git add .gitattributes
git commit -m "Add Git LFS tracking for CSV files"
git push origin master
```

### Issue: Authentication failed

Use a Personal Access Token instead of password:

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `workflow`
4. Use token as password when pushing

### Issue: Merge conflicts

If there are conflicts:

```bash
git pull origin master
# Resolve conflicts in files
git add .
git commit -m "Resolve merge conflicts"
git push origin master
```

### Issue: Need to undo a commit

Before pushing:

```bash
git reset --soft HEAD~1  # Undo commit, keep changes
# or
git reset --hard HEAD~1  # Undo commit, discard changes
```

After pushing (use with caution):

```bash
git revert HEAD  # Create a new commit that undoes the last one
git push origin master
```

## Post-Push Tasks

1. ✅ Verify repository on GitHub
2. ✅ Update repository description and topics
3. ✅ Add collaborators (if any)
4. ✅ Enable issues and discussions
5. ✅ Set up GitHub Pages (optional)
6. ✅ Add repository to your profile README (optional)
7. ✅ Share with others!

## Next Steps

### Set up CI/CD (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      
      - name: Build
        run: |
          cd frontend
          npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/build
```

### Monitoring

Consider adding:
- GitHub Actions for automated testing
- Dependabot for dependency updates
- CodeQL for security scanning

## Support

If you encounter issues:
1. Check GitHub's documentation: https://docs.github.com
2. Search existing issues
3. Create a new issue if needed

---

**Ready to push?** Run the commands in Step 2-5! 🚀

Your repository will be live at: https://github.com/sammy-1904/Seismicity-app
