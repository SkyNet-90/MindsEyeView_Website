# Deployment Guide for Portainer

This guide walks you through deploying the Mind's Eye View website using Portainer with Cloudflare Tunnel.

## Prerequisites

- Portainer installed on your home lab server
- Domain name configured in Cloudflare
- Cloudflare Tunnel set up (cloudflared installed)
- Docker and Docker Compose installed on your server

## Step 1: Prepare the Server

1. **SSH into your home lab server**:
   ```bash
   ssh user@your-server-ip
   ```

2. **Create project directory**:
   ```bash
   mkdir -p /opt/mindseyeview
   cd /opt/mindseyeview
   ```

3. **Upload project files**:
   ```bash
   # From your local machine
   scp -r /path/to/MindsEyeView_Website/* user@your-server:/opt/mindseyeview/
   ```

## Step 2: Configure Environment

1. **Create `.env` file**:
   ```bash
   cd /opt/mindseyeview
   cp .env.example .env
   nano .env
   ```

2. **Update `.env` with your values**:
   ```env
   DATABASE_URL=postgresql://mindseyeview:STRONG_PASSWORD_HERE@db:5432/mindseyeview
   NEXTAUTH_URL=https://mindseyeview.net
   NEXTAUTH_SECRET=GENERATE_WITH_openssl_rand_-base64_32
   ADMIN_EMAIL=admin@mindseyeview.net
   ADMIN_PASSWORD=CHANGE_THIS_PASSWORD
   NEXT_PUBLIC_SITE_URL=https://mindseyeview.net
   NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/minds.e.view
   ```

3. **Generate secure secrets**:
   ```bash
   # Generate NEXTAUTH_SECRET
   openssl rand -base64 32
   
   # Generate database password
   openssl rand -base64 24
   ```

## Step 3: Deploy with Portainer

### Method 1: Using Stack in Portainer UI

