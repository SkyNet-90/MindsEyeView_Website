# Mind's Eye View - Official Website

Professional website for Mind's Eye View, a rock cover band celebrating 20+ years of performances.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)

## 🎸 Features

- **Event Management** - Add/edit/delete shows with calendar date picker
- **Photo Gallery** - Upload and manage performance photos
- **Video Gallery** - YouTube integration with display order control
- **Newsletter Signup** - Email subscriber management with export
- **Contact Form** - Formspree integration for booking inquiries
- **Admin Panel** - Secure authentication with password management
- **Responsive Design** - Mobile-first, rock-themed aesthetic
- **SEO Optimized** - Meta tags, sitemap, robots.txt
- **Acoustic Duo Section** - Dedicated page for Sean & Mike

## � Quick Deploy to Home Lab

See **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** for 40-minute setup guide.

### Deployment Overview:
1. Push to GitHub
2. Create Portainer stack
3. Set up Cloudflare Tunnel  
4. Website auto-deploys on every push!

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.9
- **Database**: PostgreSQL 15 + Prisma ORM
- **Auth**: NextAuth.js with bcrypt
- **Styling**: Tailwind CSS 3.4
- **Forms**: Formspree
- **Deployment**: Docker + Portainer + GitHub Actions
- **CDN**: Cloudflare Tunnel

## 📚 Documentation

- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - 40-minute deployment guide
- **[HOMELAB_DEPLOYMENT.md](./HOMELAB_DEPLOYMENT.md)** - Detailed home lab setup
- **[BAND_GUIDE.md](./BAND_GUIDE.md)** - User guide for band members
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project overview
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production checklist

## Quick Start

### Prerequisites

- Node.js 18+ (for development)
- Docker & Docker Compose (for production)
- PostgreSQL (included in Docker setup)

### Development Setup

1. **Clone the repository**
   ```bash
   cd /path/to/MindsEyeView_Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD` - Admin credentials
   - `NEXT_PUBLIC_SITE_URL` - Your site URL

4. **Initialize the database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Create an admin user** (run this script or use Prisma Studio)
   ```bash
   npm run db:studio
   ```
   Then manually create an admin user with a bcrypt-hashed password.

6. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

### Production Deployment with Docker

#### Option 1: Using Docker Compose (Recommended)

1. **Build and start containers**
   ```bash
   docker-compose up -d --build
   ```

2. **Access the application**
   - Website: http://localhost:3000
   - Database: localhost:5432

#### Option 2: Using Portainer

1. **Copy the project to your server**
   ```bash
   scp -r . user@your-server:/path/to/deployment
   ```

2. **In Portainer**:
   - Go to **Stacks** → **Add Stack**
   - Name it `mindseyeview-website`
   - Upload the `docker-compose.yml` file
   - Set environment variables:
     - `NEXTAUTH_SECRET` (generate a secure random string)
   - Deploy the stack

3. **Set up Cloudflare Tunnel**:
   - Install cloudflared on your server
   - Configure tunnel to point to `http://mindseyeview-app:3000`
   - Example tunnel config:
     ```yaml
     tunnel: your-tunnel-id
     credentials-file: /path/to/credentials.json
     
     ingress:
       - hostname: mindseyeview.net
         service: http://localhost:3000
       - service: http_status:404
     ```

#### Database Initialization

The database will be automatically initialized with the schema when you first start the containers using the `init.sql` file.

To create an admin user:

```bash
# Access the database container
docker exec -it mindseyeview-db psql -U mindseyeview -d mindseyeview

# Generate a password hash (use Node.js or online bcrypt tool)
# Then insert admin user:
INSERT INTO admin_users (email, password_hash, name) 
VALUES ('admin@mindseyeview.net', '$2a$10$...your-hashed-password...', 'Admin');
```

Or use a script:
```bash
node scripts/create-admin.js
```

## Admin Panel

Access the admin panel at `/admin/login` with your configured credentials.

### Admin Features:
- ✅ Manage upcoming shows/events
- ✅ Upload and manage photos
- ✅ Add/edit/remove YouTube videos
- ✅ View email subscribers
- ✅ Export subscriber list

## Project Structure

```
MindsEyeView_Website/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin panel pages
│   │   ├── about/             # About page
│   │   ├── shows/             # Shows page
│   │   ├── acoustic/          # Acoustic duo page
│   │   ├── gallery/           # Photo/video gallery
│   │   ├── contact/           # Contact page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   └── lib/                   # Utilities & config
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── docker-compose.yml         # Docker configuration
├── Dockerfile                 # Container image
└── init.sql                   # Database initialization

```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Site URL for NextAuth | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth | Yes |
| `ADMIN_EMAIL` | Default admin email | No |
| `ADMIN_PASSWORD` | Default admin password | No |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | Yes |
| `NEXT_PUBLIC_FACEBOOK_URL` | Facebook page URL | No |
| `SMTP_HOST` | Email server (optional) | No |
| `SMTP_PORT` | Email port (optional) | No |
| `SMTP_USER` | Email username (optional) | No |
| `SMTP_PASSWORD` | Email password (optional) | No |

## Content Management

### Adding Events

1. Log in to `/admin/login`
2. Navigate to Events
3. Click "Add Event"
4. Fill in details (date, venue, description, etc.)
5. Save

### Uploading Photos

1. Go to Admin → Photos
2. Click "Upload Photos"
3. Select images (supports batch upload)
4. Add titles/descriptions
5. Save

### Managing Videos

Videos are YouTube embeds:
1. Go to Admin → Videos
2. Click "Add Video"
3. Paste YouTube URL
4. Add title/description
5. Set display order
6. Save

## Cloudflare Tunnel Configuration

For secure public access without port forwarding:

1. **Install cloudflared**:
   ```bash
   # macOS
   brew install cloudflared
   
   # Linux
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared-linux-amd64.deb
   ```

2. **Authenticate**:
   ```bash
   cloudflared tunnel login
   ```

3. **Create tunnel**:
   ```bash
   cloudflared tunnel create mindseyeview
   ```

4. **Configure tunnel** (create `config.yml`):
   ```yaml
   tunnel: <YOUR-TUNNEL-ID>
   credentials-file: /path/to/<YOUR-TUNNEL-ID>.json
   
   ingress:
     - hostname: mindseyeview.net
       service: http://localhost:3000
     - hostname: www.mindseyeview.net
       service: http://localhost:3000
     - service: http_status:404
   ```

5. **Run tunnel**:
   ```bash
   cloudflared tunnel run mindseyeview
   ```

6. **Set up DNS** in Cloudflare:
   ```bash
   cloudflared tunnel route dns mindseyeview mindseyeview.net
   ```

## Maintenance

### Backups

Backup the database regularly:
```bash
docker exec mindseyeview-db pg_dump -U mindseyeview mindseyeview > backup-$(date +%Y%m%d).sql
```

Backup uploaded files:
```bash
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz ./uploads
```

### Updates

To update the application:
```bash
git pull
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Database Connection Issues
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL container is running: `docker ps`
- Check logs: `docker logs mindseyeview-db`

### Can't Login to Admin
- Verify admin user exists in database
- Check password hash is correct
- Clear browser cache/cookies

### Images Not Loading
- Check `uploads` directory permissions
- Verify volume mount in docker-compose.yml
- Check file paths in database

## Support

For issues or questions:
- Email: info@mindseyeview.net
- Facebook: https://www.facebook.com/profile.php?id=100066853654284

## License

© 2025 Mind's Eye View. All rights reserved.
