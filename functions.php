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
	wp_enqueue_script('gutenberg-filters', get_template_directory_uri() . 'child/build/index.js', ['wp-edit-post']);
});

add_action('admin_enqueue_scripts', function () {
	wp_enqueue_style('editor-style',
		get_stylesheet_directory_uri() . '/style.css',
		array( 'parent-style' ),
		wp_get_theme()->get('Version')
	);
});

// register widget area for use with classic themes
add_action('widgets_init', function () {
	register_sidebar(array(
		'id' => 'primary',
		'name' => __('Test widget'),
		'description' => 'this is a test widget',
		'before_widget' => '<div id="%1$s" class="child_theme_widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	));
});

// register custom Gutenberg template part area
add_filter('default_wp_template_part_areas', function(array $areas) {
	$areas[] = array(
		'area'        => 'widget',
		'area_tag'    => 'div',
		'label'       => __( 'Widget area' ),
		'description' => __( 'Template area for widgets.' ),
		'icon'        => 'sidebar'
	);

	return $areas;
});

require_once 'style-handler.php';

