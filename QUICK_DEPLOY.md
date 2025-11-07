# Quick Start: Deploy to Home Lab

Follow these steps to get your website live:

## 1️⃣ Push to GitHub (5 minutes)

```bash
# Initialize git if needed
git init
git add .
git commit -m "Initial deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/SkyNet-90/MindsEyeView_Website.git
git branch -M main
git push -u origin main
```

## 2️⃣ Set Up Portainer Stack (10 minutes)

**Note**: You're using self-hosted Portainer, so you'll access it at your own URL (e.g., `http://your-server-ip:9000` or `https://portainer.yourdomain.com`)

1. **Open your Portainer** instance
2. **Go to**: Stacks → Add Stack
3. **Name**: `mindseyeview`
4. **Paste this compose file**:

```yaml
version: '3.8'

services:
  app:
    image: ghcr.io/YOUR_GITHUB_USERNAME/mindseyeview_website:latest
    container_name: mindseyeview-web
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://mindseyeview:YOUR_DB_PASSWORD@db:5432/mindseyeview
      NEXTAUTH_URL: https://mindseyeview.net
      NEXTAUTH_SECRET: YOUR_GENERATED_SECRET
      NEXT_PUBLIC_FACEBOOK_URL: https://www.facebook.com/profile.php?id=100066853654284
    volumes:
      - ./uploads:/app/public/uploads
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    container_name: mindseyeview-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: mindseyeview
      POSTGRES_USER: mindseyeview
      POSTGRES_PASSWORD: YOUR_DB_PASSWORD
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Important for Self-Hosted Portainer:**
- Replace `YOUR_GITHUB_USERNAME` with `skynet-90` (your GitHub username)
- Generate strong `YOUR_DB_PASSWORD`
- Generate `NEXTAUTH_SECRET`: Run `openssl rand -base64 32` in terminal
- Update `NEXTAUTH_URL` to your actual domain

4. **Deploy the stack**
5. **Verify containers are running**: Check Portainer dashboard

## 3️⃣ Set Up Cloudflare Tunnel (15 minutes)

```bash
# On your home lab server
cloudflared tunnel create mindseyeview
cloudflared tunnel route dns mindseyeview mindseyeview.net
```

Create config at `~/.cloudflared/config.yml`:
```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /root/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: mindseyeview.net
    service: http://localhost:3000
  - service: http_status:404
```

Start tunnel:
```bash
sudo cloudflared service install
sudo systemctl start cloudflared
```

## 4️⃣ Initialize Database (5 minutes)

```bash
docker exec -it mindseyeview-web sh
npm run db:push
npm run create-admin
exit
```

## 5️⃣ Set Up Auto-Deploy (5 minutes)

**For Self-Hosted Portainer:**

1. **In Portainer**, go to your stack → Click the stack name → Scroll to "Webhooks"
2. **Create Service Webhook**:
   - Click "Add webhook"
   - Copy the webhook URL (e.g., `http://your-portainer-ip:9000/api/webhooks/xxxxx`)
   
   **Important**: If your Portainer is only accessible internally, you have two options:
   
   **Option A - Expose Portainer webhook** (if safe on your network):
   - Make sure the webhook URL is accessible from GitHub Actions
   - You may need to expose it via Cloudflare Tunnel or similar
   
   **Option B - Manual deployment** (simpler):
   - Skip the webhook setup
   - Update manually: In Portainer, click stack → "Pull and redeploy"
   - Or use Portainer's git auto-update feature

3. **Add to GitHub Secrets** (if using Option A):
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `PORTAINER_WEBHOOK_URL`
   - Value: Your webhook URL
   
4. **Test it**: Make a small change, commit, and push:
   ```bash
   git commit --allow-empty -m "Test auto-deploy"
   git push
   ```

1. Go to your Portainer stack → Webhooks
2. Create webhook, copy URL
3. Go to GitHub repo → Settings → Secrets → Actions
4. Add secret: `PORTAINER_WEBHOOK_URL` = your webhook URL
5. Done! Now every `git push` auto-deploys

## ✅ Verify Deployment

- Visit: https://mindseyeview.net
- Admin: https://mindseyeview.net/admin/login
- Test contact form
- Add an event

## 🔄 Future Updates

Just run:
```bash
git add .
git commit -m "Update website"
git push
```

Website updates automatically in ~2 minutes! 🎸

---

**See HOMELAB_DEPLOYMENT.md for detailed instructions**
