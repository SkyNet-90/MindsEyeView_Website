# Portainer Deployment Guide (Git-Sync Method)

This deployment method mirrors your resume website setup with automatic git-sync deployment.

## 🎯 Features

- ✅ **Auto-deployment**: Pulls from GitHub every 5 minutes
- ✅ **No webhooks needed**: Works entirely on your internal network
- ✅ **Built-in Cloudflare Tunnel**: No need for separate tunnel setup
- ✅ **File Browser**: Browse uploads and git repo via web UI (port 8083)
- ✅ **Health checks**: Automatic monitoring and restart
- ✅ **Postgres database**: Persistent data storage

## 📋 Prerequisites

1. Portainer running on your home lab
2. Cloudflare Tunnel token
3. Docker with access to Docker socket
4. **For private repos only**: GitHub Personal Access Token (see below)

## 🔐 Private Repository Setup (Optional)

If your GitHub repository is **private**, you'll need a Personal Access Token:

### Create GitHub Token:

1. Go to: https://github.com/settings/tokens
2. Click: **Generate new token** → **Generate new token (classic)**
3. Name it: `Portainer Git Sync`
4. Set expiration: **No expiration** (or your preference)
5. Select scope: ✅ **repo** (Full control of private repositories)
6. Click: **Generate token**
7. **Copy the token immediately** - you won't see it again!

Example token: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Add to Environment Variables:

When deploying in Portainer (Step 3), add this additional environment variable:

```
Name: GITHUB_TOKEN
Value: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**For public repos**: Skip this entirely - no token needed!

## 🚀 Deployment Steps

### Step 1: Generate Secrets

On your local machine or server:

```bash
# Database password
echo "DB_PASSWORD=$(openssl rand -base64 16 | tr -d '=+/' | head -c 20)"

# NextAuth secret
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)"
```

**Save these values!** You'll need them in Step 3.

### Step 2: Create Cloudflare Tunnel

1. Go to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. Navigate to: **Access** → **Tunnels** → **Create a tunnel**
3. Name it: `mindseyeview`
4. **Save the token** (looks like: `eyJhIjoiXXXXXXX...`)
5. Configure the tunnel:
   - **Public hostname**: `mindseyeview.net`
   - **Service**: `http://mindseyeview-web:3000`
6. You can finish the tunnel setup - the container will connect automatically

### Step 3: Deploy Stack in Portainer

1. **Open Portainer** (your self-hosted instance)

2. **Go to**: Stacks → Add Stack

3. **Stack name**: `mindseyeview`

4. **Build method**: Repository
   - Repository URL: `https://github.com/SkyNet-90/MindsEyeView_Website`
   - Reference: `refs/heads/main`
   - Compose path: `docker-compose.portainer.yml`
   
   **OR Build method**: Web editor
   - Copy the contents of `docker-compose.portainer.yml`

5. **Environment variables** (scroll down):
   Click "Add an environment variable" for each:
   
   **Required for all deployments:**
   ```
   Name: DB_PASSWORD
   Value: [paste the generated password]
   
   Name: NEXTAUTH_SECRET  
   Value: [paste the generated secret]
   
   Name: CF_TUNNEL_TOKEN
   Value: [paste your Cloudflare tunnel token]
   ```
   
   **Only for private repositories:**
   ```
   Name: GITHUB_TOKEN
   Value: [paste your GitHub personal access token]
   ```
   
   ⚠️ **Important**: If repo is public, do NOT add GITHUB_TOKEN

6. **Click**: Deploy the stack

### Step 4: Monitor Startup

Watch the containers start in Portainer:

1. **mindseyeview-db** - Should be healthy in ~10 seconds
2. **git-sync** - Clones the repo and sets up monitoring
3. **mindseyeview-web** - Starts the Next.js app (~30 seconds)
4. **cloudflared-mindseyeview** - Connects to Cloudflare
5. **filebrowser** - Starts the file browser

All should show "healthy" status within 2 minutes.

### Step 5: Initialize Database

Once containers are running:

```bash
# SSH into your server or use Portainer's console

# Connect to the app container
docker exec -it mindseyeview-web sh

# Initialize database
npm run db:push

# Create admin user (will prompt for email, password, name)
npm run create-admin

# Exit container
exit
```

### Step 6: Verify Deployment

#### Check the Website
Visit: **https://mindseyeview.net**

You should see the homepage!

#### Test Admin Login
Visit: **https://mindseyeview.net/admin/login**

Login with the credentials you just created.

#### Check File Browser (Optional)
Visit: **http://your-server-ip:8083**

Default login:
- Username: `admin`
- Password: `admin` (change this immediately!)

You can browse:
- `/srv/uploads` - Uploaded photos
- `/srv/git` - Git repository

### Step 7: Test Auto-Deployment

Make a small change to your code:

```bash
# On your local machine
cd /Users/skylarmatthews/Documents/Projects/MindsEyeView_Website

# Make a small change (or just commit)
git commit --allow-empty -m "Test auto-deploy"
git push

# Wait 5 minutes (sync interval)
# Check git-sync logs in Portainer - you should see:
# "📦 New changes detected!"
# "🐳 Pulling latest Docker image..."
# "🔄 Restarting application..."
# "✅ Successfully deployed new version!"
```

