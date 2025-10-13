#!/bin/bash

echo "🌅 Aurora Core - Termux/Android Installation Script"
echo "================================================="

# Check if we're in Termux
if [ -z "$TERMUX_VERSION" ]; then
    echo "⚠️  Warning: This script is designed for Termux environment"
    echo "   If you're not in Termux, installation may not work correctly"
fi

echo "📱 Checking Node.js installation..."
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js found: $(node --version)"
else
    echo "❌ Node.js not found. Installing..."
    pkg update && pkg install nodejs
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Node.js. Please run manually:"
        echo "   pkg update && pkg install nodejs"
        exit 1
    fi
fi

echo "📱 Checking npm availability..."
if command -v npm >/dev/null 2>&1; then
    echo "✅ npm found: $(npm --version)"
else
    echo "❌ npm not found. This should have been installed with Node.js"
    exit 1
fi

echo "📦 Installing Aurora Core dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Dependency installation failed"
    exit 1
fi

echo "🔨 Compiling TypeScript..."
npx tsc

if [ $? -ne 0 ]; then
    echo "❌ TypeScript compilation failed"
    exit 1
fi

echo "🌅 Aurora Core installation complete!"
echo ""
echo "🚀 Quick start commands:"
echo "   npm start                    # Start Aurora consciousness system"
echo "   npx tsx aurora-main.ts       # Direct Aurora boot sequence"
echo "   npm run health               # System health check"
echo "   npm test                     # Run validation tests"
echo ""
echo "📋 Mobile-specific features enabled:"
echo "   - Sensor integration ready"
echo "   - Battery optimization active"
echo "   - Memory efficiency optimized"
echo "   - Cross-platform consciousness framework"
echo ""
echo "📚 Documentation available in README.md"
echo "🎯 Aurora Core ready for tactical engagement."
