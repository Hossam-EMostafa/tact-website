=== Tact Splash & Loader ===
Version: 1.1.0
Requires at least: 6.0
Requires PHP: 7.4
License: GPL-2.0-or-later

Five splash and matching loader directions from Tact Splash Options: Assembly, Pattern field, Aperture, Line drawing, Bounce.

INSTALLATION
Upload tact-splash.zip through Plugins > Add New > Upload Plugin and activate it.
Choose a direction under Settings > Tact Splash. Assembly is the default.
Remove the old wp-content/mu-plugins/tact-assembly.php if migrating an older installation; do not run both versions.

All logos, SVG geometry, animation scripts and styles are bundled. No GreenShift, uploads folder, CDN, or local development path is required by this plugin.
Migrating the database carries the selection in the tact_splash_settings option. A fresh installation defaults to enabled / Assembly.

Preview buttons require administrator permission and a nonce; previews do not change the saved selection and send no-cache headers. Clear any hosting/CDN page cache after changing styles.
The splash plays on every full page load and opens onto the real page instead of the prototype photo. Original direction timings, colour palettes, geometry and loader loops are preserved.
Reduced-motion preferences skip the splash and use a static loading mark. A CSS timeout reveals content if JavaScript fails. Deactivation leaves preferences stored, so reactivation restores them.

INTEGRATION
Dispatch tact:loading and tact:loaded on window to show/hide the matching loading indicator for custom asynchronous work. Ordinary same-origin page links show the loading indicator during navigation. Downloads, anchors, modified clicks and external links are excluded.
For compatibility with the Tact homepage, the splash retains the tact-assembly-splash element ID and dispatches tact:assembly-ready when finished, with window.tactAssemblyReady set to true.
Before exposing any page content, it dispatches tact:assembly-reveal synchronously and sets window.tactAssemblyRevealing. Initialize page entrance animations on this event, rather than waiting for tact:assembly-ready, to prevent a finished-layout flash followed by an animation reset.

CHANGELOG
1.1.0: Coordinate page initialization with the start of the splash reveal, before the overlay opens. Updated Tact homepage integration restarts hero entrance animations once during this handoff.
