<?php
/**
 * @package piratenwiki
 */

/**
 * Enqueue scripts for requesting and parsing wiki pages
 * @uses wp_register_script()
 * @uses plugins_url()
 * @uses plugin_dir_path()
 * @uses wp_enqueue_scripts()
 * @uses wp_localize_script()
 * @uses admin_url()
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function piwi_enqueue_frontend_scripts() {
	wp_register_script(
		'piwi_wiki_loader',
		plugins_url('assets/js/wiki.min.js', PIWI_PLUGIN_URL),
		[],
		filemtime(plugin_dir_path(PIWI_PLUGIN_URL) . '/assets/js/wiki.min.js'),
		true
	);

	wp_enqueue_script('piwi_wiki_loader');

	// pass ajax url to javascript
	wp_localize_script('piwi_wiki_loader', 'piwi', [
		'ajax_url' => admin_url( 'admin-ajax.php' )
	]);
}