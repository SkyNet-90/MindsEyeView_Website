# Pre-Deployment Checklist

Complete these steps before showing to the client and deploying to production.

## ✅ Local Testing Complete

- [ ] All pages load without errors
- [ ] Admin login works
- [ ] Can create/edit/delete events
- [ ] Can upload/delete photos
- [ ] Can add/delete videos
- [ ] Newsletter signup works
- [ ] Contact form submits to Formspree
- [ ] Password change works
- [ ] Date picker works for events
- [ ] Images display correctly
- [ ] Mobile responsive on all pages

## 🔐 Security Setup

- [ ] Change default admin password (use strong password)
- [ ] Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Verify .env is in .gitignore
- [ ] No sensitive data in code
- [ ] All environment variables documented

## 📝 Content Ready

- [ ] Band photos added to `/public/images/`
- [ ] Initial events added (if any)
- [ ] YouTube videos are accessible
- [ ] Facebook URL is correct
- [ ] Contact form email is set up in Formspree

## 🐙 GitHub Setup

- [ ] Create GitHub repository (private recommended)
- [ ] Add .gitignore file
- [ ] Push initial code
- [ ] Verify GitHub Actions is enabled
- [ ] Repository secrets ready for webhook URL

## 🏠 Home Lab Preparation

- [ ] Docker is running
- [ ] Portainer is accessible
- [ ] Network connectivity verified
- [ ] Sufficient disk space (5GB minimum)
- [ ] Backup strategy in place

## ☁️ Cloudflare Setup

- [ ] Domain registered and on Cloudflare
- [ ] Cloudflared installed on home lab
- [ ] Tunnel created
- [ ] DNS configured
- [ ] SSL/TLS set to "Full"

## 🚀 Deployment Steps

### 1. Push to GitHub (5 min)
```bash
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/YOUR_USERNAME/MindsEyeView_Website.git
git branch -M main
git push -u origin main
```

### 2. GitHub Container Registry (Auto)
- GitHub Actions will build Docker image automatically
- Check Actions tab for build status
- Image will be at: `ghcr.io/YOUR_USERNAME/mindseyeview_website:latest`

### 3. Portainer Stack (10 min)
- [ ] Create new stack named "mindseyeview"
- [ ] Use docker-compose from QUICK_DEPLOY.md
- [ ] Set all environment variables
- [ ] Deploy stack
- [ ] Verify containers are running

### 4. Initialize Database (5 min)
```bash
docker exec -it mindseyeview-web sh
npx prisma db push
npm run create-admin
exit
```

### 5. Cloudflare Tunnel (15 min)
- [ ] Create tunnel
- [ ] Configure ingress rules
- [ ] Start tunnel as service
- [ ] Verify DNS records
- [ ] Test external access

### 6. Set Up Webhooks (5 min)
- [ ] Create Portainer webhook
- [ ] Add webhook URL to GitHub secrets
- [ ] Test auto-deploy with dummy commit

## 🧪 Post-Deployment Testing

### Website Functionality
- [ ] Visit https://mindseyeview.net
- [ ] All pages load correctly
- [ ] Images display
- [ ] Videos play
- [ ] Forms submit

### Admin Panel
- [ ] Login at https://mindseyeview.net/admin/login
- [ ] Add test event
- [ ] Upload test photo
- [ ] Add YouTube video
- [ ] Check subscribers list
- [ ] Change password

### Auto-Deploy
- [ ] Make minor change to code
- [ ] Commit and push
- [ ] Verify GitHub Action runs
- [ ] Verify Portainer updates
- [ ] Confirm change is live (~2 minutes)

## 📊 Monitoring Setup

- [ ] Set up Portainer email notifications
- [ ] Configure Cloudflare alerts
- [ ] Database backup schedule
- [ ] Monitor disk usage
- [ ] Set up uptime monitoring (optional)

## 📖 Documentation for Client

- [ ] Share admin login credentials securely
- [ ] Provide BAND_GUIDE.md
- [ ] Show how to add events
- [ ] Demo photo uploads
- [ ] Explain newsletter export
- [ ] Show contact form submissions

## 🎯 Pre-Launch Client Demo

### Show Them:
1. **Public Website**
   - Homepage with shows and videos
   - About page with band bio
   - Shows calendar
   - Acoustic duo page
   - Photo/video gallery
   - Contact form

2. **Admin Panel**
   - Login process
   - Dashboard overview
   - Add new event (with date picker)
   - Upload photos
   - Add YouTube video
   - View subscribers
   - Change password

3. **Mobile Version**
   - Show responsive design
   - Test on phone/tablet

## 🚨 Emergency Contacts

- **GitHub**: https://github.com/YOUR_USERNAME/MindsEyeView_Website
- **Portainer**: https://portainer.yourdomain.com
- **Cloudflare**: https://dash.cloudflare.com
- **Formspree**: https://formspree.io/forms/xjkjbbvj

## 📝 Final Checklist Before Going Live

- [ ] SSL certificate working (https://)
- [ ] Admin password is strong
- [ ] Database backups configured
- [ ] All test content removed
- [ ] Real content added
- [ ] Contact form tested with real email
- [ ] Newsletter signup tested
- [ ] Facebook/YouTube links work
- [ ] SEO meta tags verified
- [ ] Mobile responsiveness confirmed
- [ ] Client has admin access
- [ ] BAND_GUIDE.md shared with client
- [ ] All documentation updated
- [ ] GitHub webhook working
- [ ] Monitoring alerts active

## 🎸 Launch Day

1. **Final smoke test** - Check everything one more time
2. **Go live** - Point domain to Cloudflare tunnel
3. **Verify** - Test from external network
4. **Share** - Give client admin credentials
5. **Train** - Walk through admin panel
6. **Monitor** - Watch for issues in first 24 hours
7. **Celebrate** - You did it! 🎉

---

**Estimated Total Setup Time**: 40-60 minutes
**Auto-deploy after setup**: 2-3 minutes per update

## Next Steps After Launch

- Set up weekly database backups
- Monitor traffic and performance
- Schedule regular content updates with band
- Consider adding analytics (optional)
- Plan future features (merchandise, blog, etc.)