## 🔧 Configuration

### Adjust Sync Interval

To check for updates more/less frequently, edit the stack environment:

```yaml
- SYNC_INTERVAL=300  # 300 seconds = 5 minutes
```

Change to:
- `60` = 1 minute (frequent updates)
- `600` = 10 minutes (less frequent)
- `1800` = 30 minutes (conservative)

### Change Ports

If port 3000 or 8083 are already in use:

```yaml
ports:
  - "3001:3000"  # Change to 3001 (or any free port)
```

For filebrowser:
```yaml
ports:
  - "8084:80"  # Change to 8084 (or any free port)
```

## 📊 Container Overview

| Container | Purpose | Port | Health Check |
|-----------|---------|------|--------------|
| mindseyeview-web | Next.js application | 3000 | HTTP GET / |
| mindseyeview-db | PostgreSQL database | 5432 | pg_isready |
| git-sync | Auto-sync from GitHub | - | Check .git dir |
| cloudflared-mindseyeview | Cloudflare Tunnel | - | Process check |
| filebrowser | File browser UI | 8083 | HTTP GET / |

## 🔄 How Auto-Deploy Works

1. **GitHub Actions** builds new Docker image on every push
2. **git-sync** container checks GitHub every 5 minutes
3. If new commits detected:
   - Pulls latest Docker image from GHCR
   - Restarts the `mindseyeview-web` container
   - New version is live!
4. Database and uploads persist across updates

## 🛠️ Maintenance

### View Logs

In Portainer, click any container → Logs, or via CLI:

```bash
# App logs
docker logs mindseyeview-web -f

# Git sync logs
docker logs mindseyeview-git-sync -f

# Database logs
docker logs mindseyeview-db -f

# Cloudflare tunnel logs
docker logs cloudflared-mindseyeview -f
```

### Manual Update

Force an immediate update:

```bash
# Restart git-sync to trigger immediate check
docker restart mindseyeview-git-sync

# Or manually pull and restart
docker pull ghcr.io/skynet-90/mindseyeview_website:latest
docker restart mindseyeview-web
```

### Backup Database

```bash
# Backup
docker exec mindseyeview-db pg_dump -U mindseyeview mindseyeview > backup.sql

# Restore
cat backup.sql | docker exec -i mindseyeview-db psql -U mindseyeview mindseyeview
```

### Backup Uploads

```bash
# Backup uploads volume
docker run --rm \
  -v mindseyeview_uploads_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/uploads-backup.tar.gz /data

# Restore
docker run --rm \
  -v mindseyeview_uploads_data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/uploads-backup.tar.gz -C /
```

## 🐛 Troubleshooting

### Container Won't Start

Check logs in Portainer or:
```bash
docker logs mindseyeview-web --tail 100
```

Common issues:
- **Database not ready**: Wait 30 seconds for postgres health check
- **Missing env vars**: Check environment variables in stack
- **Port conflict**: Change port mapping

### Website Not Accessible

1. Check Cloudflare Tunnel status:
   ```bash
   docker logs cloudflared-mindseyeview
   ```

2. Verify tunnel configuration in Cloudflare dashboard

3. Test locally:
   ```bash
   curl http://localhost:3000
   ```

### Auto-Deploy Not Working

1. Check git-sync logs:
   ```bash
   docker logs mindseyeview-git-sync -f
   ```

2. Verify GitHub repo is accessible:
   ```bash
   docker exec mindseyeview-git-sync git fetch origin
   ```

3. Check if Docker socket is mounted:
   ```bash
   docker exec mindseyeview-git-sync ls -la /var/run/docker.sock
   ```

### Database Connection Errors

1. Check database is running:
   ```bash
   docker exec mindseyeview-db pg_isready -U mindseyeview
   ```

2. Verify DATABASE_URL in app container:
   ```bash
   docker exec mindseyeview-web env | grep DATABASE_URL
   ```

## 📈 Monitoring

### Health Status

Check all containers:
```bash
docker ps --filter "name=mindseyeview"
```

Look for "healthy" status.

### Resource Usage

```bash
docker stats mindseyeview-web mindseyeview-db
```

## 🔒 Security Notes

1. **Change FileBrowser password** immediately after first login
2. **Keep DB_PASSWORD secure** - never commit to git
3. **NEXTAUTH_SECRET** should be unique and random
4. **Cloudflare Tunnel** encrypts all traffic automatically
5. **Consider firewall rules** for port 8083 if exposed

## ✅ Post-Deployment Checklist

- [ ] All containers showing "healthy" status
- [ ] Database initialized with `npm run db:push`
- [ ] Admin user created
- [ ] Website accessible at https://mindseyeview.net
- [ ] Admin login works
- [ ] Cloudflare Tunnel connected
- [ ] Auto-deploy tested with dummy commit
- [ ] FileBrowser password changed
- [ ] Backups configured (optional but recommended)

## 🎸 You're Live!

Your Mind's Eye View website is now:
- ✅ Running in production
- ✅ Auto-deploying from GitHub
- ✅ Secured with Cloudflare
- ✅ Fully managed in Portainer

Make changes, push to GitHub, and watch them deploy automatically! 🚀

---

**Need help?** Check the logs or refer to HOMELAB_DEPLOYMENT.md for more details.
