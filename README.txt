tact website v5.7 — upload package

Nothing in this folder replaces a file that is already in the repo, so index.html (the current live site) stays as it is.

How to upload
1. Open github.com/Hossam-EMostafa/tact-website on the main branch.
2. Click Add file > Upload files.
3. Drag in everything inside this folder (the v5-7.html file, the six -v5-7.js files and the assets folder). Keep the assets folder structure.
4. Commit message: "Add v5.7 preview at /v5-7". Commit directly to main.
5. Vercel redeploys on its own. v5.7 will be at  https://<your-vercel-domain>/v5-7
   The current site stays at  https://<your-vercel-domain>/

What is included
- v5-7.html: the full v5.7 site
- support-v5-7.js, tact-ar-*-v5-7.js, image-slot-v5-7.js, tact-logo-anim-v5-7.js: the scripts v5.7 needs, renamed so the files index.html uses are not overwritten
- assets/: only the files the repo does not have yet (promo film, calendar video and images, ISO PDFs)

When you want v5.7 to become the main site, replace index.html with v5-7.html. Keep a copy of the old index.html as v5-6.html first.
