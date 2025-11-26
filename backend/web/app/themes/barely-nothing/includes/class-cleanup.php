<?php

declare(strict_types=1);

namespace BarelyNothing;

/**
 * Class Cleanup
 *
 * Handles cleanup of unnecessary elements from the theme.
 */
class Cleanup
{
    public function __construct()
    {
        // Add cleanup actions here
        add_action('admin_init', $this->removePostTypeSupports(...));
        add_action('admin_menu', $this->removeMenuComments(...));
        add_action('init', $this->removeCommentsFromAdminBar(...));
        add_filter('rest_endpoints', $this->disableUserEndpoints(...));
        add_filter('comments_open', '__return_false', 20, 2);
        add_filter('pings_open', '__return_false', 20, 2);
        add_filter('comments_array', '__return_empty_array', 10, 2);
    }

    public function removePostTypeSupports(): void
    {
        global $pagenow;

        if ($pagenow === 'edit-comments.php') {
            wp_safe_redirect(admin_url());
            exit;
        }

        // Remove comments metabox from dashboard
        remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');

        // Disable support for comments and trackbacks in post types
        foreach (get_post_types() as $post_type) {
            if (post_type_supports($post_type, 'comments')) {
                remove_post_type_support($post_type, 'comments');
                remove_post_type_support($post_type, 'trackbacks');
            }
        }
    }

    private function removeMenuComments(): void
    {
        remove_menu_page('edit-comments.php');
    }

    private function removeCommentsFromAdminBar(): void
    {
        if (is_admin_bar_showing()) {
            remove_action('admin_bar_menu', 'wp_admin_bar_comments_menu', 60);
        }
    }

    private function disableUserEndpoints(array $endpoints): array
    {
        if (!is_user_logged_in()) {
            unset($endpoints['/wp/v2/users']);
            unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
        }

        return $endpoints;
    }
}
