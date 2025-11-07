#!/bin/bash

# Mind's Eye View - Local Development Startup Script

echo "🎸 Mind's Eye View - Starting Local Development"
echo "==============================================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env created. Please edit it with your settings."
    echo ""
    read -p "Press Enter to continue after editing .env..."
fi

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL..."
if docker ps | grep -q postgres; then
    echo "✅ PostgreSQL is running"
else
    echo "⚠️  PostgreSQL not running. Starting it..."
    docker run -d \
      --name mindseyeview-db \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=password \
      -e POSTGRES_DB=mindseyeview \
      -p 5432:5432 \
      postgres:15-alpine
    
    echo "⏳ Waiting for PostgreSQL to start..."
    sleep 3
    echo "✅ PostgreSQL started"
fi

echo ""
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing..."
    npm install
else
    echo "✅ Dependencies installed"
fi

echo ""
echo "🗄️  Setting up database..."

# Check if Prisma Client is generated
if [ ! -d "node_modules/.prisma" ]; then
    echo "⚠️  Generating Prisma Client..."
    npm run db:generate
else
    echo "✅ Prisma Client generated"
fi

# Push database schema
echo "📋 Pushing database schema..."
npm run db:push

echo ""
echo "👤 Checking for admin user..."
ADMIN_COUNT=$(docker exec mindseyeview-db psql -U postgres -d mindseyeview -t -c "SELECT COUNT(*) FROM admin_users;" 2>/dev/null | tr -d ' ')

if [ "$ADMIN_COUNT" = "0" ] || [ -z "$ADMIN_COUNT" ]; then
    echo "⚠️  No admin user found. Creating one..."
    npm run create-admin
else
    echo "✅ Admin user exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting development server..."
echo "   Visit: http://localhost:3000"
echo "   Admin: http://localhost:3000/admin/login"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
