<?php
/**
 * @package piratenwiki
 */

/**
 * Function that handles the AJAX requests for wiki pages
 * @uses wp_json_encode()
 * @uses wp_remote_get()
 * @uses wp_remote_retrieve_body()
 * @uses wp_remote_retrieve_response_code()
 * @uses status_header()
 * @uses wp_die()
 *
 * @author Mike Kühnapfel <mike.kuehnapfel@piraten-rek.de>
 * @since 1.0.0
 * @version 1.0.0
 */
function piwi_ajax() {
	/** @staticvar int $json_opts Encoding options fpr JSON */
	static $json_opts = JSON_NUMERIC_CHECK|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE;

	header('Content-Type: application/json; cahrset=UTF-8');

	// return http status 400 if no page is provided
	if (!isset($_POST['page'])) {
		echo wp_json_encode([
			'status' => 400,
			'reason' => 'No page provided'
		], $json_opts);
		status_header(400);
		wp_die();
	}

	// Get XML version of the requested wiki page
	$res = wp_remote_get('https://wiki.piratenpartei.de/Spezial:Exportieren/' . $_POST['page']);
	$status = wp_remote_retrieve_response_code($res);
	$body = wp_remote_retrieve_body($res);

	// return http status 502 on remote failure
	if (!preg_match('/2\d{2}/', strval($status))) {
		status_header(502);
		echo wp_json_encode([
			'status' => 502,
			'retrieved_data' => $body
		], $json_opts);
	}

	// parse XML
	$parser = xml_parser_create();
	$values = [];
	$index = [];
	xml_parse_into_struct($parser, $body, $values, $index);

	echo wp_json_encode([
		'title' => array_slice($values, $index['TITLE'][0], 1)[0]['value'],
		'url' => 'https://wiki.piratenpartei.de/' . $_POST['page'],
		'last_edited' => [
			'raw' => array_slice($values, $index['TIMESTAMP'][0], 1)[0]['value'],
			'formatted' => DateTime::createFromFormat('Y-m-d\TH:i:s\Z', array_slice($values, $index['TIMESTAMP'][0], 1)[0]['value'])->format(get_option('date_format') . ' ' . get_option('time_format'))
		],
		'content' => array_slice($values, $index['TEXT'][0], 1)[0]['value']
	], $json_opts);

	wp_die();
}