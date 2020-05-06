<?php
/**
 * @package piratenwiki
 */

/**
 * Enqueue scripts for Piratenwiki Gutenberg Block
 * @uses wp_register_script()
 * @uses plugins_url()
 * @uses plugin_dir_path()
 * @uses wp_enqueue_scripts()
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function piwi_enqueue_block_editor_assets() {
	wp_register_script(
'piwi_blocks_bundle',
		plugins_url('blocks/dist/bundle.js', PIWI_PLUGIN_URL),
		[ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor', 'wp-api' ],
		filemtime(plugin_dir_path(PIWI_PLUGIN_URL) . '/blocks/dist/bundle.js')
	);

	wp_enqueue_script('piwi_blocks_bundle');
}