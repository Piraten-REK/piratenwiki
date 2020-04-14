<?php

/**
 * Piraten Wiki
 *
 * @package piratenwiki
 * @author Mike Kühnapfel <mailto:mike.kuehnapfel@piraten-rek.de>
 * @copyright 2020 Mike Kühnapfel
 * @license GPL-3.0-or-later
 * @version 1.0.0
 *
 * @wordpress-plugin
 * Plugin Name: Piraten Wiki
 * Plugin URI: https://github.com/veyxos/nostrasponte-municipality
 * Description: Fügt einen Wikki-Block zu gutenberg hinzu, der es ermöglicht eine Seite des Piraten-Wiki anzuzeigen
 * Version: 1.0.0
 * Requires at least: 5.0
 * Requires PHP: 7.2
 * Author: Mike Kühnapfel
 * Author URI: mailto:mike.kuehnapfel@piraten-rek.de
 * License: GNU General Public License 3.0 or later
 * License URI: http://www.gnu.org/licenses/gpl-3.0
 * Text Domain: piratenwiki
 */

if (!function_exists('add_action')) {
	die("Hi there! I'm just a plugin not much I can do when called directly.");
}

define('PIWI_PLUGIN_URL', __FILE__);

// Includes
include('includes/activate.php');
include('blocks/enqueue.php');

// Hooks
register_activation_hook(__FILE__, 'piwi_activate_plugin');
add_action('enqueue_block_editor_assets', 'piwi_enqueue_block_editor_assets');