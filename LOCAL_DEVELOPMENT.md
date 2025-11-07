# Running Mind's Eye View Locally

Quick guide to run the website on your local machine for development and testing.

## 🚀 Quick Start (5 minutes)

### 1. Make sure you have the required tools:
- Node.js 18+ installed
- PostgreSQL running (or use Docker)

### 2. Install dependencies:
```bash
npm install
```

### 3. Set up environment variables:
```bash
# Copy the example file
cp .env.example .env

# Then edit .env with your values
```

Your `.env` should contain:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mindseyeview"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
NEXT_PUBLIC_FACEBOOK_URL="https://www.facebook.com/profile.php?id=100066853654284"
```

### 4. Generate a NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```
Copy the output and paste it in your `.env` file.

### 5. Set up the database:

**Option A: Use Docker for PostgreSQL** (Recommended)
```bash
# Start PostgreSQL in Docker
docker run -d \
  --name mindseyeview-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mindseyeview \
  -p 5432:5432 \
  postgres:15-alpine
```

**Option B: Use local PostgreSQL**
```bash
# If you have PostgreSQL installed locally
createdb mindseyeview
```

### 6. Initialize the database:
```bash
# Generate Prisma Client
npm run db:generate

# Push database schema
npm run db:push
```

### 7. Create an admin user:
```bash
npm run create-admin
```
Follow the prompts to create your admin account.

### 8. Start the development server:
```bash
npm run dev
```

### 9. Open your browser:
Visit **http://localhost:3000**

## 📝 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build locally |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate Prisma Client |
| `npm run create-admin` | Create admin user |

## 🎯 Quick Test Checklist

Once running locally, test these:

### Public Pages:
- [ ] http://localhost:3000 - Homepage
- [ ] http://localhost:3000/about - About page
- [ ] http://localhost:3000/shows - Shows calendar
- [ ] http://localhost:3000/acoustic - Acoustic duo
- [ ] http://localhost:3000/gallery - Photo/video gallery
- [ ] http://localhost:3000/contact - Contact form

### Admin Panel:
- [ ] http://localhost:3000/admin/login - Login page
- [ ] Login with your admin credentials
- [ ] http://localhost:3000/admin/dashboard - Dashboard
- [ ] Add a test event
- [ ] Upload a test photo
- [ ] Add a YouTube video
- [ ] Check subscribers
- [ ] Change password in settings

## 🛠️ Troubleshooting

### "Cannot connect to database"
**Check PostgreSQL is running:**
```bash
# If using Docker:
docker ps | grep postgres

# If using local PostgreSQL:
pg_isready
```

**Verify DATABASE_URL in .env:**
```bash
cat .env | grep DATABASE_URL
```

### "Prisma Client not generated"
**Run:**
```bash
npm run db:generate
```

### "Port 3000 already in use"
**Kill the process or use a different port:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
PORT=3001 npm run dev
```

### "Build errors"
**Clean install:**
```bash
rm -rf node_modules .next
npm install
npm run db:generate
npm run dev
```

### "Cannot create admin user"
**Make sure database is set up:**
```bash
npm run db:push
npm run create-admin
```

## 🔄 Common Development Workflow

### Making changes:
1. Edit files in `src/` directory
2. Save - Next.js auto-reloads
3. Check http://localhost:3000
4. Repeat!

### Testing admin features:
1. Login at http://localhost:3000/admin/login
2. Make changes in admin panel
3. View changes on public pages
4. Check database changes

### Adding content:
1. **Add Event**: Admin → Events → Add New Event
2. **Upload Photo**: Admin → Photos → Upload
3. **Add Video**: Admin → Videos → Add Video (paste YouTube URL)
4. **View Subscribers**: Admin → Subscribers

## 🐳 Run Locally with Docker (Alternative)

If you want to test the full Docker setup locally:

### 1. Build the image:
```bash
docker build -t mindseyeview-local .
```

### 2. Run with docker-compose:
```bash
docker-compose up
```

This starts both the app and PostgreSQL.

### 3. Access:
Visit **http://localhost:3000**

### 4. Stop:
```bash
docker-compose down
```

## 📊 Development Tools

### View Database:
```bash
# Using Prisma Studio (GUI)
npx prisma studio
```
Opens at http://localhost:5555

### Check logs:
```bash
# Development server logs appear in terminal
npm run dev

# Docker logs (if using Docker)
docker logs mindseyeview-web -f
```

### Database commands:
```bash
# Connect to database
psql postgresql://postgres:password@localhost:5432/mindseyeview

# View tables
\dt

# View data
SELECT * FROM events;
SELECT * FROM admin_users;
SELECT * FROM subscribers;
```

## 🎸 Ready to Develop!

Your local environment is now set up. You can:
- Test all features before deploying
- Make changes and see them live
- Add content for the client demo
- Develop new features

When you're ready to deploy, follow **QUICK_DEPLOY.md**!

---

**Pro Tip**: Keep `npm run dev` running in one terminal while you work. Changes auto-reload! ✨
