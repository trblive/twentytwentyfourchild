<?php

if (!class_exists('StyleHandler')) {

	class StyleHandler {

		private static $instance;
		private array $block_names = [];
		private string $prefix = 'child_theme';
		private string $style_dir;
		private string $style_url;

		public static function init(): StyleHandler {
			if ( null === self::$instance ) {
				self::$instance = new self;
			}
			return self::$instance;
		}

		public function __construct() {
			$upload_dir = wp_upload_dir();

			$this->style_dir = $upload_dir['basedir'] . '/' . $this->prefix . DIRECTORY_SEPARATOR;
			$this->style_url = set_url_scheme( $upload_dir[ 'baseurl' ] ) . '/' . $this->prefix . '/';
			$this->block_names = ['core/button', 'core/image'];

			add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend_styles']);
			add_action( 'save_post', [ $this, 'get_save_content' ], 10, 2 );
			add_action('wp', [$this, 'generate_post_content']);
		}

		public function get_hex_value($color_name) {
			$palette = wp_get_global_settings( array( 'color', 'palette', 'theme' ) );
			$hex = '';

			foreach ($palette as $color) {
				$slug = $color['slug'];

				if ($color_name === $slug) {
					$hex = $color['color'];
				}
			}
			return $hex;
		}

		private function fetch_block_styles($blocks, &$blockName): string {
			$styles = '';
			if (count($blocks) > 0) {
				foreach ($blocks as $block) {
					if ($block['blockName'] === $blockName) {
						$attributes = $block['attrs'];
						$xValue = isset($attributes['xValue']) ? $attributes['xValue'] . 'px' : '0px';
						$yValue = isset($attributes['yValue']) ? $attributes['yValue'] . 'px' : '0px';
						$blur = isset($attributes['blur']) ? $attributes['blur'] . 'px' : '';
						$spread = isset($attributes['spread']) ? $attributes['spread'] . 'px' : '';
						$shadowColor = isset($attributes['shadowColor']) ? $this->get_hex_value($attributes['shadowColor']) : '';

						$separators = '';
						if (isset($attributes['className'])) {
							$classNames = explode(' ', $attributes['className']);
							foreach ($classNames as $className) {
								$separators .= '.' . $className;
							}
						}

						if (!empty($separators) && !empty($shadowColor)) {
							$styles .= $separators . ' > * { box-shadow: ' . $xValue . ' ' . $yValue . ' ' . $blur . ' ' . $spread . ' ' . $shadowColor . '; } ';
						}
					} else {
						if (isset($block['innerBlocks']) && count($block['innerBlocks']) > 0) {
							$styles .= self::fetch_block_styles( $block['innerBlocks'], $blockName );

						}
					}
				}
			}
			return $styles;
		}

		public function get_save_content($post, $post_id) {
			$post_type = get_post_type($post_id);
			$parent_id = wp_is_post_revision( $post_id);

			if ( false !== $parent_id ) {
				$post_id = $parent_id;
			}

			//return if draft
			if ( isset( $post->post_status ) && 'auto-draft' == $post->post_status ) {
				return;
			}

			// auto save, do nothing
			if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
				return;
			}

			if ( $post_type === 'wp_template_part' || $post_type === 'wp_template' ) {
				$post = get_post( $post_id );
				$blocks = parse_blocks( $post->post_content );

			} else {
				$blocks = parse_blocks( $post->post_content );
			}

			if (is_array($blocks) && !empty($blocks)) {
				$this->generate_css($post, $blocks);
			}
		}

		public function generate_post_content(): void {

			$post_id = get_the_ID();

			if (!$post_id) {
				$post_id = get_option('page_on_front');
			}

			if ($post_id) {

				$post_type = get_post_type( $post_id );
				$post      = get_post( $post_id );
				$parent_id = wp_is_post_revision( $post_id);

				if ( false !== $parent_id ) {
					$post_id = $parent_id;
				}

				//return if draft
				if ( isset( $post->post_status ) && 'auto-draft' == $post->post_status ) {
					return;
				}

				// auto save, do nothing
				if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
					return;
				}

				if ( $post_type === 'wp_template_part' || $post_type === 'wp_template' ) {
					$post = get_post( $post_id );
					$blocks = parse_blocks( $post->post_content );

				} else {
					$blocks = parse_blocks( $post->post_content );
				}

				if (is_array($blocks) && !empty($blocks)) {
					$this->generate_css($post, $blocks);
				}
			}
		}

		public function generate_css($post, $blocks): void {
			$blockNames = $this->block_names;
			$css = '';
			foreach ($blockNames as $blockName) {
				$css .= $this->fetch_block_styles($blocks, $blockName);
			}

			if (!empty ($css)) {
				if (!is_dir( $this->style_dir )) {
					wp_mkdir_p( $this->style_dir );
				}
				file_put_contents($this->style_dir . $this->prefix . '_' . abs($post->ID) . '.css', $css);
			}
		}

		public function enqueue_frontend_styles(): void {
			global $post;

			if ( ! empty( $post ) && ! empty( $post->ID ) ) {

				if ( file_exists( $this->style_dir . $this->prefix . '_' . abs($post->ID) . '.css' ) ) {
					wp_enqueue_style(
						'child-custom-styles-' . $post->ID,
						$this->style_url . $this->prefix . '_' . abs($post->ID) . '.css');
				}
			}
		}
	}
	StyleHandler::init();
}