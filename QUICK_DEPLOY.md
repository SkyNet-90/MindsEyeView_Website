# Quick Start: Deploy to Home Lab

Follow these steps to get your website live:

## 1️⃣ Push to GitHub (5 minutes)

```bash
# Initialize git if needed
git init
git add .
git commit -m "Initial deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/MindsEyeView_Website.git
git branch -M main
git push -u origin main
```

## 2️⃣ Set Up Portainer Stack (10 minutes)

1. Open Portainer
2. Create new stack: "mindseyeview"
3. Paste this compose file:

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

4. **Generate NEXTAUTH_SECRET**: Run `openssl rand -base64 32`
5. Replace placeholders in the compose file
6. Deploy the stack

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
