# Mind's Eye View Website - Home Lab Deployment Guide

This guide will help you deploy the Mind's Eye View website to your home lab using Portainer, with automatic updates from GitHub.

## 🏗️ Architecture Overview

```
GitHub Repository
    ↓ (push to main)
GitHub Actions (builds Docker image)
    ↓ (pushes to GHCR)
GitHub Container Registry
    ↓ (webhook trigger)
Portainer (pulls new image)
    ↓ (recreates container)
Your Home Lab Server
    ↓ (exposed via)
Cloudflare Tunnel
    ↓ (public access)
mindseyeview.net
```

## 📋 Prerequisites

- [ ] Home lab server with Docker installed
- [ ] Portainer installed and running
- [ ] Domain name (mindseyeview.net) configured in Cloudflare
- [ ] GitHub account
- [ ] PostgreSQL database (can run in Docker)

## 🚀 Step-by-Step Deployment

### Step 1: Push to GitHub

1. **Initialize Git repository** (if not already done):
   ```bash
   cd /Users/skylarmatthews/Documents/Projects/MindsEyeView_Website
   git init
   git add .
   git commit -m "Initial commit: Mind's Eye View website"
   ```

2. **Create GitHub repository**:
   - Go to https://github.com/new
   - Name: `MindsEyeView_Website` (or your preferred name)
   - Make it **Private** (recommended for production sites)
   - Don't initialize with README (we already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/MindsEyeView_Website.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Configure GitHub Container Registry

1. **Enable GitHub Actions** in your repository:
   - Go to Settings → Actions → General
   - Allow all actions and reusable workflows

2. **The workflow is already created** at `.github/workflows/deploy.yml`
   - It will automatically build and push Docker images on every push to `main`

### Step 3: Set Up PostgreSQL Database

**Option A: Run PostgreSQL in Portainer**

1. In Portainer, create a new stack called `mindseyeview-db`
2. Use this docker-compose:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: mindseyeview-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: mindseyeview
      POSTGRES_USER: mindseyeview
      POSTGRES_PASSWORD: CHANGE_THIS_PASSWORD
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - mindseyeview-network

volumes:
  postgres_data:

networks:
  mindseyeview-network:
    external: true
```

3. Create the network first:
   ```bash
   docker network create mindseyeview-network
   ```

4. Deploy the stack

**Option B: Use existing PostgreSQL server**
- Just note the connection details for the next step

### Step 4: Create Portainer Stack

1. **In Portainer**, go to Stacks → Add Stack
2. **Name**: `mindseyeview-website`
3. **Build method**: Repository
4. **Repository URL**: `https://github.com/YOUR_USERNAME/MindsEyeView_Website`
5. **Repository reference**: `refs/heads/main`
6. **Compose path**: `docker-compose.yml`

**OR use Web editor with this compose file**:

```yaml
version: '3.8'

services:
  app:
    image: ghcr.io/YOUR_USERNAME/mindseyeview_website:latest
    container_name: mindseyeview-web
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://mindseyeview:CHANGE_THIS_PASSWORD@mindseyeview-db:5432/mindseyeview
      NEXTAUTH_URL: https://mindseyeview.net
      NEXTAUTH_SECRET: GENERATE_A_RANDOM_SECRET_HERE
      NEXT_PUBLIC_FACEBOOK_URL: https://www.facebook.com/profile.php?id=100066853654284
    volumes:
      - ./uploads:/app/public/uploads
    networks:
      - mindseyeview-network
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    container_name: mindseyeview-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: mindseyeview
      POSTGRES_USER: mindseyeview
      POSTGRES_PASSWORD: CHANGE_THIS_PASSWORD
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - mindseyeview-network

volumes:
  postgres_data:

networks:
  mindseyeview-network:
    driver: bridge
```

### Step 5: Set Environment Variables

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

**Update the environment variables** in Portainer:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_URL`: https://mindseyeview.net (your actual domain)
- `NEXTAUTH_SECRET`: The generated secret from above
- `NEXT_PUBLIC_FACEBOOK_URL`: Your Facebook page URL

### Step 6: Set Up Portainer Webhook

1. **In Portainer**, go to your stack → Webhooks
2. **Create webhook** for the service
3. **Copy the webhook URL** (looks like: `https://portainer.yourdomain.com/api/webhooks/xxx`)

4. **Add to GitHub Secrets**:
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `PORTAINER_WEBHOOK_URL`
   - Value: Your webhook URL from Portainer

### Step 7: Initialize Database

**After first deployment**, run migrations:

1. **Access the container**:
   ```bash
   docker exec -it mindseyeview-web sh
   ```

2. **Run Prisma migrations**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

3. **Create admin user**:
   ```bash
   npm run create-admin
   ```

### Step 8: Set Up Cloudflare Tunnel

1. **Install Cloudflared** on your home lab server:
   ```bash
   # Download cloudflared
   curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared.deb
   ```

