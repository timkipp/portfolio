<?php

function simple_form_submissions_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'itec_simple_form';

    // Retrieve all submissions from the database table.
    $submissions = $wpdb->get_results("SELECT * FROM $table_name");

    // HTML structure for displaying submissions in a table format.
    echo '<div class="wrap"><h1>Form Submissions</h1>';
    echo '<table class="widefat fixed" cellspacing="0">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Email</th>                                        
                    <th>Submitted At</th>
                    <th>Info Sent</th>
                    <th>Update</th>
                </tr>
            </thead>
            <tbody>';

    // Loop through each submission and display it in a table row.
    if (!empty($submissions)) {
        foreach ($submissions as $submission) {
            $checked = $submission->info_sent ? 'checked' : '';
            echo '<tr>
                    <td>' . esc_html($submission->id) . '</td>
                    <td>' . esc_html($submission->first_name) . '</td>
                    <td>' . esc_html($submission->last_name) . '</td>
                    <td>' . esc_html($submission->address) . '</td>
                    <td>' . esc_html($submission->phone) . '</td>
                    <td>' . esc_html($submission->email) . '</td>
                    <td>' . esc_html($submission->created_at) . '</td>
                    <td>
                        <form method="post" action="">
                            <input type="hidden" name="submission_id" value="' . esc_attr($submission->id) . '">
                            <input type="checkbox" name="info_sent" value="1" ' . $checked . '>
                        </form>
                    </td>
                    <td>
                        <form method="post" action="">
                            <input type="hidden" name="submission_id" value="' . esc_attr($submission->id) . '">
                            <input type="submit" name="update_info_sent" value="Update">
                        </form>
                    </td>
                  </tr>';
        }
    } else {
        // Message to display if no submissions are found.
        echo '<tr><td colspan="9">No submissions found.</td></tr>';
    }

    echo '</tbody></table></div>';

    // Check if the form is submitted and update the database.
    if (isset($_POST['update_info_sent'])) {
        // Debugging output
        error_log('Form submitted');
        error_log('Submission ID: ' . $_POST['submission_id']);
        error_log('Info Sent: ' . (isset($_POST['info_sent']) ? '1' : '0'));

        $submission_id = intval($_POST['submission_id']);
        $info_sent = isset($_POST['info_sent']) ? 1 : 0;

        if ($submission_id === 0) {
            error_log('Invalid submission ID');
        }

        $update_result = $wpdb->update(
            $table_name,
            array('info_sent' => $info_sent),
            array('id' => $submission_id),
            array('%d'), // Format for info_sent (integer)
            array('%d')  // Format for id (integer)
        );

        // Debugging output
        if ($update_result === false) {
            error_log('Database update failed');
        } else {
            error_log('Database update successful');
        }

        if ($update_result !== false) {
            // Redirect should happen before any other output.
            wp_redirect($_SERVER['REQUEST_URI']);
            exit; // Ensure no further code is executed after redirect.
        } else {
            // Only echo success message if needed, remove if not necessary.
            echo '<div class="updated"><p>Info Sent status updated successfully!</p></div>';
        }
    }
}
?>
