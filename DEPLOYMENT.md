# 🚀 Hyperlocal Share - Deployment Guide

This guide provides comprehensive instructions for deploying the Hyperlocal Share application to various platforms.

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] A PostgreSQL database (Neon, Supabase, or self-hosted)
- [ ] A Mapbox account and API token
- [ ] Environment variables configured
- [ ] Domain name (for production)

## 🌍 Environment Variables

Create these environment variables in your deployment platform:

### Required Variables
```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
NEXTAUTH_SECRET="your-super-secure-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_MAPBOX_TOKEN="your_mapbox_token_here"
```

### Optional Variables
```env
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
```

## 🔧 Platform-Specific Deployment

### 1. Vercel (Recommended)

Vercel provides the easiest deployment experience for Next.js applications.

#### Steps:
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all required environment variables
   - Ensure `DATABASE_URL` points to your production database

3. **Database Migration**
   - Vercel will automatically run `npm run postinstall` which includes `prisma generate`
   - For migrations, use the build command: `npm run build:production`

#### Vercel Configuration
The project includes `vercel.json` with optimized settings:
- 30-second function timeout
- Prisma Data Proxy enabled
- Telemetry disabled

### 2. Netlify

#### Steps:
1. **Connect Repository**
   - Link your GitHub repository to Netlify
   - Set build command: `npm run build:production`
   - Set publish directory: `.next`

2. **Environment Variables**
   - Add all environment variables in Netlify dashboard
   - Site Settings → Environment Variables

3. **Build Settings**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build:production"
     publish = ".next"
   
   [build.environment]
     NODE_VERSION = "18"
   ```

### 3. Railway

#### Steps:
1. **Deploy from GitHub**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway link
   railway up
   ```

2. **Environment Variables**
   - Add variables in Railway dashboard
   - Railway automatically provides PostgreSQL if needed

### 4. Docker Deployment

#### Using Docker Compose (Local/VPS)
```bash
# Clone repository
git clone <your-repo>
cd hyperlocal-share

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Build and run
docker-compose up -d
```

#### Using Dockerfile Only
```bash
# Build image
docker build -t hyperlocal-share .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="https://your-domain.com" \
  -e NEXT_PUBLIC_MAPBOX_TOKEN="your-token" \
  hyperlocal-share
```

### 5. AWS/DigitalOcean/VPS

#### Using PM2
```bash
# Install dependencies
npm install
npm run build:production

# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "hyperlocal-share" -- start
pm2 save
pm2 startup
```

## 🗄️ Database Setup

### 1. Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Optional: Seed database
npm run db:seed
```

### 2. Database Providers

#### Neon (Recommended)
- Sign up at [neon.tech](https://neon.tech)
- Create a new project
- Copy connection string to `DATABASE_URL`

#### Supabase
- Sign up at [supabase.com](https://supabase.com)
- Create new project
- Go to Settings → Database
- Copy connection string

#### Self-hosted PostgreSQL
```bash
# Example connection string
DATABASE_URL="postgresql://username:password@localhost:5432/hyperlocal?sslmode=require"
```

## 🔐 Security Checklist

### Environment Variables
- [ ] `NEXTAUTH_SECRET` is a strong, random string (32+ characters)
- [ ] `DATABASE_URL` uses SSL connection (`sslmode=require`)
- [ ] No sensitive data in client-side environment variables
- [ ] All `NEXT_PUBLIC_*` variables are safe for public exposure

### Database Security
- [ ] Database has proper firewall rules
- [ ] Database user has minimal required permissions
- [ ] Regular database backups are configured
- [ ] SSL/TLS encryption is enabled

### Application Security
- [ ] HTTPS is enforced in production
- [ ] Security headers are configured (see `next.config.ts`)
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented (if needed)

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All environment variables are set
- [ ] Database is accessible from deployment platform
- [ ] Mapbox token is valid and has required permissions
- [ ] Domain is configured (if using custom domain)

### Post-deployment
- [ ] Database migrations ran successfully
- [ ] Application starts without errors
- [ ] All API endpoints are working
- [ ] Authentication flow works
- [ ] File uploads work (if using UploadThing)
- [ ] Map functionality works with Mapbox token

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check if DATABASE_URL is correct
npx prisma db pull

# Test database connection
npx prisma studio
```

#### Build Failures
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

#### Prisma Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (CAUTION: This will delete all data)
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

### Performance Optimization

#### Database
- Enable connection pooling
- Add database indexes for frequently queried fields
- Use database read replicas for heavy read workloads

#### Application
- Enable Next.js Image Optimization
- Configure CDN for static assets
- Implement caching strategies
- Monitor bundle size

## 📊 Monitoring

### Recommended Tools
- **Vercel Analytics** (if using Vercel)
- **Sentry** for error tracking
- **LogRocket** for user session recording
- **Uptime Robot** for uptime monitoring

### Health Checks
Create a health check endpoint:
```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check
      - run: npx prisma generate
      - run: npm run build
```

## 📝 Environment-Specific Notes

### Development
```env
DATABASE_URL="file:./dev.db"  # SQLite for local development
NEXTAUTH_URL="http://localhost:3000"
```

### Staging
```env
DATABASE_URL="postgresql://..."  # Staging database
NEXTAUTH_URL="https://staging.yourdomain.com"
```

### Production
```env
DATABASE_URL="postgresql://..."  # Production database
NEXTAUTH_URL="https://yourdomain.com"
```

## 🆘 Support

If you encounter issues during deployment:

1. Check the [Next.js deployment documentation](https://nextjs.org/docs/deployment)
2. Review [Prisma deployment guides](https://www.prisma.io/docs/guides/deployment)
3. Check platform-specific documentation:
   - [Vercel Docs](https://vercel.com/docs)
   - [Netlify Docs](https://docs.netlify.com)
   - [Railway Docs](https://docs.railway.app)

## 🎉 Post-Deployment

After successful deployment:

1. **Test all functionality**
   - User registration/login
   - Item creation and listing
   - Messaging system
   - Map functionality
   - Rating system

2. **Set up monitoring**
   - Configure error tracking
   - Set up uptime monitoring
   - Enable performance monitoring

3. **Configure backups**
   - Database backups
   - File storage backups (if applicable)

4. **Update documentation**
   - Update README with production URL
   - Document any deployment-specific configurations

---

**🎊 Congratulations! Your Hyperlocal Share application is now live and ready to help build stronger communities through local sharing!**