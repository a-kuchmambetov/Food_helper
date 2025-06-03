# Authentication Configuration for Cloudflare Proxy

This document explains the authentication setup for the Food Helper application with Cloudflare proxy configuration.

## Configuration Overview

The application now supports two environments:

- **Development**: Local HTTPS setup with self-signed certificates
- **Production**: Cloudflare proxy with your custom domains

## Environment Files

### Server Environment Files

#### Production (`.env`)

- `NODE_ENV=production`
- `CLIENT_URL=https://food_helper.kuchmambetov.dev`
- `SERVER_URL=https://api_food_helper.kuchmambetov.dev`
- `CF_PROXY=true` (enables Cloudflare-specific configurations)

#### Development (`.env.development`)

- `NODE_ENV=development`
- `CLIENT_URL=https://localhost:5173`
- `SERVER_URL=https://localhost:3000`
- `CF_PROXY=false`

### Client Environment Files

#### Production (`.env`)

```
VITE_API_URL=https://api_food_helper.kuchmambetov.dev
```

#### Development (`.env.development`)

```
VITE_API_URL=https://localhost:3000
```

## Key Authentication Features

### 1. Cross-Domain Cookie Authentication

- Cookies are configured with `domain: ".kuchmambetov.dev"` for production
- `sameSite: "none"` for cross-domain requests in production
- `secure: true` for HTTPS-only cookies in production

### 2. CORS Configuration

- Production domains: `food_helper.kuchmambetov.dev` and `api_food_helper.kuchmambetov.dev`
- Development: `localhost:5173` and `localhost:3000`
- `credentials: true` to allow cookies in cross-origin requests

### 3. Cloudflare Proxy Compatibility

- IP address extraction using `cf-connecting-ip` header
- Trust proxy configuration set to `true`
- Cloudflare-compatible security headers

### 4. Token Management

- JWT access tokens stored in localStorage
- HTTP-only refresh tokens stored in secure cookies
- Automatic token refresh on 401 responses
- Proper cookie clearing on logout

## Switching Between Environments

### For Development

1. Copy `.env.development` to `.env` in the server directory
2. Copy `.env.development` to `.env` in the client directory
3. Run the development servers

### For Production

1. Use the current `.env` files (already configured for production)
2. Build and deploy the applications

## Running the Application

### Development Mode

```powershell
# Server
cd server
npm run dev

# Client
cd client
npm run dev
```

### Production Mode

```powershell
# Server
cd server
npm start

# Client
cd client
npm run build
npm run preview
```

## Security Features

1. **Rate Limiting**: Different limits for auth, search, and general endpoints
2. **Request Validation**: Comprehensive input validation
3. **Security Headers**: Helmet.js with Cloudflare-compatible settings
4. **Session Management**: Active session tracking and cleanup
5. **IP-based Security**: Cloudflare IP detection and logging

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the client domain is listed in CORS configuration
2. **Cookie Issues**: Check that `credentials: "include"` is set on all requests
3. **IP Detection**: Verify Cloudflare headers are being passed through
4. **Certificate Issues**: Ensure SSL certificates are valid and accessible

### Debug Endpoints

- `GET /health` - Health check
- `GET /auth/verify-token` - Token validation
- `GET /auth/sessions` - User session info (authenticated)

## Security Considerations

1. **Environment Variables**: Never commit real secrets to version control
2. **Cookie Settings**: Different settings for development vs production
3. **HTTPS**: Required for secure cookie transmission
4. **Token Expiry**: Short-lived access tokens (15m) with longer refresh tokens (7d)
5. **Session Cleanup**: Automatic cleanup of expired tokens and sessions

## Domain Configuration

Ensure your Cloudflare DNS is configured as follows:

- `food_helper.kuchmambetov.dev` → Client application
- `api_food_helper.kuchmambetov.dev` → Server application
- Both should be proxied through Cloudflare (orange cloud)
