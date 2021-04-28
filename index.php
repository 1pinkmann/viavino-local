<?php

$version             = '1.0.2';
// $base_url            = in_array( $_SERVER['REMOTE_ADDR'], [ '127.0.0.1', '::1' ] ) ? 'http://viavino/viavino-html' : 'https://viavino.it';
$base_url            = in_array( $_SERVER['REMOTE_ADDR'], [ '127.0.0.1', '::1' ] ) ? 'http://viavino/' : 'https://viavino.preview.ee/';
$available_languages = [ 'en', 'it' ];
$default_language    = current( $available_languages );

if ( ! empty( $_GET['language'] ) && ( $_GET['language'] === $default_language || ! in_array( $_GET['language'], $available_languages ) ) ) {
    return http_response_code( 404 );
}

$current_language = $_GET['language'] ?? $default_language;

include __DIR__ . '/translations/' . $current_language . '.php';
include __DIR__ . '/templates/index.phtml';