1. **Log into Portainer** (http://your-server-ip:9000)

2. **Navigate to Stacks** → **Add Stack**

3. **Configure Stack**:
   - **Name**: `mindseyeview-website`
   - **Build method**: Upload `docker-compose.yml`
   - Upload the file from `/opt/mindseyeview/docker-compose.yml`

4. **Add Environment Variables** (in Stack editor):
   ```
   NEXTAUTH_SECRET=your-generated-secret
   DATABASE_URL=postgresql://mindseyeview:your-password@db:5432/mindseyeview
   ```

5. **Deploy the Stack**

### Method 2: Using Portainer API/CLI

1. **From server terminal**:
   ```bash
   cd /opt/mindseyeview
   docker-compose up -d --build
   ```

2. **Verify containers are running**:
   ```bash
   docker ps
   ```
   
   You should see:
   - `mindseyeview-app`
   - `mindseyeview-db`

## Step 4: Initialize Database and Admin User

1. **Wait for database to be ready** (about 30 seconds)

2. **Create admin user**:
   ```bash
   cd /opt/mindseyeview
   
   # Install dependencies if not done
   npm install
   
   # Run admin creation script
   node scripts/create-admin.js
   ```

   Or manually create admin:
   ```bash
   docker exec -it mindseyeview-app sh
   
   # Inside container
   npx prisma db push
   node scripts/create-admin.js
   exit
   ```

## Step 5: Configure Cloudflare Tunnel

1. **Install cloudflared** (if not already installed):
   ```bash
   # For Debian/Ubuntu
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared-linux-amd64.deb
   ```

2. **Authenticate with Cloudflare**:
   ```bash
   cloudflared tunnel login
   ```
   
   This opens a browser - select your domain.

3. **Create tunnel**:
   ```bash
   cloudflared tunnel create mindseyeview
   ```
   
   Note the Tunnel ID shown.

4. **Create tunnel configuration**:
   ```bash
   sudo mkdir -p /etc/cloudflared
   sudo nano /etc/cloudflared/config.yml
   ```
   
   Add:
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

5. **Route DNS through tunnel**:
   ```bash
   cloudflared tunnel route dns mindseyeview mindseyeview.net
   cloudflared tunnel route dns mindseyeview www.mindseyeview.net
   ```

6. **Install as system service**:
   ```bash
   sudo cloudflared service install
   sudo systemctl start cloudflared
   sudo systemctl enable cloudflared
   ```

7. **Check tunnel status**:
   ```bash
   sudo systemctl status cloudflared
   cloudflared tunnel info mindseyeview
   ```

## Step 6: Verify Deployment

1. **Check application logs**:
   ```bash
   docker logs mindseyeview-app
   ```

2. **Test local access**:
   ```bash
   curl http://localhost:3000
   ```

3. **Test public access**:
   - Visit https://mindseyeview.net
   - Should see the homepage

4. **Test admin access**:
   - Visit https://mindseyeview.net/admin/login
   - Login with credentials from `.env`

## Step 7: Post-Deployment Setup

1. **Add initial content**:
   - Login to admin panel
   - Add upcoming events
   - Videos are already seeded from questionnaire
   - Upload band photos

2. **Test email subscription**:
   - Go to homepage
   - Subscribe to newsletter
   - Check admin panel for subscriber

3. **SSL/TLS Configuration**:
   - Cloudflare automatically provides SSL
   - Enable "Full (strict)" SSL mode in Cloudflare dashboard
   - Turn on "Always Use HTTPS"

## Maintenance

### Backing Up Data

1. **Database backup**:
   ```bash
   docker exec mindseyeview-db pg_dump -U mindseyeview mindseyeview > backup-$(date +%Y%m%d).sql
   ```

2. **Uploaded files backup**:
   ```bash
   tar -czf uploads-backup-$(date +%Y%m%d).tar.gz /opt/mindseyeview/uploads
   ```

3. **Automated backups** (add to crontab):
   ```bash
   # Backup daily at 2 AM
   0 2 * * * docker exec mindseyeview-db pg_dump -U mindseyeview mindseyeview > /opt/backups/mindseyeview-$(date +\%Y\%m\%d).sql
   ```

### Updating the Application

1. **Pull latest changes**:
   ```bash
   cd /opt/mindseyeview
   git pull  # if using git
   ```

2. **Rebuild and restart**:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

### Monitoring

1. **View logs**:
   ```bash
   # Application logs
   docker logs -f mindseyeview-app
   
   # Database logs
   docker logs -f mindseyeview-db
   
   # Cloudflare tunnel logs
   sudo journalctl -u cloudflared -f
   ```

2. **Monitor resources** in Portainer:
   - Go to Containers → select container
   - View Stats tab for CPU/Memory usage

## Troubleshooting

### Website Not Accessible

1. **Check containers**:
   ```bash
   docker ps
   ```
   All containers should be "Up".

2. **Check cloudflared**:
   ```bash
   sudo systemctl status cloudflared
   ```

3. **Check DNS**:
   ```bash
   dig mindseyeview.net
   ```
   Should point to Cloudflare IPs.

### Database Connection Errors

1. **Verify database is running**:
   ```bash
   docker exec -it mindseyeview-db psql -U mindseyeview -d mindseyeview -c "SELECT 1;"
   ```

2. **Check DATABASE_URL** in `.env`

3. **Restart containers**:
   ```bash
   docker-compose restart
   ```

### Admin Login Not Working

1. **Verify admin user exists**:
   ```bash
   docker exec -it mindseyeview-db psql -U mindseyeview -d mindseyeview -c "SELECT email FROM admin_users;"
   ```

2. **Reset admin password**:
   ```bash
   docker exec -it mindseyeview-app node scripts/create-admin.js
   ```

### Performance Issues

1. **Increase container resources** in Portainer
2. **Optimize images** in uploads folder
3. **Check disk space**:
   ```bash
   df -h
   ```

## Security Best Practices

1. **Change default passwords** immediately
2. **Enable Cloudflare WAF** rules
3. **Regular updates**:
   ```bash
   docker-compose pull
   docker-compose up -d --build
   ```
4. **Monitor logs** for suspicious activity
5. **Backup regularly** (see above)
6. **Use strong NEXTAUTH_SECRET**

## Support

If you encounter issues:
- Check logs first
- Review Portainer container stats
- Verify Cloudflare tunnel status
- Contact: bookings@mindseyeview.net
