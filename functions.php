<?php

add_action( 'wp_enqueue_scripts', function () {

	wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
	wp_enqueue_style( 'child-style',
		get_stylesheet_directory_uri() . '/style.css',
		array( 'parent-style' ),
		wp_get_theme()->get('Version')
	);

} );

add_action('enqueue_block_editor_assets', function() {
	wp_enqueue_script('gutenberg-filters', get_template_directory_uri() . 'child/build/index.js');
});




add_action('admin_enqueue_scripts', function () {
	wp_enqueue_style('editor-style',
		get_stylesheet_directory_uri() . '/style.css',
		array( 'parent-style' ),
		wp_get_theme()->get('Version')
	);
});
