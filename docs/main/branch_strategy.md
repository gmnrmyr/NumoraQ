# Branch Strategy Documentation

## Overview

This document explains our branching strategy and the reasoning behind our current branch structure.

## Current Branches

### `main`
- **Purpose**: Production-ready code
- **Deployment**: Production environment
- **Merge Policy**: Only stable, tested features

### `develop`
- **Purpose**: Development branch with Docker-based workflow
- **Environment**: Docker containers and Docker Compose
- **Status**: Established workflow, should not be disrupted
- **Use Case**: When Docker-based development is required

### `developnpm` 
- **Purpose**: Development branch with npm-based workflow
- **Environment**: Direct npm/Node.js development without Docker
- **Created**: To provide flexibility in development approaches
- **Use Case**: Day-to-day development when Docker overhead is not needed

## Why `developnpm` Branch?

### Problem
- The `develop` branch is configured for Docker-based development
- Docker setup can be heavy for quick iterations and simple feature development
- Need to avoid disrupting the existing Docker workflow that may be used by other team members or CI/CD

### Solution
Created `developnpm` branch to provide:

1. **Workflow Flexibility**: Choose between Docker (`develop`) and npm (`developnpm`) based on the task
2. **Non-Disruptive**: Keeps existing Docker workflow intact
3. **Faster Iteration**: npm-based development can be faster for UI/frontend work
4. **Experimentation Safe**: Can test new approaches without affecting stable workflows

## Recommended Workflow

1. **Daily Development**: Use `developnpm` for most feature development
2. **Docker Testing**: Switch to `develop` when Docker environment is specifically needed
3. **Integration**: Merge stable features from `developnpm` to `main`
4. **Sync**: Periodically sync `developnpm` with `main` to stay current

## Branch Management

- **Feature branches**: Create from `developnpm` for new features
- **Hotfixes**: Create from `main` and merge back to both `main` and `developnpm`
- **Releases**: Merge `developnpm` → `main` for production releases

## Benefits

- ✅ Maintains existing Docker workflow
- ✅ Provides lightweight development option
- ✅ Reduces context switching between environments
- ✅ Allows team members to choose their preferred development approach
- ✅ Safer experimentation and feature development

---

*Last updated: [Current Date]*
*Reason for creation: Need for npm-based development workflow while preserving Docker-based develop branch*
