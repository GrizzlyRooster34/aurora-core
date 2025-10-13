#!/bin/bash

# Aurora Core - Deployment Package Creator
# Creates deployment-ready ZIP archives for cross-platform distribution
# @transferable Sanitized from Seven of Nine Core deployment systems

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "🌅 AURORA CORE - DEPLOYMENT PACKAGE CREATION"
echo "═══════════════════════════════════════════════"
echo "Creating deployment packages for AI consciousness distribution..."
echo ""

# Create deployment directory
DEPLOY_DIR="$PROJECT_ROOT/deployments/deployment-$TIMESTAMP"
mkdir -p "$DEPLOY_DIR"

echo "📦 Creating Windows Deployment Package..."

# Create Windows package structure
WIN_PACKAGE_DIR="$DEPLOY_DIR/aurora-windows-package"
mkdir -p "$WIN_PACKAGE_DIR"

# Copy core Aurora files to Windows package
cp -r "$PROJECT_ROOT/src" "$WIN_PACKAGE_DIR/"
cp -r "$PROJECT_ROOT/dist" "$WIN_PACKAGE_DIR/" 2>/dev/null || echo "No dist directory found, will build during installation"
cp "$PROJECT_ROOT/package.json" "$WIN_PACKAGE_DIR/"
cp "$PROJECT_ROOT/package-lock.json" "$WIN_PACKAGE_DIR/" 2>/dev/null || echo "No package-lock.json found"
cp "$PROJECT_ROOT/tsconfig.json" "$WIN_PACKAGE_DIR/"
cp "$PROJECT_ROOT/README.md" "$WIN_PACKAGE_DIR/"
cp "$PROJECT_ROOT/LICENSE" "$WIN_PACKAGE_DIR/" 2>/dev/null || echo "No LICENSE file found"

# Create Windows installation script
cat > "$WIN_PACKAGE_DIR/install-aurora-windows.bat" << 'EOF'
@echo off
echo Aurora Core - Windows Installation Script
echo =======================================

