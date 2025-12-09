---
description: Deploy Angry Apple Tree website to AWS with S3 and CloudFront
---

# Deploy Angry Apple Tree Website to AWS

This guide will walk you through deploying the Angry Apple Tree website (including the Space Badger game) to AWS using S3 for hosting and CloudFront for CDN.

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **AWS CLI**: Install the AWS CLI tool
   ```bash
   # macOS
   brew install awscli
   
   # Verify installation
   aws --version
   ```
3. **AWS Credentials**: Configure your AWS credentials
   ```bash
   aws configure
   ```
   You'll need:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region (e.g., `us-east-1`)
   - Default output format (use `json`)

## Step 1: Prepare Your Files

1. **Build the Space Badger Game** (if not already built):
   ```bash
   cd "/Users/alexanderbunch/App dummy/space-invaders"
   npm run build
   ```
   This creates a `dist` folder with the production build.

2. **Update the Game Link** in the main website:
   - The Space Badger Game card currently links to `http://localhost:5173/`
   - We'll update this after deployment with the actual CloudFront URL

## Step 2: Create S3 Buckets

You'll need TWO S3 buckets:
1. One for the main Angry Apple Tree website
2. One for the Space Badger game

```bash
# Replace 'your-domain-name' with your actual domain or a unique name
MAIN_BUCKET="angryappletree-website"
GAME_BUCKET="angryappletree-spacegame"

# Create main website bucket
aws s3 mb s3://$MAIN_BUCKET

# Create game bucket
aws s3 mb s3://$GAME_BUCKET
```

## Step 3: Configure S3 Buckets for Static Website Hosting

### Main Website Bucket:
```bash
# Enable static website hosting
aws s3 website s3://$MAIN_BUCKET --index-document index.html --error-document index.html

# Create bucket policy for public read access
cat > main-bucket-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    }
  ]
}
EOF

# Replace BUCKET_NAME with your actual bucket name
sed -i '' "s/BUCKET_NAME/$MAIN_BUCKET/g" main-bucket-policy.json

# Apply the policy
aws s3api put-bucket-policy --bucket $MAIN_BUCKET --policy file://main-bucket-policy.json
```

### Game Bucket:
```bash
# Enable static website hosting
aws s3 website s3://$GAME_BUCKET --index-document index.html --error-document index.html

# Create bucket policy for public read access
cat > game-bucket-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    }
  ]
}
EOF

# Replace BUCKET_NAME with your actual bucket name
sed -i '' "s/BUCKET_NAME/$GAME_BUCKET/g" game-bucket-policy.json

# Apply the policy
aws s3api put-bucket-policy --bucket $GAME_BUCKET --policy file://game-bucket-policy.json
```

## Step 4: Upload Files to S3

### Upload Main Website:
```bash
cd "/Users/alexanderbunch/App dummy/angry-apple-tree"

# Sync all files to S3
aws s3 sync . s3://$MAIN_BUCKET \
  --exclude ".git/*" \
  --exclude ".agent/*" \
  --exclude "node_modules/*" \
  --exclude "*.md" \
  --exclude ".DS_Store"
```

### Upload Space Badger Game:
```bash
cd "/Users/alexanderbunch/App dummy/space-invaders/dist"

# Sync the built game files to S3
aws s3 sync . s3://$GAME_BUCKET
```

## Step 5: Set Up CloudFront (CDN) - Optional but Recommended

CloudFront provides:
- HTTPS support
- Better performance (caching)
- Custom domain support

### Create CloudFront Distribution for Main Website:

1. Go to AWS Console → CloudFront → Create Distribution
2. **Origin Settings**:
   - Origin Domain: Select your S3 bucket endpoint (e.g., `angryappletree-website.s3-website-us-east-1.amazonaws.com`)
   - Origin Path: Leave empty
3. **Default Cache Behavior**:
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Allowed HTTP Methods: GET, HEAD
4. **Settings**:
   - Default Root Object: `index.html`
