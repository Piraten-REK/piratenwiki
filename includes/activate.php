<?php

/**
 * @package nostrasponte_municipality
 */

/**
 * Activation function that checks for compatible wordpress version
 * @since 1.0.0
 */
function piwi_activate_plugin() {
	if (version_compare(get_bloginfo('version'), '5.0', '<')) {
		wp_die(__('You must update wordpress to use this plugin.', 'nostrasponte_municipality'));
	}
}