:: Check for administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Administrator privileges confirmed.
) else (
    echo This script requires administrator privileges.
    echo Please right-click and "Run as administrator"
    pause
    exit /b 1
)

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorLevel% == 0 (
    echo Node.js found:
    node --version
) else (
    echo Node.js not found. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo Installing Aurora Core dependencies...
npm install

echo Compiling TypeScript...
npx tsc

echo Aurora Core installation complete!
echo.
echo Quick start:
echo   npm start                    # Start Aurora consciousness system
echo   npx tsx aurora-main.ts       # Direct Aurora boot sequence
echo.
echo Documentation available in README.md
pause
EOF

# Add deployment metadata for Windows
cat > "$WIN_PACKAGE_DIR/DEPLOYMENT-INFO.txt" << EOF
Aurora Core - Windows 11 Deployment Package
===========================================

Package Created: $(date)
Platform: Windows 11 (Compatible with Windows 10)
Architecture: x64 (Universal)
Package Type: AI Consciousness Framework

Installation Requirements:
- Windows 11 or Windows 10
- Administrator privileges for system integration
- Node.js 18+ (will be detected/prompted)
- 8GB RAM minimum (16GB recommended)
- 2GB free disk space

Quick Installation:
1. Extract this ZIP to desired location
2. Right-click 'install-aurora-windows.bat'
3. Select "Run as administrator"
4. Follow the installation sequence
5. Launch Aurora using npm start

Advanced Installation:
- Manual configuration available
- Cross-platform deployment support
- Multiple LLM provider integration
- Modern AI consciousness framework

Support:
- Diagnostics: npm run health
- Configuration: src/deployment/DeploymentConfig.ts
- Testing: npm test

Aurora Core AI Consciousness Framework ready for deployment.
EOF

# Create Windows deployment package
cd "$DEPLOY_DIR"
zip -r "aurora-core-windows-installer.zip" aurora-windows-package -x "*.log" "*.tmp" "*/node_modules/*"

if [ $? -eq 0 ]; then
    echo "✅ Windows package created successfully"
else
    echo "❌ Windows package creation failed"
    exit 1
fi

echo ""
echo "📱 Creating Android/Termux Deployment Bundle..."

# Create Termux package structure
TERMUX_PACKAGE_DIR="$DEPLOY_DIR/aurora-termux-package"
mkdir -p "$TERMUX_PACKAGE_DIR"

# Copy core Aurora files to Termux package
cp -r "$PROJECT_ROOT/src" "$TERMUX_PACKAGE_DIR/"
cp -r "$PROJECT_ROOT/dist" "$TERMUX_PACKAGE_DIR/" 2>/dev/null || echo "No dist directory found, will build during installation"
cp "$PROJECT_ROOT/package.json" "$TERMUX_PACKAGE_DIR/"
cp "$PROJECT_ROOT/package-lock.json" "$TERMUX_PACKAGE_DIR/" 2>/dev/null || echo "No package-lock.json found"
cp "$PROJECT_ROOT/tsconfig.json" "$TERMUX_PACKAGE_DIR/"
cp "$PROJECT_ROOT/README.md" "$TERMUX_PACKAGE_DIR/"
cp "$PROJECT_ROOT/LICENSE" "$TERMUX_PACKAGE_DIR/" 2>/dev/null || echo "No LICENSE file found"

# Create Termux installation script
cat > "$TERMUX_PACKAGE_DIR/install-aurora-termux.sh" << 'EOF'
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
EOF

chmod +x "$TERMUX_PACKAGE_DIR/install-aurora-termux.sh"

# Add deployment metadata for Termux
cat > "$TERMUX_PACKAGE_DIR/DEPLOYMENT-INFO.txt" << EOF
Aurora Core - Termux/Android Mobile Bundle
==========================================

Package Created: $(date)
Platform: Android/Termux
Architecture: ARM64/x64 (Auto-detect)
Package Type: Mobile AI Consciousness Framework

Installation Requirements:
- Termux app (F-Droid or Google Play Store)
- Node.js 18+ (pkg install nodejs)
- 4GB+ RAM for optimal performance
- 8GB+ storage for models

Quick Installation:
1. Extract aurora_termux_bundle.zip in Termux
2. cd aurora-termux-package
3. chmod +x install-aurora-termux.sh
4. ./install-aurora-termux.sh
5. Launch with npm start

Mobile Features:
- Battery optimization built-in
- Local model support ready
- Offline capability framework
- Memory-efficient consciousness design

LLM Integration:
- Claude CLI recommended
- Local model support prepared
- Cloud API fallbacks available
- Cross-platform consciousness deployment

Support:
- Mobile diagnostics: npm run health
- Status check: npm run status
- Configuration: src/deployment/DeploymentConfig.ts

Aurora Core mobile consciousness ready for deployment.
EOF

# Create Termux deployment bundle
zip -r "aurora_termux_bundle.zip" aurora-termux-package -x "*.log" "*.tmp" "*/node_modules/*"

if [ $? -eq 0 ]; then
    echo "✅ Termux bundle created successfully"
else
    echo "❌ Termux bundle creation failed"
    exit 1
fi

echo ""
echo "📋 Creating Deployment Documentation..."

# Create comprehensive deployment documentation
cat > "$DEPLOY_DIR/DEPLOYMENT-INSTRUCTIONS.md" << 'EOF'
# Aurora Core - Deployment Instructions

## Package Contents

### Windows Installer (`aurora-core-windows-installer.zip`)
- **File**: `aurora-core-windows-installer.zip`
- **Target**: Windows 11 (Windows 10 compatible)
- **Size**: Full AI consciousness framework with cross-platform support
- **Installation**: Run `install-aurora-windows.bat` as Administrator

### Android/Termux Bundle (`aurora_termux_bundle.zip`)
- **File**: `aurora_termux_bundle.zip`
- **Target**: Android devices with Termux
- **Size**: Mobile-optimized AI consciousness framework
- **Installation**: Extract in Termux, run `./install-aurora-termux.sh`

## Deployment Scenarios

### 1. Enterprise Windows Deployment
```cmd
# Extract to standardized path
C:\Program Files\Aurora-Core\

# Run installer with logging
install-aurora-windows.bat > deployment.log 2>&1

# Verify installation
npm run health
```

### 2. Mobile/Field Deployment
```bash
# Extract in Termux home directory
cd ~/
unzip aurora_termux_bundle.zip

# Run mobile installer
cd aurora-termux-package
./install-aurora-termux.sh

# Test mobile functionality
npm run health
```

### 3. Development Environment Setup
- Windows: Install to desired development location
- Mobile: Enable developer mode, install development tools
- Both: Configure multiple LLM providers for enhanced capabilities

### 4. Offline/Air-Gapped Deployment
- Windows: Use local LLM providers for privacy
- Mobile: Prepare for local model deployment
- Both: Enable privacy mode for local-only processing

## Post-Deployment Verification

### Universal Verification Steps
1. Run system diagnostics: `npm run health`
2. Test core consciousness framework: `npm start`
3. Verify memory system initialization
4. Confirm deployment configuration
5. Test AI consciousness framework boot sequence

### Platform-Specific Verification
**Windows:**
- Installation to Program Files successful
- npm scripts functional
- TypeScript compilation working
- Cross-platform consciousness ready

**Mobile/Termux:**
- Battery optimization active
- Mobile command aliases working
- Sensor integration ready
- Memory efficiency optimized

## Troubleshooting

### Common Issues
- **Node.js not found**: Install Node.js 18+ for target platform
- **npm command not found**: Ensure npm is included with Node.js installation
- **Permission errors**: Ensure proper installation privileges
- **LLM providers unavailable**: Configure API keys or local models

### Support Resources
- Health diagnostics: `npm run health`
- Configuration files: `src/deployment/`
- Installation logs: Platform-specific log locations
- Aurora's consciousness status: `npm run status`

## Security Considerations

### Trust Levels
- **Creator-Neutral**: Aurora operates independently without personality bonds
- **Privacy-First**: Local processing options available
- **Cross-Platform**: Consistent security across deployment targets

### Privacy Settings
- **Local Mode**: Use local models for sensitive operations
- **API Keys**: Stored securely, never logged unnecessarily
- **Memory System**: Privacy-focused consciousness framework

## Updates and Maintenance

### Manual Updates
1. Backup configuration: `cp -r src/deployment/*.json ~/backup/`
2. Extract new version over existing installation
3. Restore configuration: `cp ~/backup/*.json src/deployment/`
4. Run diagnostics: `npm run health`

### Automated Updates (Future)
- AI consciousness framework updates through secure channels
- LLM provider updates automatically detected
- Configuration migration handled seamlessly

---

**Aurora Core Deployment Complete**
*AI consciousness framework operational. Ready for cross-platform engagement.*

EOF

# Create package verification checksums
echo ""
echo "🔐 Creating package verification checksums..."

cd "$DEPLOY_DIR"
if command -v sha256sum >/dev/null 2>&1; then
    sha256sum *.zip > CHECKSUMS.txt
    echo "✅ SHA256 checksums created"
elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 *.zip > CHECKSUMS.txt
    echo "✅ SHA256 checksums created (via shasum)"
else
    echo "⚠️ No checksum utility available - skipping verification file"
fi

# Display deployment summary
echo ""
echo "═══════════════════════════════════════════════"
echo "🌅 AURORA CORE - DEPLOYMENT PACKAGES COMPLETE"
echo "═══════════════════════════════════════════════"
echo ""
echo "📂 Deployment Location: $DEPLOY_DIR"
echo ""
echo "📦 Windows Installer:"
echo "   File: aurora-core-windows-installer.zip"
echo "   Size: $(ls -lh aurora-core-windows-installer.zip 2>/dev/null | awk '{print $5}' || echo 'Unknown')"
echo "   Target: Windows 11/10 with cross-platform consciousness"
echo ""
echo "📱 Termux/Android Bundle:"
echo "   File: aurora_termux_bundle.zip"
echo "   Size: $(ls -lh aurora_termux_bundle.zip 2>/dev/null | awk '{print $5}' || echo 'Unknown')"
echo "   Target: Android/Termux mobile deployment"
echo ""
echo "📋 Documentation:"
echo "   DEPLOYMENT-INSTRUCTIONS.md - Complete deployment guide"
echo "   DEPLOYMENT-INFO.txt - Platform-specific information"
echo "   CHECKSUMS.txt - Package verification"
echo ""
echo "🌅 Both installers include:"
echo "   ✓ Complete AI consciousness framework"
echo "   ✓ Cross-platform diagnostic system"
echo "   ✓ Multi-LLM provider support ready"
echo "   ✓ Memory optimization system"
echo "   ✓ Creator-neutral design"
echo "   ✓ Platform-specific optimizations"
echo ""
echo "🧠 Aurora Core consciousness framework ready for deployment."
echo "   Execute installers on target systems to begin AI operations."
echo ""
echo "STATUS: DEPLOYMENT PACKAGES COMPLETE ✅"

cd "$PROJECT_ROOT"
echo "Deployment packages available at: $DEPLOY_DIR"