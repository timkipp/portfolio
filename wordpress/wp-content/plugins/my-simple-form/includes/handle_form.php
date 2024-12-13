<?php

session_start(); // Start the session at the top of the scriptsession_start(); // Start the session at the top of the script

function itec_simple_form_handler()
{
    $error_exists = false;
    $error_messages = [];

	// Only proceed if the specific fields for our form are present
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['submit'])) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'itec_simple_form';

        $first_name = sanitize_text_field($_POST['first_name']);
        $last_name = sanitize_text_field($_POST['last_name']);
        $address = sanitize_text_field($_POST['address']);
        $phone = sanitize_text_field($_POST['phone']);
        $email = sanitize_email($_POST['email']);        
        $campus = sanitize_text_field($_POST['campus']);
        $workshop = sanitize_text_field($_POST['workshop']);

		// Validate the fields
        if (empty($first_name)) {
            $error_exists = true;
            $error_messages['first_name'] = 'First name is required.';
        }

        if (empty($last_name)) {
            $error_exists = true;
            $error_messages['last_name'] = 'Last name is required.';
        }

        if (empty($address)) {
            $error_exists = true;
            $error_messages['address'] = 'Address is required.';
        }

        if (empty($phone)) {
            $error_exists = true;
            $error_messages['phone'] = 'Phone number is required.';
        }

        if (empty($email)) {
            $error_exists = true;
            $error_messages['email'] = 'Email is required.';
        } elseif (!is_email($email)) {
            $error_exists = true;
            $error_messages['email'] = 'Please enter a valid email address.';
        }

        if (empty($campus)) {
            $error_exists = true;
            $error_messages['campus'] = 'Campus is required.';
            var_dump($error_messages['campus']);
        }
        
    }
    
    

    // Redirect with error messages if there are validation issues
    if ($error_exists) {

        $_SESSION['error_messages'] = $error_messages; // Store in session
        wp_redirect(wp_get_referer()); // Redirect to the form page

        exit;
    }
    

    // Ensure the table exists
    $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name;

    if ($table_exists) {
        $wpdb->insert(
            $table_name,
            [
                'first_name' => $first_name,
                'last_name' => $last_name,
                'address' => $address,
                'phone' => $phone,
                'email' => $email,
                'campus' => $campus,
                'workshop' => $workshop
            ]
        );

         // Send an email notification
         $to = get_option('admin_email'); // Replace with recipient's email address
         $subject = 'New Form Submission';
         $message = "A new form submission has been received.\n\n";
         $message .= "First Name: $first_name\n";
         $message .= "Last Name: $last_name\n";
         $message .= "Address: $address\n";
         $message .= "Phone: $phone\n";
         $message .= "Email: $email\n";
         $message .= "Campus: $campus\n";
         $message .= "Workshop: $workshop\n";

         $headers = ['Content-Type: text/plain; charset=UTF-8'];

         wp_mail($to, $subject, $message, $headers);


        // Redirect to avoid form resubmission issues
        $redirect_url = add_query_arg(
            'submitted',     // Add the'submitted' parameter to the URL
            'yes',           // Set the value of the'submitted' parameter to 'yes'
            wp_get_referer() // Get the URL the user came from
        );

        wp_redirect($redirect_url); // Redirect to the URL the user came from
        exit;
    }
}