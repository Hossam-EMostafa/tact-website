tact website v5.7: upload package (main link)

index.html IS the v5.7 site, so it goes live on the main link as soon as it is committed.
  https://tact-website-git-main-matef-1420.vercel.app/       -> v5.7
  https://tact-website-git-main-matef-1420.vercel.app/v5-7   -> v5.7 (same file)
  https://tact-website-git-main-matef-1420.vercel.app/v5-6   -> previous version (backup, already in the repo)

How to upload
1. Open github.com/Hossam-EMostafa/tact-website on the main branch.
2. Click Add file, then Upload files.
3. Drag in everything inside this folder, including the assets folder. GitHub will say index.html, v5-7.html, the -v5-7 scripts and some assets are replaced. That is expected.
4. Commit message: "v5.7 final: index.html live". Commit to main.
5. Vercel redeploys on its own in about a minute. Hard-refresh the site (Ctrl+Shift+R) to skip the browser cache.

Files
- index.html and v5-7.html: the v5.7 site
- support-v5-7.js, tact-ar-*-v5-7.js, image-slot-v5-7.js, tact-logo-anim-v5-7.js: the scripts v5.7 uses
- assets/: every image, logo, font, video and certificate the site uses, including the new ones
  (Effra font, ISO certificate thumbnails, Health Holding logo, Wirth booth photo)

v5-6.html is not in this folder because it is already in the repo and stays untouched.
