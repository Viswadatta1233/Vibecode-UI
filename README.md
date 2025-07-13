# SandCode Frontend Service

A React-based frontend for the SandCode online coding platform, built with Vite, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Modern React 19** with TypeScript
- 🎨 **Tailwind CSS** for styling
- 📝 **Monaco Editor** for code editing
- 🔐 **Authentication** system
- 📊 **Real-time** submission tracking
- 🎯 **Problem management** interface
- 📱 **Responsive** design

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sandcode
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## CI/CD & Deployment

### GitHub Actions CI/CD

The project includes automated CI/CD pipeline that:

1. **Tests** - Runs linting and type checking
2. **Builds** - Creates production build
3. **Deploys** - Automatically deploys to Vercel on main branch

### Vercel Deployment

#### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Install Vercel for GitHub

#### Step 2: Connect Repository
1. In Vercel dashboard, click "New Project"
2. Import your GitHub repository
3. Select the `sandcode` directory

#### Step 3: Configure Build Settings
1. **Framework Preset**: Vite
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install`

#### Step 4: Set Environment Variables
In Vercel project settings, add these environment variables:

```
VITE_PROBLEM_SERVICE_URL=http://43.204.79.92:5000/api
VITE_SUBMISSION_SERVICE_URL=http://13.203.239.166:5001/api
```

#### Step 5: Configure GitHub Secrets
Add these secrets to your GitHub repository:

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add the following secrets:

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

**To get these values:**

1. **VERCEL_TOKEN**:
   - Go to Vercel → Settings → Tokens
   - Create new token with "Full Account" scope

2. **VERCEL_ORG_ID**:
   - Go to Vercel → Settings → General
   - Copy "Team ID" (this is your org ID)

3. **VERCEL_PROJECT_ID**:
   - Go to your Vercel project → Settings → General
   - Copy "Project ID"

#### Step 6: Deploy
1. Push to main branch
2. GitHub Actions will automatically:
   - Run tests
   - Build the application
   - Deploy to Vercel

### Manual Deployment

If you prefer manual deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_PROBLEM_SERVICE_URL` | Problem service API URL | `http://43.204.79.92:5000/api` |
| `VITE_SUBMISSION_SERVICE_URL` | Submission service API URL | `http://13.203.239.166:5001/api` |
| `VITE_DEV_MODE` | Development mode flag | `true` |
| `VITE_DEBUG_LOGS` | Enable debug logging | `true` |
| `VITE_WS_URL` | WebSocket URL | `ws://13.203.239.166:5001` |

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   └── problems/       # Problem-related components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── services/           # API services
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run lint && npm run build`
5. Submit a pull request

## License

This project is licensed under the MIT License.
