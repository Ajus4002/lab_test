#!/bin/bash

echo "🏥 Blood Report Management System - Setup Script"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating environment file..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your database credentials before starting the application."
else
    echo "✅ Environment file already exists."
fi

# Check if database exists
echo "🗄️  Checking database connection..."
if psql -lqt | cut -d \| -f 1 | grep -qw blood_report_db; then
    echo "✅ Database 'blood_report_db' already exists."
else
    echo "🗄️  Creating database 'blood_report_db'..."
    createdb blood_report_db
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully."
    else
        echo "❌ Failed to create database. Please check your PostgreSQL installation and permissions."
        exit 1
    fi
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database credentials"
echo "2. Start the backend server: npm run dev"
echo "3. Start the frontend: npm run client"
echo ""
echo "The application will be available at:"
echo "- Backend API: http://localhost:5000"
echo "- Frontend: http://localhost:3000"
echo ""
echo "Happy coding! 🚀"


