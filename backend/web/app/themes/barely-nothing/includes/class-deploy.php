<?php

declare(strict_types=1);

namespace BarelyNothing;

/**
 * Class Deploy
 *
 * Adds an admin bar button that triggers a frontend rebuild via deploy hook.
 */
class Deploy
{
    public function __construct()
    {
        add_action('admin_bar_menu', $this->addAdminBarButton(...), 100);
        add_action('admin_post_trigger_deploy', $this->triggerDeploy(...));
        add_action('admin_notices', $this->showDeployNotice(...));
    }

    private function addAdminBarButton(\WP_Admin_Bar $bar): void
    {
        if (current_user_can('manage_options') === false) {
            return;
        }

        if (empty($this->getHookUrl())) {
            return;
        }

        $bar->add_node([
            'id' => 'trigger-deploy',
            'title' => 'Deploy frontend',
            'href' => wp_nonce_url(admin_url('admin-post.php?action=trigger_deploy'), 'trigger_deploy'),
        ]);
    }

    private function triggerDeploy(): void
    {
        if (current_user_can('manage_options') === false) {
            wp_die('Unauthorized', '', ['response' => 403]);
        }

        check_admin_referer('trigger_deploy');

        $url = $this->getHookUrl();

        if (empty($url)) {
            wp_safe_redirect(add_query_arg('deploy', 'error', wp_get_referer() ?: admin_url()));
            exit;
        }

        $res = wp_remote_post($url, [
            'timeout' => 10,
            'blocking' => false,
        ]);

        $status = is_wp_error($res) ? 'error' : 'ok';
        wp_safe_redirect(add_query_arg('deploy', $status, wp_get_referer() ?: admin_url()));
        exit;
    }

    private function showDeployNotice(): void
    {
        if (!isset($_GET['deploy'])) {
            return;
        }

        $ok = sanitize_text_field($_GET['deploy']) === 'ok';

        printf(
            '<div class="notice %s is-dismissible"><p>%s</p></div>',
            $ok ? 'notice-success' : 'notice-error',
            $ok ? 'Deploy triggered.' : 'Deploy failed to trigger.',
        );
    }

    private function getHookUrl(): string
    {
        return getenv('DEPLOY_HOOK_URL') ?: '';
    }
}
