# Deployment Checklist

Use this checklist to ensure a smooth deployment of the Mind's Eye View website.

## Pre-Deployment

### Local Setup
- [ ] Node.js 18+ installed
- [ ] Docker installed (if testing locally)
- [ ] Project files downloaded/cloned
- [ ] `.env` file created from `.env.example`
- [ ] Dependencies installed (`npm install`)
- [ ] Prisma client generated (`npm run db:generate`)

### Configuration
- [ ] `NEXTAUTH_SECRET` generated (use `openssl rand -base64 32`)
- [ ] `DATABASE_URL` configured for PostgreSQL
- [ ] `ADMIN_EMAIL` set
- [ ] `ADMIN_PASSWORD` set (strong password!)
- [ ] `NEXT_PUBLIC_SITE_URL` set to your domain
- [ ] Facebook URL verified in `.env`

### Testing
- [ ] Run `npm run dev` successfully
- [ ] Homepage loads without errors
- [ ] All pages accessible (About, Shows, Acoustic, Gallery, Contact)
- [ ] Admin login page loads (`/admin/login`)
- [ ] Database connection works

## Server Setup

### Server Prerequisites
- [ ] Home lab server accessible via SSH
- [ ] Docker installed on server
- [ ] Docker Compose installed on server
- [ ] Portainer installed and accessible
- [ ] Sufficient disk space (minimum 10GB free)
- [ ] Sufficient RAM (minimum 2GB free)

### File Transfer
- [ ] Project files uploaded to server (e.g., `/opt/mindseyeview`)
- [ ] `.env` file uploaded (or created on server)
- [ ] File permissions set correctly
- [ ] `uploads` directory created with write permissions

### Cloudflare Setup
- [ ] Domain registered and added to Cloudflare
- [ ] `cloudflared` installed on server
- [ ] Cloudflare tunnel created
- [ ] Tunnel configuration file created
- [ ] DNS records configured
- [ ] SSL mode set to "Full (strict)"
- [ ] "Always Use HTTPS" enabled

## Portainer Deployment

### Stack Creation
- [ ] Logged into Portainer
- [ ] New stack created with name `mindseyeview-website`
- [ ] `docker-compose.yml` uploaded or pasted
- [ ] Environment variables added:
  - [ ] `NEXTAUTH_SECRET`
  - [ ] Database password updated in compose file
- [ ] Stack deployed successfully

### Container Verification
- [ ] `mindseyeview-app` container running
- [ ] `mindseyeview-db` container running
- [ ] No error logs in containers
- [ ] Network created properly
- [ ] Volumes mounted correctly

## Database Setup

### Database Initialization
- [ ] Wait 30 seconds for PostgreSQL to start
- [ ] Database schema initialized (via `init.sql`)
- [ ] Admin user created (`npm run create-admin` or script)
- [ ] Admin credentials tested
- [ ] Initial YouTube videos seeded
- [ ] Database backup created

## Application Testing

### Local Network Testing
- [ ] Application accessible on `http://localhost:3000`
- [ ] Homepage displays correctly
- [ ] All navigation links work
- [ ] Images load properly
- [ ] Videos embed correctly
- [ ] Newsletter signup works
- [ ] Contact form submits
- [ ] Admin login successful

