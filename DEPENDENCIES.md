# Dependencies to Install

Run the following command to install all required dependencies:

```bash
npm install
```

## Core Dependencies

### React & Routing
- `react` ^19.1.0
- `react-dom` ^19.1.0
- `react-router-dom` ^6.28.0

### HTTP Client
- `axios` ^1.7.9

### UI Components & Icons
- `lucide-react` ^0.468.0
- `react-hot-toast` ^2.4.1

### Code Display
- `react-syntax-highlighter` ^15.5.0
- `@types/react-syntax-highlighter` ^15.5.11

## Development Dependencies

### Build Tools
- `@vitejs/plugin-react` ^4.5.2
- `vite` ^7.0.0
- `typescript` ~5.8.3

### TypeScript Types
- `@types/react` ^19.1.8
- `@types/react-dom` ^19.1.6

### Styling
- `tailwindcss` ^3.4.0
- `postcss` ^8.4.35
- `autoprefixer` ^10.4.17

### Linting
- `eslint` ^9.30.0
- `@eslint/js` ^9.30.0
- `eslint-plugin-react-hooks` ^5.2.0
- `eslint-plugin-react-refresh` ^0.4.20
- `typescript-eslint` ^8.34.1
- `globals` ^16.2.0

## Configuration Files Created

1. `tailwind.config.js` - Tailwind CSS configuration
2. `postcss.config.js` - PostCSS configuration
3. `src/index.css` - Updated with Tailwind directives
4. `package.json` - Updated with all dependencies

## Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_PROBLEM_SERVICE_URL=http://localhost:5000/api
VITE_SUBMISSION_SERVICE_URL=http://localhost:5001/api
```

## Next Steps

After installing dependencies:

1. Start the development server: `npm run dev`
2. Ensure both backend services are running:
   - Problem Service on port 5000
   - Submission Service on port 5001
3. Open http://localhost:5173 in your browser

## Troubleshooting

If you encounter any issues:

1. **Module not found errors**: Run `npm install` again
2. **TypeScript errors**: The errors will resolve once dependencies are installed
3. **CORS errors**: Ensure backend services are running and configured for CORS
4. **Styling issues**: Verify Tailwind CSS is properly configured 