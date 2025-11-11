# Nicolas Cage Fan Page (static)

This repository contains a small static fan page built with vanilla HTML, CSS, and JavaScript.

Pages included:

- `index.html` — Home / welcome
- `bio.html` — Short biography
- `about.html` — About this demo site
- `films.html` — Films & awards (renders `data/films.json` client-side)

How to run locally (using npx live-server):

This uses `npx` so you don't need to install a global package. Make sure you have Node.js and npm installed.

```bash
# from the repository root
# runs a simple static server with live reload on port 8080
npx live-server --port=8080
# then open http://localhost:8080/index.html in your browser
```

If you prefer a global install instead of `npx`, run:

```bash
# install globally (optional)
npm install -g live-server
live-server --port=8080
```

Notes:

- This is a demo/fan page for learning purposes. The site currently uses placeholder images (from picsum.photos) as visual examples.
- If you want photos of Nicolas Cage specifically, make sure to use properly licensed images — do not upload or publish copyrighted photos without permission. Replace image URLs in `data/films.json` and the `src` of the profile image in `bio.html` with your own licensed files (or host them in `assets/images/`).
- The films list is a small curated JSON sample in `data/films.json` and is used by `assets/js/main.js`.

To replace placeholders with local images:

1. Create `assets/images/` and add images (e.g., `leaving-las-vegas.jpg`).
2. Update `data/films.json` to point to `/assets/images/leaving-las-vegas.jpg` instead of the picsum URL.

## Deploying to AWS S3 (public URL)

These steps publish the static site to an S3 bucket and make it available at a public URL. This guide uses the AWS CLI (`aws`). Make sure you have an AWS account and the AWS CLI installed and configured (`aws configure`).

Important notes before you begin:
- Bucket names must be globally unique.
- AWS S3 static website endpoints serve over HTTP. For HTTPS or a custom domain, use CloudFront in front of the bucket (steps below).
- Review the security implications of making a bucket public. Consider using CloudFront + Origin Access Identity for more secure setups.

1) Configure AWS CLI (if not already):

```bash
aws configure
# Enter AWS Access Key ID, Secret Access Key, default region (e.g. us-east-1), and output format
```

2) Create the S3 bucket (replace with your unique name and chosen region):

```bash
BUCKET=my-unique-bucket-name
aws s3 mb s3://$BUCKET --region us-east-1
```

3) (Optional but likely necessary) Allow public access for the bucket by disabling the account-level/public block for this bucket:

```bash
aws s3api put-public-access-block --bucket $BUCKET \
	--public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
```

4) Add a bucket policy so objects are publicly readable (create `bucket-policy.json`):

bucket-policy.json:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadGetObject",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
		}
	]
}
```

Replace YOUR_BUCKET_NAME with your bucket name, then apply:

```bash
sed "s/YOUR_BUCKET_NAME/$BUCKET/" bucket-policy.json > /tmp/policy.json
aws s3api put-bucket-policy --bucket $BUCKET --policy file:///tmp/policy.json
```

5) Enable static website hosting (set index and error documents):

```bash
aws s3 website s3://$BUCKET --index-document index.html --error-document index.html
# To verify the website configuration:
aws s3api get-bucket-website --bucket $BUCKET
```

6) Upload the site files (from repo root). Use `--acl public-read` so objects are readable via HTTP:

```bash
aws s3 sync . s3://$BUCKET --exclude ".git/*" --acl public-read
```

7) Find your public URL
- Static website endpoint format (example):
	- http://$BUCKET.s3-website-us-east-1.amazonaws.com
- You can get the endpoint programmatically by checking the website configuration or visiting the S3 console.

Optional: Use CloudFront for HTTPS and custom domain
- Create a CloudFront distribution with the S3 Website Endpoint (or the S3 REST origin with Origin Access Identity). Configure an ACM certificate for your custom domain to enable HTTPS.
- After deployment you may need to invalidate the CloudFront cache when you push updates:

```bash
# replace DISTRIBUTION_ID with your CloudFront distribution id
aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/*"
```

Cleanup / updates
- To update the site, run the `aws s3 sync` command again. To remove files that no longer exist locally, include `--delete`.

Security reminder
- Making an S3 bucket public exposes its contents to everyone. For public static sites this is common, but if you want private storage with a public front (recommended), use CloudFront with Origin Access Identity and keep the bucket private.

Alternative deployment options (easier)
- GitHub Pages, Netlify, or Vercel can host static sites with HTTPS and CI/CD and typically require fewer manual steps.