### Public Access Testing
- [ ] Site accessible via domain (e.g., https://mindseyeview.net)
- [ ] HTTPS working correctly
- [ ] All pages load over SSL
- [ ] No mixed content warnings
- [ ] Facebook link works
- [ ] YouTube embeds work
- [ ] Mobile responsive design verified

### Admin Panel Testing
- [ ] Admin login page accessible
- [ ] Login with correct credentials works
- [ ] Dashboard displays
- [ ] Navigate to Events section
- [ ] Navigate to Videos section
- [ ] Navigate to Photos section
- [ ] Navigate to Subscribers section
- [ ] Logout function works

## Content Setup

### Initial Content
- [ ] Add first upcoming event
- [ ] Verify event displays on Shows page
- [ ] Verify event displays on homepage
- [ ] Test photo upload functionality
- [ ] Verify uploaded photos appear in gallery
- [ ] Check all pre-loaded videos display
- [ ] Test newsletter signup from public site

### SEO Setup
- [ ] Google Search Console setup
- [ ] Sitemap submitted to Google
- [ ] Robots.txt verified
- [ ] Meta descriptions checked on all pages
- [ ] Open Graph images set
- [ ] Bing Webmaster Tools setup (optional)

## Cloudflare Tunnel

### Tunnel Service
- [ ] Cloudflare tunnel running as system service
- [ ] Service auto-starts on reboot
- [ ] No errors in tunnel logs
- [ ] DNS propagated (check with `dig` or `nslookup`)
- [ ] HTTP traffic redirected to HTTPS

### Cloudflare Dashboard
- [ ] DNS records showing as "Proxied"
- [ ] Page Rules configured (if needed)
- [ ] Firewall rules reviewed
- [ ] Analytics tracking enabled
- [ ] Security level appropriate

## Security Hardening

### Access Control
- [ ] Admin password changed from default
- [ ] Strong password policy enforced
- [ ] Admin email verified
- [ ] Database password is strong
- [ ] Environment variables secured
- [ ] `.env` file not committed to git

### Firewall
- [ ] Only necessary ports open
- [ ] Cloudflare protection enabled
- [ ] Rate limiting configured (optional)
- [ ] Bot protection enabled

### Backups
- [ ] Database backup script created
- [ ] File backup script created
- [ ] Backup schedule configured (cron job)
- [ ] Backup restoration tested
- [ ] Off-site backup location identified

## Monitoring

### Logging
- [ ] Application logs accessible
- [ ] Database logs accessible
- [ ] Cloudflare tunnel logs accessible
- [ ] Log rotation configured
- [ ] Error notification setup (optional)

### Performance
- [ ] Page load time acceptable (< 3 seconds)
- [ ] Images optimized
- [ ] No console errors in browser
- [ ] Mobile performance tested
- [ ] Lighthouse audit passed (optional)

### Uptime
- [ ] Uptime monitoring service configured (optional)
- [ ] Email alerts for downtime setup (optional)
- [ ] Container auto-restart enabled
- [ ] Health checks configured

## Documentation

### Admin Documentation
- [ ] Admin login credentials documented (securely)
- [ ] How to add events documented
- [ ] How to upload photos documented
- [ ] How to add videos documented
- [ ] How to view subscribers documented

### Technical Documentation
- [ ] Server details documented
- [ ] Backup procedures documented
- [ ] Restore procedures documented
- [ ] Update procedures documented
- [ ] Emergency contacts listed

## Go-Live

### Final Checks
- [ ] All checklist items above completed
- [ ] Site reviewed by band members
- [ ] Content approved
- [ ] Social media posts prepared
- [ ] Launch date confirmed

### Launch
- [ ] DNS switched to production
- [ ] Announcement posted on Facebook
- [ ] Email sent to existing contacts (if any)
- [ ] QR code created for shows (optional)
- [ ] Business cards updated with URL (optional)

### Post-Launch
- [ ] Monitor for first 24 hours
- [ ] Check analytics daily for first week
- [ ] Respond to any issues quickly
- [ ] Collect feedback from band and fans
- [ ] Plan first content update

## Post-Deployment Tasks

### Week 1
- [ ] Daily log monitoring
- [ ] Performance check
- [ ] Backup verification
- [ ] Content additions
- [ ] User feedback collection

### Week 2-4
- [ ] Add more events
- [ ] Upload more photos
- [ ] Review subscriber list
- [ ] Test all features again
- [ ] Plan content calendar

### Monthly
- [ ] Review analytics
- [ ] Update upcoming events
- [ ] Clean up old events
- [ ] Database optimization
- [ ] Security updates

## Emergency Contacts

- **Server Admin**: _________________
- **DNS/Domain**: _________________
- **Cloudflare**: support@cloudflare.com
- **Developer**: _________________
- **Band Contact**: bookings@mindseyeview.net

## Rollback Plan

If deployment fails:

1. [ ] Stop containers: `docker-compose down`
2. [ ] Check logs for errors
3. [ ] Restore database from backup if needed
4. [ ] Review configuration changes
5. [ ] Contact support if needed

## Notes

```
Add any deployment-specific notes here:
- Server IP: 
- Tunnel ID:
- Special configurations:
```

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Version**: 1.0.0  

**Status**: ☐ Not Started | ☐ In Progress | ☐ Completed | ☐ Issues Found

