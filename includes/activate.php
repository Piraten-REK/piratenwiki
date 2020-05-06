<?php

/**
 * @package piratenwiki
 */

/**
 * Activation function that checks for compatible wordpress version
 * @uses version_compare()
 * @uses get_bloginfo()
 * @uses wp_die()
 * @uses __()
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function piwi_activate_plugin() {
	if (version_compare(get_bloginfo('version'), '5.0', '<')) {
		wp_die(__('You must update wordpress to use this plugin.', 'piwi'));
	}
}