2. **Authenticate with Cloudflare**:
   ```bash
   cloudflared tunnel login
   ```

3. **Create tunnel**:
   ```bash
   cloudflared tunnel create mindseyeview
   ```

4. **Create tunnel configuration** (`~/.cloudflared/config.yml`):
   ```yaml
   tunnel: YOUR_TUNNEL_ID
   credentials-file: /root/.cloudflared/YOUR_TUNNEL_ID.json

   ingress:
     - hostname: mindseyeview.net
       service: http://localhost:3000
     - hostname: www.mindseyeview.net
       service: http://localhost:3000
     - service: http_status:404
   ```

5. **Route traffic**:
   ```bash
   cloudflared tunnel route dns mindseyeview mindseyeview.net
   cloudflared tunnel route dns mindseyeview www.mindseyeview.net
   ```

6. **Run tunnel as service**:
   ```bash
   sudo cloudflared service install
   sudo systemctl start cloudflared
   sudo systemctl enable cloudflared
   ```

### Step 9: Configure Cloudflare DNS

1. **Go to Cloudflare Dashboard** → Your domain
2. **DNS settings** should now show:
   - `mindseyeview.net` → CNAME → `YOUR_TUNNEL_ID.cfargotunnel.com`
   - `www.mindseyeview.net` → CNAME → `YOUR_TUNNEL_ID.cfargotunnel.com`
3. **SSL/TLS** → Set to "Full" or "Full (strict)"

## 🔄 Auto-Deployment Workflow

Once set up, the workflow is:

1. **Make changes** to your website locally
2. **Commit changes**:
   ```bash
   git add .
   git commit -m "Update website content"
   git push
   ```
3. **GitHub Actions automatically**:
   - Builds new Docker image
   - Pushes to GitHub Container Registry
   - Triggers Portainer webhook
4. **Portainer automatically**:
   - Pulls new image
   - Recreates container
   - Website updates live!

**Total time**: ~2-3 minutes from push to live

## 🛠️ Management Commands

### Update website manually in Portainer:
```bash
# In Portainer, click the stack and click "Pull and redeploy"
```

### View logs:
```bash
docker logs mindseyeview-web -f
```

### Access database:
```bash
docker exec -it mindseyeview-db psql -U mindseyeview -d mindseyeview
```

### Backup database:
```bash
docker exec mindseyeview-db pg_dump -U mindseyeview mindseyeview > backup.sql
```

### Restore database:
```bash
cat backup.sql | docker exec -i mindseyeview-db psql -U mindseyeview -d mindseyeview
```

## 📊 Monitoring

### Check if services are running:
```bash
docker ps | grep mindseyeview
```

### Check Cloudflare tunnel status:
```bash
sudo systemctl status cloudflared
```

### Test the website:
```bash
curl -I https://mindseyeview.net
```

## 🔒 Security Checklist

- [ ] Change default PostgreSQL password
- [ ] Generate strong NEXTAUTH_SECRET
- [ ] Set up Cloudflare firewall rules
- [ ] Enable Cloudflare rate limiting
- [ ] Set up SSL/TLS (automatic with Cloudflare)
- [ ] Configure fail2ban on home lab server
- [ ] Set up automated database backups
- [ ] Use GitHub private repository
- [ ] Rotate admin passwords regularly

## 🐛 Troubleshooting

### Website not accessible:
1. Check container is running: `docker ps`
2. Check logs: `docker logs mindseyeview-web`
3. Check Cloudflare tunnel: `sudo systemctl status cloudflared`
4. Check DNS records in Cloudflare

### Database connection errors:
1. Verify DATABASE_URL is correct
2. Check PostgreSQL is running: `docker ps | grep postgres`
3. Test connection: `docker exec mindseyeview-db psql -U mindseyeview -d mindseyeview`

### Auto-deployment not working:
1. Check GitHub Actions: Repository → Actions tab
2. Verify webhook URL in GitHub secrets
3. Check Portainer webhook is enabled
4. View Portainer logs

### Image not updating:
1. GitHub Actions may have failed - check Actions tab
2. Portainer may not have pulled latest image - manual pull
3. Check webhook was triggered

## 📝 Useful Links

- **Website**: https://mindseyeview.net
- **Admin Panel**: https://mindseyeview.net/admin/login
- **Portainer**: https://portainer.yourdomain.com
- **GitHub Repo**: https://github.com/YOUR_USERNAME/MindsEyeView_Website
- **Cloudflare Dashboard**: https://dash.cloudflare.com

## 🎯 Next Steps After Deployment

1. **Test the website** thoroughly
2. **Create first admin user** via `npm run create-admin`
3. **Add initial content** (events, photos, videos)
4. **Test contact form** (should receive emails)
5. **Test newsletter signup**
6. **Share website** with the band!

---

**You're all set!** 🎸 The website will now auto-deploy whenever you push to GitHub.
