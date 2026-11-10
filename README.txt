Tact website v5.7

Static site. index.html is the homepage copied from the supplied local v5.7
package; v5-7.html is the equivalent versioned entry point.

Deploy the files in this repository root. Vercel serves clean URLs and does not
rewrite the homepage to a versioned or archived page. Assets use revalidation
because filenames are reused across releases.

Production website: https://tact-website-ochre.vercel.app
The existing production branch is merged normally with main before publishing.
Do not recreate the Vercel project or change DNS.

Local preview: python3 -m http.server 8765

Known source omission: Tact Booth 3D v2.html is referenced by the supplied
Services page but is absent from the supplied package. Its broken link is
omitted from both entry points pending the matching new file. No old booth
page or v5.6 page is retained. The source package is therefore incomplete for
the standalone booth feature.

Keep .env files, .vercel metadata and external backups out of Git.

Additional source limitations found in browser testing: the calendar has
English text in Arabic mode, and its PDF download button links back to the
calendar route without a downloadable PDF. These source features remain
incomplete. Contact forms were not submitted during verification.

An empty image-slots.state.json supplies the optional image-slot state omitted
from the source package; its script uses this public path to avoid a 404.
