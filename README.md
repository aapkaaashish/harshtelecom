# Mobile Repair Parts & Accessories App

A Next.js application for managing mobile repair parts requests between technicians and administrators.

## Login Credentials

### Admin Access
- Email: `admin@repairbros.in`
- Password: `adminpassword`

### Technician Access
- Email: `yash@repairbros.in`
- Password: `userpassword`

## Features

- 🔐 **Authentication** - Secure login for admins and technicians
- 📱 **Parts Requests** - Technicians can request repair parts
- 👨‍💼 **Admin Dashboard** - Approve/reject requests with custom notes
- 🔔 **Notifications** - Sound and visual alerts for new requests
- 💾 **Data Persistence** - Requests saved across sessions

## Deployment Configuration

### Environment Variables (Required for Production)

For Kilo deployments, set these environment variables in your deployment settings:

```bash
NEXTAUTH_URL=https://early-meadow-6216.d.kiloapps.io
NEXTAUTH_SECRET=your-secure-random-secret-here
```

### Setting Environment Variables in Kilo

1. Go to your Kilo project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - `NEXTAUTH_URL`: Your deployed domain URL
   - `NEXTAUTH_SECRET`: A secure random string (generate one at https://generate-secret.vercel.app/32)

### Troubleshooting

If login doesn't work on deployed version:
1. Check `/debug` page to verify environment variables are set
2. Ensure `NEXTAUTH_URL` matches your exact deployed domain
3. Make sure `NEXTAUTH_SECRET` is a secure random string
4. Clear browser cache and try again

## Local Development

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Type checking
bun run typecheck

# Linting
bun run lint
```

## Architecture

- **Frontend**: Next.js 16 with TypeScript
- **Authentication**: NextAuth.js with JWT
- **Styling**: Tailwind CSS 4
- **State Management**: React Context + localStorage
- **Deployment**: Kilo (optimized for cloud deployment)