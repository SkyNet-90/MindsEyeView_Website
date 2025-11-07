# Self-Hosted Portainer - Deployment Notes

Since you're using **self-hosted Portainer** on your home lab, here are the key differences and recommendations:

## 🏠 Key Differences from Cloud Portainer

### Access
- **Your Setup**: `http://YOUR_SERVER_IP:9000` (or custom domain via Cloudflare)
- **Cloud**: `https://portainer.io/...`

### Webhooks
- **Your Setup**: Webhooks are on your local network by default
- **Cloud**: Webhooks are publicly accessible

### Auto-Update Options
Since your Portainer is self-hosted, you have **3 deployment strategies**:

## 📋 Recommended Deployment Strategies

### ✅ Strategy 1: Git Auto-Update (Easiest)

Portainer can automatically pull from GitHub and redeploy.

**Setup:**
1. In Portainer → Stacks → Your Stack → Settings
2. Enable "Auto update from git repository"
3. Set interval: 5-10 minutes
4. Save

**Workflow:**
```bash
git push  # Wait 5-10 minutes, Portainer auto-updates
```

**Pros**: 
- No webhook exposure needed
- Fully automated
- Works great for home lab

**Cons**: 
- Slight delay (polling interval)

---

### ✅ Strategy 2: Manual Pull & Redeploy (Simplest)

Just click a button in Portainer when you want to update.

**Setup:**
None needed!

**Workflow:**
```bash
git push  # Push changes to GitHub
```
Then in Portainer: Stack → "Pull and redeploy" button

**Pros**: 
- Zero configuration
- Full control over when updates happen
- No security concerns

**Cons**: 
- Manual step required

---

### ⚠️ Strategy 3: Webhook (Most Complex)

Only if you want instant auto-deploy from GitHub Actions.

**Requirements:**
- Portainer webhook must be accessible from internet
- Need to expose via Cloudflare Tunnel or port forward

**Setup:**

1. **Expose webhook via Cloudflare Tunnel**:

   Edit `~/.cloudflared/config.yml`:
   ```yaml
   tunnel: YOUR_TUNNEL_ID
   credentials-file: /root/.cloudflared/YOUR_TUNNEL_ID.json

   ingress:
     # Website
     - hostname: mindseyeview.net
       service: http://localhost:3000
     
     # Portainer webhook (for GitHub Actions)
     - hostname: portainer-webhook.yourdomain.com
       service: http://localhost:9000
     
     - service: http_status:404
   ```

   Route DNS:
   ```bash
   cloudflared tunnel route dns mindseyeview portainer-webhook.yourdomain.com
   ```

2. **Create webhook in Portainer**:
   - Stack → Webhooks → Add webhook
   - Copy ID from URL

3. **Add to GitHub Secrets**:
   - Secret name: `PORTAINER_WEBHOOK_URL`
   - Secret value: `https://portainer-webhook.yourdomain.com/api/webhooks/YOUR_ID`

**Workflow:**
```bash
git push  # Automatic deployment in ~2 minutes
```

**Pros**: 
- Instant auto-deployment
- No manual steps

**Cons**: 
- Exposes Portainer endpoint (secure it!)
- More complex setup
- Requires Cloudflare Tunnel configuration

---

## 🎯 Our Recommendation

**Use Strategy 1 (Git Auto-Update)** because:
- ✅ Fully automated
- ✅ No security concerns
- ✅ Perfect for home lab
- ✅ Easy to set up
- ⏱️ Only 5-10 minute delay

**Or Strategy 2 (Manual)** if:
- You want instant control
- Simple is better
- You don't mind clicking one button

**Avoid Strategy 3** unless:
- You absolutely need instant deploys
- You're comfortable exposing Portainer
- You already have secure tunneling

## 🔧 Configuration Examples

### For Git Auto-Update (Strategy 1):

**In Portainer Stack Settings:**
```
☑ Auto update from git repository
Repository: https://github.com/SkyNet-90/MindsEyeView_Website
Branch: main
Polling interval: 5 minutes
Compose file: docker-compose.yml
```

### For Manual Deploy (Strategy 2):

**No configuration needed!** Just use the docker-compose in QUICK_DEPLOY.md

### For Webhook (Strategy 3):

**GitHub Actions** (already configured in `.github/workflows/deploy.yml`):
```yaml
- name: Trigger Portainer Webhook
  if: success()
  run: |
    curl -X POST ${{ secrets.PORTAINER_WEBHOOK_URL }}
```

**Cloudflare Tunnel config** (`~/.cloudflared/config.yml`):
```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /root/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: mindseyeview.net
    service: http://localhost:3000
  - hostname: portainer-webhook.yourdomain.com
    service: http://localhost:9000
  - service: http_status:404
```

## 🔒 Security Notes

### If Using Webhooks:
1. **Limit webhook access**:
   - Use Cloudflare firewall rules
   - Whitelist GitHub Actions IPs
   - Use authentication tokens

2. **Protect Portainer**:
   - Strong admin password
   - 2FA if available
   - Regular updates
   - Don't expose full Portainer UI publicly

### General Home Lab Security:
- ✅ Keep Portainer behind VPN or tunnel
- ✅ Use strong database passwords
- ✅ Rotate NEXTAUTH_SECRET periodically
- ✅ Keep Docker images updated
- ✅ Monitor access logs

## 📊 Comparison Table

| Feature | Git Auto-Update | Manual | Webhook |
|---------|----------------|---------|---------|
| Setup Difficulty | Easy | None | Complex |
| Deployment Speed | 5-10 min | Instant (manual) | ~2 min |
| Security Risk | Low | Low | Medium |
| Automation | Yes | No | Yes |
| GitHub Actions | Not needed | Not needed | Required |
| Internet Exposure | None | None | Webhook only |
| **Best For** | Most users | Simple setups | Power users |

## 🚀 Quick Setup Commands

### Check Portainer is Running:
```bash
docker ps | grep portainer
```

### Access Portainer:
```bash
# If on same server
http://localhost:9000

# If on network
http://YOUR_SERVER_IP:9000
```

### Restart Portainer (if needed):
```bash
docker restart portainer
```

### View Portainer Logs:
```bash
docker logs portainer -f
```

---

## 💡 Pro Tips

1. **Start with Git Auto-Update** - easiest balance of automation and security
2. **Test in Portainer first** - Deploy stack manually to verify everything works
3. **Keep backups** - Export stack definitions and volumes
4. **Monitor resources** - Check Portainer dashboard for CPU/memory usage
5. **Use named volumes** - Easier to backup and migrate

---

**Bottom Line**: For a home lab setup, use **Git Auto-Update** or **Manual deployment**. Skip webhooks unless you have specific needs and proper security setup.
