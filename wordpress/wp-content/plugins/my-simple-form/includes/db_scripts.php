<?php

// Create table on plugin activation
function itec_simple_form_install()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'itec_simple_form';

    $sql = "CREATE TABLE $table_name (
        id INT NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        address VARCHAR(255) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(150) NOT NULL,
        campus VARCHAR(50) NOT NULL,
        workshop VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        info_sent TINYINT(1) DEFAULT NULL,
        PRIMARY KEY (id)
    )";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

    dbDelta($sql);
}