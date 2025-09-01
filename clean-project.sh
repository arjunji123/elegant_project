#!/bin/bash

echo "==============================="
echo "Cleaning React Native Project..."
echo "==============================="

# Step 1: Remove node_modules and lock files
echo "Removing node_modules and lock files..."
rm -rf node_modules
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# Step 2: Install dependencies
echo "Installing dependencies..."
if [ -f yarn.lock ]; then
    yarn install
else
    npm install
    npx react-native codegen


# Step 3: Clean Android build
echo "Cleaning Android build..."
cd android || exit
./gradlew clean
rm -rf .cxx
rm -rf app/build
cd ..

# Step 4: Clear Metro bundler cache
echo "Clearing Metro cache..."
npx react-native start --reset-cache

echo "==============================="
echo "✅ Cleanup finished!"
echo "==============================="
