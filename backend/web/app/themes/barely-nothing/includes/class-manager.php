<?php

declare(strict_types=1);

namespace BarelyNothing;

/**
 * Class Manager
 *
 * Manages theme setup and configurations.
 */
class Manager
{
    public function __construct()
    {
        add_action('after_setup_theme', $this->themeSetup(...));
        add_action('init', $this->contentTypes(...));
        add_shortcode('nb_years_experience', $this->yearsOfExperience(...));
        add_shortcode('nb_years_barnemax', $this->age(...));
        add_filter('graphql_response_headers_to_send', $this->restrictGraphqlOrigins(...));
    }

    private function yearsOfExperience(): int
    {
        $start_year = 2016;

        return \intval(date('Y')) - $start_year;
    }

    private function age(): int
    {
        $birthdate = new \DateTime('1993-05-06');

        return (new \DateTime())->diff($birthdate)->y;
    }

    private function restrictGraphqlOrigins(array $headers): array
    {
        $allowed_origins = array_filter([
            rtrim(getenv('WP_FRONTEND_URL') ?: '', '/'),
            rtrim(getenv('WP_FRONTEND_URL_ALT') ?: '', '/'),
        ]);

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if (in_array($origin, $allowed_origins, true)) {
            $headers['Access-Control-Allow-Origin'] = $origin;
        }

        header_remove('Cache-Control');
        header_remove('Pragma');
        header_remove('Expires');

        return $headers;
    }

    private function themeSetup(): void
    {
        // Add theme support for various features
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
    }

    private function contentTypes(): void
    {
        // Register a custom post type as an example
        register_post_type('project', [
            'labels' => [
                'name' => __('Projects'),
                'singular_name' => __('Project'),
            ],
            'public' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-image-filter',
            'has_archive' => true,
            'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
            'graphql_single_name' => 'project',
            'graphql_plural_name' => 'projects',
            'show_in_graphql' => true,
        ]);

        // Register a custom taxonomy as an example
        register_taxonomy('project_type', 'project', [
            'labels' => [
                'name' => __('Project Types'),
                'singular_name' => __('Project Type'),
            ],
            'hierarchical' => true,
            'show_in_rest' => true,
            'show_in_graphql' => true,
            'graphql_single_name' => 'projectType',
            'graphql_plural_name' => 'projectTypes',
        ]);
    }
}
