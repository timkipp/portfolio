<?php
/*
Plugin Name: My Simple Form Plugin
Plugin URI: http://localhost/my-simple-form-plugin
Description: A simple form plugin that saves data to a database with CSS example.
Grid layout.
Version: 1.1
Author: Tim Kipp
Author URI: http://localhost
*/

require_once('includes/db_scripts.php');


// register the activation hook
register_activation_hook(__FILE__, 'itec_simple_form_install');


// Form creation function (`itec_simple_form`): Generates the HTML for the form.
include_once('includes/create_form.php');


// Add/register the shortcode [my-simple-form] to display the form
add_shortcode('my-simple-form', 'itec_simple_form');



// Form submission function (`itec_simple_form_handler`)
// This function handles form submission and saves data to the database.
include_once('includes/handle_form.php');

// Register the admin_post_handle_itec_simple_form action hook to handle form submissions
add_action('admin_post_handle_itec_simple_form', 'itec_simple_form_handler');


// Function to enqueue/add CSS styles
function itec_simple_form_styles()
{
    wp_enqueue_style('itec-simple-form-css', plugins_url('form-style.css', __FILE__));
}

// Add the form CSS to the wp_enqueue_scripts hook
add_action('wp_enqueue_scripts', 'itec_simple_form_styles');

add_action('admin_menu', 'simple_form_menu');

function simple_form_menu() {
    add_menu_page(
        'Simple Form Data', // text to be displayed in the title tag of the page
        'Simple Form Data', // text to be used for the menu item in the WordPress admin menu
        'manage_options', // the capability required for a user to view this menu item
        'simple-form-data', // a unique slug/identifier/path (URL) for this menu page
        'simple_form_submissions_page', // the function to call to display the content of the page
        'dashicons-list-view', // icon to be used in menu
        7
    );
}

include_once('includes/submit_form.php');