5. Click "Create Distribution"

### Create CloudFront Distribution for Game:

Repeat the same process for the game bucket.

**Note**: CloudFront distributions can take 15-20 minutes to deploy.

## Step 6: Update Game Link in Main Website

Once your CloudFront distributions are created:

1. Get the CloudFront domain name for the game (e.g., `d1234567890.cloudfront.net`)
2. Update `index.html` in the main website:
   ```html
   <!-- Change this line in the Games section -->
   <a href="https://YOUR-GAME-CLOUDFRONT-DOMAIN.cloudfront.net/" target="_blank" class="game-card">
   ```
3. Re-upload the updated `index.html`:
   ```bash
   aws s3 cp index.html s3://$MAIN_BUCKET/
   ```

## Step 7: Custom Domain (Optional)

If you have a custom domain:

1. **Route 53**:
   - Create a hosted zone for your domain
   - Add A record (Alias) pointing to CloudFront distribution

2. **SSL Certificate**:
   - Request a certificate in AWS Certificate Manager (ACM)
   - Must be in `us-east-1` region for CloudFront
   - Validate the certificate via DNS or email

3. **Update CloudFront**:
   - Add your custom domain as an Alternate Domain Name (CNAME)
   - Select your SSL certificate

## Step 8: Invalidate CloudFront Cache (When Updating)

When you update files, you need to invalidate the CloudFront cache:

```bash
# Get your distribution ID
aws cloudfront list-distributions --query "DistributionList.Items[*].[Id,DomainName]" --output table

# Invalidate all files
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Quick Update Script

Create a script to quickly update your website:

```bash
#!/bin/bash
# save as deploy.sh

MAIN_BUCKET="angryappletree-website"
GAME_BUCKET="angryappletree-spacegame"
MAIN_DIST_ID="YOUR_MAIN_DISTRIBUTION_ID"
GAME_DIST_ID="YOUR_GAME_DISTRIBUTION_ID"

echo "Uploading main website..."
cd "/Users/alexanderbunch/App dummy/angry-apple-tree"
aws s3 sync . s3://$MAIN_BUCKET --exclude ".git/*" --exclude ".agent/*" --exclude "node_modules/*"

echo "Building and uploading game..."
cd "/Users/alexanderbunch/App dummy/space-invaders"
npm run build
aws s3 sync dist/ s3://$GAME_BUCKET

echo "Invalidating CloudFront caches..."
aws cloudfront create-invalidation --distribution-id $MAIN_DIST_ID --paths "/*"
aws cloudfront create-invalidation --distribution-id $GAME_DIST_ID --paths "/*"

echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

## Costs

- **S3**: ~$0.023 per GB stored + $0.09 per GB transferred
- **CloudFront**: First 1TB/month is free, then ~$0.085 per GB
- **Route 53** (if using custom domain): $0.50 per hosted zone per month

For a small website, expect costs under $5/month.

## Troubleshooting

### Issue: 403 Forbidden
- Check bucket policy allows public read
- Verify files were uploaded correctly

### Issue: 404 Not Found
- Check index document is set to `index.html`
- Verify file paths are correct (case-sensitive)

### Issue: Game not loading
- Check CORS settings if game makes API calls
- Verify all game assets were uploaded
- Check browser console for errors

## Alternative: Simpler Deployment with Netlify/Vercel

If AWS seems complex, consider these alternatives:

### Netlify (Easiest):
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Deploy: `netlify deploy --prod`
3. Follow prompts to link your site

### Vercel:
1. Install Vercel CLI: `npm install -g vercel`
2. Deploy: `vercel --prod`
3. Follow prompts

Both services offer:
- Free tier
- Automatic HTTPS
- Custom domains
- Continuous deployment from Git

---

**Need Help?** Check AWS documentation or contact support at alex.bunch@angryappletree.com
