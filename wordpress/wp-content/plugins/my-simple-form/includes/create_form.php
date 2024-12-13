<?php

session_start();

function itec_simple_form()
{
    $content = '';

    // Check for the 'submitted' parameter to display a thank-you message
    if (isset($_GET['submitted']) && $_GET['submitted'] == 'yes') {
        $content = '<div>Thank you for your submission!</div>';
    } else {
        // $action_url = esc_url($_SERVER['REQUEST_URI']); // Get the current URL
        $action_url = admin_url('admin-post.php');
		
        
        if (isset($_SESSION['error_messages'])) {
            $error_vars = ['first_name' => '', 'last_name' => '', 'address' => '', 'phone' => '', 'email' => '', 'campus' => ''];
            $error_messages = $_SESSION['error_messages'];
        
            foreach ($error_messages as $field => $message) {
                // echo "<p style='color: red;'>$message</p>";
                $error_vars[$field] = $message;
            }

            unset($_SESSION['error_messages']);

            // var_dump($error_vars); // Debug to see if 'campus' is present

        }

        // Generate the form HTML
        $content .= 
        "<form action='$action_url' method='post' class='grid-form'>
            <input type='hidden' name='action' value='handle_itec_simple_form'>
			
            <label for='first_name'>First Name:</label>
            <input type='text' id='first_name' name='first_name'>            
            <span style='color: red;'>" . (isset($error_vars['first_name']) ? $error_vars['first_name'] : '') . "</span>

            <label for='last_name'>Last Name:</label>
            <input type='text' id='last_name' name='last_name'>
            <span style='color: red;'>" . (isset($error_vars['last_name']) ? $error_vars['last_name'] : '') . "</span>

            <label for='address'>Address:</label>
            <input type='text' id='address' name='address'>
            <span style='color: red;'>" . (isset($error_vars['address']) ? $error_vars['address'] : '') . "</span>

            <label for='phone'>Phone:</label>
            <input type='text' id='phone' name='phone'>
			<span style='color: red;'>" . (isset($error_vars['phone']) ? $error_vars['phone'] : '') . "</span>

            <label for='email'>Email:</label>
            <input type='email' id='email' name='email'>
            <span style='color: red;'>" . (isset($error_vars['email']) ? $error_vars['email'] : '') . "</span>

            <label for='campus'>Which campus are you interested in?</label>
            <select id='campus' name='campus'>			
                <option value='Bel Air'>Bel Air</option>
                <option value='Downtown Baltimore'>Downtown Baltimore</option>
                <option value='Ellicot City'>Ellicot Citt</option>
                <option value='Glen Burnie'>Glen Burnie</option>
                <option value='Hereford'>Hereford</option>
                <option value='Middle River'>Middle River</option>
                <option value='Owings Mills'>Owings Mills</option>
                <option value='Towson'>Towson</option>
            </select>
            <span style='color: red;'>" . (isset($error_vars['campus']) ? $error_vars['campus'] : '') . "</span>

            <label for='workshop'>Which workshop would you like to learn more about?</label>
            <input type='text' id='workshop' name='workshop'>
			
            <input type='submit' value='Submit' name='submit'>
        </form>";
    }
    return $content;
}
