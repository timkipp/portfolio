<?php
$dir = __DIR__;
while (!file_exists($dir . '/vendor/autoload.php')) {
    $parent = dirname($dir);
    if ($parent === $dir) {
        throw new Exception('Could not find vendor/autoload.php');
    }
    $dir = $parent;
}
require_once $dir . '/vendor/autoload.php';

var_dump(class_exists('Dotenv\Dotenv'));