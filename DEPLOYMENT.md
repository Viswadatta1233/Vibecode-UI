# Frontend Service Deployment Guide

This guide provides detailed step-by-step instructions for deploying the SandCode frontend service to Vercel with automated CI/CD.

## Prerequisites

- GitHub repository with your frontend code
- Vercel account (free tier available)
- Node.js 18+ installed locally (for testing)

## Step 1: Prepare Your Repository

### 1.1 Ensure Your Repository Structure
Make sure your repository has the following structure:
```
sandcode/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions workflow
├── src/                       # React source code
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── vercel.json               # Vercel configuration
├── env.example               # Environment variables template
└── README.md                 # Project documentation
```

### 1.2 Verify Package.json Scripts
Ensure your `package.json` has these scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

## Step 2: Set Up Vercel Account

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### 2.2 Install Vercel for GitHub
1. After signing up, Vercel will prompt you to install the GitHub integration
2. Click "Install" to add Vercel to your GitHub account
3. Select the repositories you want to deploy (or all repositories)

## Step 3: Connect Your Repository to Vercel

### 3.1 Import Project
1. In Vercel dashboard, click "New Project"
2. Click "Import Git Repository"
3. Find and select your repository
4. Click "Import"

### 3.2 Configure Project Settings
1. **Project Name**: Enter a name (e.g., "sandcode-frontend")
2. **Framework Preset**: Select "Vite"
3. **Root Directory**: Leave empty (or enter `sandcode` if your repo has multiple projects)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### 3.3 Set Environment Variables
Click "Environment Variables" and add:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_PROBLEM_SERVICE_URL` | `http://43.204.79.92:5000/api` | Production, Preview, Development |
| `VITE_SUBMISSION_SERVICE_URL` | `http://13.203.239.166:5001/api` | Production, Preview, Development |
| `VITE_DEV_MODE` | `false` | Production |
| `VITE_DEBUG_LOGS` | `false` | Production |

### 3.4 Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be available at `https://your-project-name.vercel.app`

## Step 4: Configure GitHub Secrets for CI/CD

### 4.1 Get Vercel Token
1. Go to Vercel → Settings → Tokens
2. Click "Create Token"
3. Name: "GitHub Actions"
4. Scope: "Full Account"
5. Click "Create"
6. **Copy the token** (you won't see it again)

### 4.2 Get Organization ID
1. Go to Vercel → Settings → General
2. Copy the "Team ID" (this is your organization ID)

### 4.3 Get Project ID
1. Go to your Vercel project → Settings → General
2. Copy the "Project ID"

### 4.4 Add GitHub Secrets
1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `VERCEL_TOKEN` | Your Vercel token from step 4.1 |
| `VERCEL_ORG_ID` | Your organization ID from step 4.2 |
| `VERCEL_PROJECT_ID` | Your project ID from step 4.3 |

## Step 5: Test the CI/CD Pipeline

### 5.1 Make a Test Commit
1. Make a small change to your code
2. Commit and push to the main branch
3. Go to GitHub → Actions tab
4. You should see the workflow running

### 5.2 Monitor the Pipeline
The workflow will:
1. **Test**: Run linting and type checking
2. **Build**: Create production build
3. **Deploy**: Deploy to Vercel

### 5.3 Verify Deployment
1. Check the Actions tab for success/failure
2. Visit your Vercel URL to see the changes
3. Check Vercel dashboard for deployment status

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain
1. Go to Vercel project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `app.sandcode.com`)
4. Follow DNS configuration instructions

### 6.2 Configure DNS
Add these DNS records to your domain provider:
```
Type: CNAME
Name: app (or @)
Value: cname.vercel-dns.com
```

## Step 7: Environment-Specific Configurations

### 7.1 Production Environment
- Set `VITE_DEV_MODE=false`
- Set `VITE_DEBUG_LOGS=false`
- Use production API URLs

### 7.2 Preview Environment
- Automatically created for pull requests
- Uses same environment variables as production
- Perfect for testing before merging

### 7.3 Development Environment
- Use local development URLs
- Enable debug logging
- Set `VITE_DEV_MODE=true`

## Step 8: Monitoring and Maintenance

### 8.1 Vercel Analytics
1. Go to Vercel project → Analytics
2. Enable analytics for performance monitoring
3. View page views, performance metrics

### 8.2 Error Monitoring
1. Consider adding error monitoring (Sentry, LogRocket)
2. Set up alerts for build failures
3. Monitor API response times

### 8.3 Performance Optimization
1. Enable Vercel's Edge Functions if needed
2. Configure caching headers
3. Optimize bundle size

## Troubleshooting

### Common Issues

#### Build Failures
1. **Node version mismatch**: Ensure using Node 18+
2. **Missing dependencies**: Check `package.json`
3. **TypeScript errors**: Run `npm run lint` locally first

#### Environment Variables
1. **Not loading**: Ensure variables start with `VITE_`
2. **Wrong values**: Check Vercel project settings
3. **Missing variables**: Add to all environments

#### CORS Issues
1. **API calls failing**: Check API service CORS settings
2. **WebSocket issues**: Ensure WebSocket URL is correct
3. **Mixed content**: Use HTTPS URLs in production

#### Deployment Issues
1. **Build timeout**: Optimize build process
2. **Memory issues**: Increase build memory in Vercel settings
3. **Cache issues**: Clear Vercel cache

### Debug Commands

```bash
# Test build locally
npm run build

# Test linting
npm run lint

# Check TypeScript
npx tsc --noEmit

# Test environment variables
npm run dev
```

## Security Considerations

### 1. Environment Variables
- Never commit sensitive data to Git
- Use Vercel's environment variable system
- Rotate tokens regularly

### 2. API Security
- Use HTTPS in production
- Implement proper CORS policies
- Add rate limiting to your APIs

### 3. Content Security Policy
- Configure CSP headers in Vercel
- Restrict script sources
- Enable HSTS

## Cost Optimization

### Vercel Pricing
- **Hobby**: Free tier (100GB bandwidth/month)
- **Pro**: $20/month (1TB bandwidth/month)
- **Enterprise**: Custom pricing

### Optimization Tips
1. Enable Vercel's Edge Caching
2. Optimize images and assets
3. Use CDN for static content
4. Monitor bandwidth usage

## Next Steps

1. **Set up monitoring**: Add error tracking and analytics
2. **Optimize performance**: Implement lazy loading and code splitting
3. **Add testing**: Set up unit and integration tests
4. **Security audit**: Review security configurations
5. **Backup strategy**: Set up database and file backups

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Actions**: [docs.github.com/en/actions](https://docs.github.com/en/actions)
- **Vite Documentation**: [vitejs.dev](https://vitejs.dev)
- **React Documentation**: [react.dev](https://react.dev) 