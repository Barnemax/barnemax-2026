<?php

/**
 * Plugin Name: Bedrock Custom Login URL
 * Description: Custom login URL for Bedrock (replaces wps-hide-login)
 */

define('CUSTOM_LOGIN_SLUG', 'grenier');
define('CUSTOM_LOGIN_SECRET', 'grenier_access');

add_action('init', function () {
    $request_uri = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

    // Handle custom login slug - set a session/cookie and redirect to real login
    if ($request_uri === CUSTOM_LOGIN_SLUG) {
        setcookie(CUSTOM_LOGIN_SECRET, '1', time() + 300, '/'); // 5 min access window
        wp_safe_redirect(site_url('wp-login.php'));
        exit;
    }

    // Block direct wp-login.php access unless coming from custom slug
    if (preg_match('/wp-login\.php/', $request_uri)) {
        // Allow if cookie is set (came from /grenier)
        if (isset($_COOKIE[CUSTOM_LOGIN_SECRET])) {
            return;
        }
        // Allow logout action
        if (isset($_GET['action']) && $_GET['action'] === 'logout') {
            return;
        }
        // Allow POST (form submission)
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            return;
        }
        // Block and redirect to home
        wp_safe_redirect(home_url('/'));
        exit;
    }
});

// Redirect to wp-admin after login
add_filter('login_redirect', function ($redirect_to, $requested_redirect_to, $user) {
    // Clear the access cookie
    setcookie(CUSTOM_LOGIN_SECRET, '', time() - 3600, '/');

    if (empty($requested_redirect_to) || $requested_redirect_to === home_url('/')) {
        return admin_url();
    }
    return $redirect_to;
}, 10, 3);
