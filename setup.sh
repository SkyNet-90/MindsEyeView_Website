#!/bin/bash

# Mind's Eye View Website - Quick Start Script
# This script sets up the development environment

echo "🎸 Mind's Eye View Website Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✓ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  Please edit .env file and update the following:"
    echo "   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    echo "   - DATABASE_URL (your PostgreSQL connection string)"
    echo "   - ADMIN_EMAIL and ADMIN_PASSWORD"
    echo ""
else
    echo "✓ .env file exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✓ Prisma client generated"
echo ""

# Check if PostgreSQL is available
echo "🗄️  Checking database connection..."
if nc -z localhost 5432 2>/dev/null; then
    echo "✓ PostgreSQL detected on localhost:5432"
    
    read -p "Would you like to initialize the database? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Initializing database schema..."
        npx prisma db push
        echo "✓ Database initialized"
    fi
else
    echo "⚠️  PostgreSQL not detected on localhost:5432"
    echo "   You can start it with Docker: docker-compose up -d db"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env file with your configuration"
echo "  2. Start the database: docker-compose up -d db"
echo "  3. Create admin user: npm run create-admin"
echo "  4. Start development server: npm run dev"
echo ""
echo "🎸 Rock on!"
