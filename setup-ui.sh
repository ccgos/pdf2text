#!/bin/bash

# Install shadcn/ui and its dependencies
npm install @shadcn/ui class-variance-authority clsx tailwind-merge lucide-react

# Create the components directory
mkdir -p src/components/ui

# Add button component
npx shadcn-ui@latest add button

# Add any other components we need
npx shadcn-ui@latest add progress 