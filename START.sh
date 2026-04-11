#!/bin/bash

echo "🚀 Starting DS-160 Helper..."
echo ""
echo "📍 Project: DS-160 Visa Application Assistant"
echo "🎨 Design: Apple-inspired minimal interface"
echo "⚡ Tech: Nuxt 3 + Vue 3 + Tailwind CSS + TypeScript + Pinia"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Dependencies ready"
echo ""
echo "🌐 Starting development server..."
echo "   → Local: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
