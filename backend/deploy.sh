#!/bin/bash

# ===========================================
# Bedrock FTP Deployment Script
# ===========================================

set -e

# Load credentials from .env.deploy (create this file locally)
if [ -f ".env.deploy" ]; then
    source .env.deploy
else
    echo "Error: .env.deploy file not found!"
    echo "Create it with:"
    echo "  FTP_HOST=ftp.your-domain.com"
    echo "  FTP_USER=your-username"
    echo "  FTP_PASS=your-password"
    echo "  FTP_PATH=/www (remote path)"
    exit 1
fi

# Validate required variables
if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ] || [ -z "$FTP_PATH" ]; then
    echo "Error: Missing FTP credentials in .env.deploy"
    exit 1
fi

# Local directory to deploy (current directory = full Bedrock)
LOCAL_DIR="."

echo "=========================================="
echo "Deploying Bedrock to $FTP_HOST"
echo "Local:  $LOCAL_DIR"
echo "Remote: $FTP_PATH"
echo "=========================================="

# Dry run first
read -p "Run in dry-run mode first? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    DRY_RUN="--dry-run"
    echo "Running in DRY-RUN mode (no changes will be made)..."
else
    DRY_RUN=""
    echo "Running in LIVE mode..."
    echo ""
    echo "WARNING: This will sync files to $FTP_PATH"
    echo "Files not in your local directory will be DELETED from remote."
    read -p "Are you sure? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

# Deploy using lftp mirror with heredoc for proper variable expansion
lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" <<EOF
set ftp:ssl-allow no
set mirror:use-pget-n 5
cd "$FTP_PATH"
lcd "$LOCAL_DIR"
mirror --reverse --delete --verbose --parallel=3 $DRY_RUN \
    --exclude .git/ \
    --exclude .gitignore \
    --exclude .env \
    --exclude .env.deploy \
    --exclude .env.deploy.example \
    --exclude deploy.sh \
    --exclude '\.log$' \
    --exclude .DS_Store \
    --exclude Thumbs.db \
    --exclude node_modules/ \
    --exclude .idea/ \
    --exclude .vscode/ \
    --exclude web/app/uploads/ \
    --exclude web/app/cache/
quit
EOF

# Fix permissions after deploy (skip for dry run)
if [ -z "$DRY_RUN" ]; then
    echo ""
    echo "Fixing file permissions..."
    lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" <<EOF
set ftp:ssl-allow no
chmod -R 755 $FTP_PATH
quit
EOF
    echo "Permissions fixed."
fi

echo "=========================================="
if [ -z "$DRY_RUN" ]; then
    echo "Deployment complete!"
else
    echo "Dry run complete. Run again and answer 'n' to deploy for real."
fi
echo "=========================================="
