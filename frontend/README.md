# Mutual Funds Frontend

This is the frontend application for the Mutual Funds comparison tool.

## Environment Variables

The application uses environment variables for configuration. These are loaded by Vite during build time.

### Required Environment Variables

- `VITE_API_BASE_URL`: The base URL for the backend API

### Setting Up Environment Variables

For local development:
1. Copy `.env.example` to `.env.local`
2. Update the values in `.env.local`

For production:
- Set the environment variables in your CI/CD platform (e.g., Render, Vercel, Netlify)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Deployment

### Deploying on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Environment: Node
   - Build Command: `cd frontend && npm install && npm run build`
   - Start Command: `cd frontend && npm run preview -- --host 0.0.0.0 --port $PORT`
4. Add the following environment variables:
   - `VITE_API_BASE_URL`: Your backend API URL (e.g., https://your-backend.onrender.com/api/v1)