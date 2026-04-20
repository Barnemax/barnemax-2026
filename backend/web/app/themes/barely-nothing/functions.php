<?php

require_once get_template_directory() . '/includes/class-manager.php';
require_once get_template_directory() . '/includes/class-cleanup.php';
require_once get_template_directory() . '/includes/class-deploy.php';

$manager = new BarelyNothing\Manager();
$cleanup = new BarelyNothing\Cleanup();
$deploy = new BarelyNothing\Deploy();
