#!/bin/bash

# Mind's Eye View - Quick Deployment Script
# Run this to initialize everything after first deployment

set -e

echo "🎸 Mind's Eye View - Deployment Initialization"
echo "=============================================="
echo ""

# Check if running in container
if [ ! -f /.dockerenv ]; then
    echo "⚠️  This script should be run inside the Docker container"
    echo "Run: docker exec -it mindseyeview-web /app/deploy.sh"
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install --production

echo ""
echo "🗄️  Step 2: Setting up database..."
npx prisma generate
npx prisma db push

echo ""
echo "🌱 Step 3: Seeding initial data..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('Adding initial videos...');
  
  const videos = [
    { title: 'Californication', youtubeUrl: 'https://www.youtube.com/watch?v=UgUVK2D_8D0', youtubeId: 'UgUVK2D_8D0', displayOrder: 1 },
    { title: 'Sweet Home Alabama', youtubeUrl: 'https://www.youtube.com/watch?v=f3IitxU_LMA', youtubeId: 'f3IitxU_LMA', displayOrder: 2 },
    { title: 'You Shook Me All Night Long', youtubeUrl: 'https://www.youtube.com/watch?v=A1LlI6RW2kE', youtubeId: 'A1LlI6RW2kE', displayOrder: 3 },
    { title: 'The Middle', youtubeUrl: 'https://www.youtube.com/watch?v=yN4dnfzq8Ps', youtubeId: 'yN4dnfzq8Ps', displayOrder: 4 },
    { title: 'Times Like These', youtubeUrl: 'https://www.youtube.com/watch?v=KpB76IM4VqM', youtubeId: 'KpB76IM4VqM', displayOrder: 5 },
    { title: 'Are You Gonna Go My Way', youtubeUrl: 'https://www.youtube.com/watch?v=XDNVMF8w3Xo', youtubeId: 'XDNVMF8w3Xo', displayOrder: 6 },
    { title: 'Simple Man', youtubeUrl: 'https://www.youtube.com/watch?v=z_KmswmBhZo', youtubeId: 'z_KmswmBhZo', displayOrder: 7, isAcoustic: true },
  ];

  for (const video of videos) {
    await prisma.video.upsert({
      where: { youtubeId: video.youtubeId },
      update: {},
      create: video,
    });
  }

  console.log('✅ Videos added successfully');
  await prisma.\$disconnect();
}

seed().catch(console.error);
"

echo ""
echo "👤 Step 4: Creating admin user..."
echo "You'll be prompted to enter admin credentials:"
npm run create-admin

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🎸 Your website is ready at: https://mindseyeview.net"
echo "🔐 Admin panel: https://mindseyeview.net/admin/login"
echo ""
echo "Next steps:"
echo "1. Login to admin panel"
echo "2. Change your password"
echo "3. Add events, photos, and additional videos"
echo ""
