<?php
/**
 * Plugin Name: Tact Splash & Loader
 * Description: Six Tact splash and loader directions with a site-wide style selector, including the v5.7 Brand Logo Build.
 * Version: 1.2.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: Tact
 * License: GPL-2.0-or-later
 */
defined('ABSPATH') || exit;

final class Tact_Splash_Plugin {
    const OPTION = 'tact_splash_settings';
    public static function styles() {
        return [
            'a' => ['1a — Assembly', 'Six pieces assemble, the wordmark rises, and a curtain reveals the page.', '4.3s'],
            'b' => ['1b — Pattern field', 'A wave of geometric shapes clears as the mark forms.', '4.35s'],
            'c' => ['1c — Aperture', 'The pieces orbit into place and a circular opening reveals the page.', '4.4s'],
            'd' => ['1d — Line drawing', 'Outlines draw the mark and wordmark before filling with colour.', '4.3s'],
            'e' => ['1e — Bounce', 'The disc bounces through the mark, then expands into the page reveal.', '4.85s'],
            'f' => ['1f — Brand Logo Build (v5.7)', 'Eighteen-piece brand mark and wordmark assemble following the brand video.', '3.6s'],
        ];
    }
    public static function settings() {
        $value = get_option(self::OPTION, ['enabled' => 1, 'style' => 'f']);
        $value = is_array($value) ? $value : [];
        $style = isset($value['style']) && is_string($value['style']) ? $value['style'] : 'a';
        if ($style === 'v57') $style = 'f';
        if ($style === 'v57') $style = 'f';
        return ['enabled' => !empty($value['enabled']), 'style' => isset(self::styles()[$style]) ? $style : 'a', 'frequency' => ($value['frequency'] ?? 'session') === 'always' ? 'always' : 'session'];
    }
    public static function sanitize($value) {
        $value = is_array($value) ? $value : [];
        $style = isset($value['style']) && is_string($value['style']) ? $value['style'] : 'a';
        return ['enabled' => empty($value['enabled']) ? 0 : 1, 'style' => isset(self::styles()[$style]) ? $style : 'a', 'frequency' => ($value['frequency'] ?? 'session') === 'always' ? 'always' : 'session'];
    }
    public static function preview_style() {
        if (!current_user_can('manage_options') || !isset($_GET['tact_splash_preview'], $_GET['_wpnonce'])) return '';
        if (!is_string($_GET['tact_splash_preview']) || !is_string($_GET['_wpnonce'])) return '';
        $style = sanitize_key(wp_unslash($_GET['tact_splash_preview']));
        return isset(self::styles()[$style]) && wp_verify_nonce(sanitize_text_field(wp_unslash($_GET['_wpnonce'])), 'tact_splash_preview') ? $style : '';
    }
    public static function active_style() {
        $preview = self::preview_style();
        if ($preview) return $preview;
        $settings = self::settings();
        return $settings['enabled'] ? $settings['style'] : '';
    }
    public static function assets() {
        if (!self::active_style()) return;
        $url = plugin_dir_url(__FILE__) . 'assets/';
        wp_enqueue_style('tact-splash', $url . 'splash.css', [], '1.2.0');
        wp_enqueue_script('tact-splash-directions', $url . 'directions.js', [], '1.2.0', true);
        wp_enqueue_script('tact-splash', $url . 'splash.js', ['tact-splash-directions'], '1.2.0', true);
    }
    public static function early_session() {
        if (!self::active_style()) return;
        $session = !self::preview_style() && self::settings()['frequency'] === 'session';
        echo '<script>window.tactSplashSession=' . ($session ? 'true' : 'false') . ';if(window.tactSplashSession){try{if(sessionStorage.getItem("tact-splash-seen")==="1"){document.documentElement.classList.add("tact-splash-skip");window.tactAssemblyReady=true;window.tactAssemblyRevealing=true;}}catch(e){}}</script>';
        echo '<style>html.tact-splash-skip #tact-assembly-splash{display:none!important}</style>';
    }
    public static function markup() {
        static $printed = false;
        $style = self::active_style();
        if ($printed || !$style) return;
        $printed = true;
        $html = file_get_contents(__DIR__ . '/assets/' . $style . '.html');
        // Only bundled static templates and an escaped plugin URL are output.
        echo str_replace('{{ASSETS}}', esc_url(plugin_dir_url(__FILE__) . 'assets/'), $html);
    }
    public static function admin() {
        add_options_page('Tact Splash & Loader', 'Tact Splash', 'manage_options', 'tact-splash', [__CLASS__, 'page']);
    }
    public static function register() {
        register_setting('tact_splash', self::OPTION, ['type' => 'array', 'sanitize_callback' => [__CLASS__, 'sanitize'], 'default' => ['enabled' => 1, 'style' => 'f']]);
    }
    public static function page() {
        if (!current_user_can('manage_options')) return;
        $settings = self::settings(); ?>
        <div class="wrap"><h1>Tact Splash &amp; Loader</h1>
        <p>Choose one direction for the splash and its matching loader across your website. Previews open in a new tab without changing the saved style.</p>
        <?php settings_errors(); ?>
        <form action="options.php" method="post">
        <?php settings_fields('tact_splash'); ?>
        <p><label><input type="checkbox" name="tact_splash_settings[enabled]" value="1" <?php checked($settings['enabled']); ?>> Enable splash and loader on all pages</label></p>
        <p><label for="tact-splash-frequency">Play splash</label> <select id="tact-splash-frequency" name="tact_splash_settings[frequency]">
        <option value="session" <?php selected($settings['frequency'], 'session'); ?>>Once per browser session</option>
        <option value="always" <?php selected($settings['frequency'], 'always'); ?>>On every page load</option>
        </select></p>
        <fieldset><legend class="screen-reader-text">Splash direction</legend>
        <?php foreach (self::styles() as $key => $style) : ?>
        <div style="max-width:760px;background:#fff;border:1px solid #c3c4c7;border-radius:6px;padding:18px;margin:14px 0;">
            <label><input type="radio" name="tact_splash_settings[style]" value="<?php echo esc_attr($key); ?>" <?php checked($settings['style'], $key); ?>> <strong><?php echo esc_html($style[0]); ?></strong></label>
            <p><?php echo esc_html($style[1] . ' Splash: ' . $style[2] . '.'); ?></p>
            <a class="button" target="_blank" rel="noopener" href="<?php echo esc_url(wp_nonce_url(add_query_arg('tact_splash_preview', $key, home_url('/')), 'tact_splash_preview')); ?>">Preview <?php echo esc_html($style[0]); ?> <span class="screen-reader-text">(opens in a new tab)</span></a>
        </div>
        <?php endforeach; ?></fieldset>
        <p>The loader remains available between pages. Previews always play the selected splash. Reduced-motion visitors skip it. Deactivating this plugin removes both the splash and loader.</p>
        <?php submit_button(); ?></form></div>
        <?php
    }
}
add_action('admin_menu', ['Tact_Splash_Plugin', 'admin']);
add_action('admin_init', ['Tact_Splash_Plugin', 'register']);
add_action('wp_enqueue_scripts', ['Tact_Splash_Plugin', 'assets']);
add_action('wp_body_open', ['Tact_Splash_Plugin', 'markup'], 1);
add_action('wp_footer', ['Tact_Splash_Plugin', 'markup'], 1);
add_action('template_redirect', function () { if (Tact_Splash_Plugin::preview_style()) { if (!defined('DONOTCACHEPAGE')) define('DONOTCACHEPAGE', true); nocache_headers(); } });
add_filter('plugin_action_links_' . plugin_basename(__FILE__), function ($links) { array_unshift($links, '<a href="' . esc_url(admin_url('options-general.php?page=tact-splash')) . '">Settings</a>'); return $links; });

add_action('wp_head', ['Tact_Splash_Plugin', 'early_session'], 0);
add_action('update_option_tact_splash_settings', function () { if (function_exists('wp_cache_clear_cache')) wp_cache_clear_cache(); });
