<!-- Tim Kipp -->
<?php    
    
    // Initialize variables for error messages and form data
    $errors = ['billing_first_name'=> '', 'billing_last_name' => '', 'billing_street_address' => '', 'billing_city' => '', 'billing_state' => '',
               'delivery_first_name'=> '', 'delivery_last_name' => '', 'delivery_street_address' => '', 'delivery_city' => '', 'delivery_state' => '',
               'billing_card_type' => '', 'billing_card_number' => '', 'billing_card_expiration_month' => '', 'billing_card_expiration_year' => '', 'billing_card_cvv' => '',
               'username' => '', 'password' => '', 'password_confirmation' => ''];

    $billingData = [];
    $deliveryData = [];
    $paymentData = [];
    $userData = [];

    $showForm = true;

    // Check if the form has been submitted
    if (isset($_POST['submit'])) {
        $billingData['billing_first_name'] = htmlspecialchars(trim($_POST['billing_first_name']));
        $billingData['billing_last_name'] = htmlspecialchars(trim($_POST['billing_last_name']));
        $billingData['billing_street_address'] = htmlspecialchars(trim($_POST['billing_street_address']));
        $billingData['billing_city'] = htmlspecialchars(trim($_POST['billing_city']));
        $billingData['billing_state'] = $_POST['billing_state'];
        $deliveryData['deliver_to_billing_address'] = isset($_POST['deliver_to_billing_address']);
        $deliveryData['delivery_first_name'] = htmlspecialchars(trim($_POST['delivery_first_name']));
        $deliveryData['delivery_last_name'] = htmlspecialchars(trim($_POST['delivery_last_name']));
        $deliveryData['delivery_street_address'] = htmlspecialchars(trim($_POST['delivery_street_address']));
        $deliveryData['delivery_city'] = htmlspecialchars(trim($_POST['delivery_city']));
        $deliveryData['delivery_state'] = $_POST['delivery_state'];
        $paymentData['billing_card_type'] = htmlspecialchars(trim($_POST['billing_card_type']));
        $paymentData['billing_card_number'] = htmlspecialchars(trim($_POST['billing_card_number']));
        $paymentData['billing_card_expiration_month'] = htmlspecialchars(trim($_POST['billing_card_expiration_month']));
        $paymentData['billing_card_expiration_year'] = htmlspecialchars(trim($_POST['billing_card_expiration_year']));
        $paymentData['billing_card_cvv'] = htmlspecialchars(trim($_POST['billing_card_cvv']));
        $userData['username'] = htmlspecialchars(trim($_POST['username']));
        $userData['password'] = $_POST['password'];
        $userData['password_confirmation'] = $_POST['password_confirmation'];            

        // Validation for required fields in the billing address
        foreach ($billingData as $field) {
            if (empty($billingData[$field])) {
                $errors[$field] = ucfirst(str_replace('_', '', str_replace('billing', '', $field))) . ' is required in Billing Address.';
            }
        }

        // If "Same as billing address" is not checked, validate delivery address fields
        if (!$deliveryData['deliver_to_billing_address']) {
            foreach ($deliveryData as $field) {
                if (empty($deliveryData[$field])) {
                    $errors[$field] = ucfirst(str_replace('_', '', str_replace('delivery', '', $field))) . ' is required in Delivery Address.';
                }
            }
        } else {
            // Populate delivery fields with billing fields if checked
            $deliveryData['delivery_first_name'] = $billingData['billing_first_name'];
            $deliveryData['delivery_last_name'] = $billingData['billing_last_name'];
            $deliveryData['delivery_street_address'] = $billingData['billing_street_address'];
            $deliveryData['delivery_city'] = $billingData['billing_city'];
            $deliveryData['delivery_state'] = $billingData['billing_state'];
        }

        // Validate username
        if (strlen($userData['username']) < 5) {
            $errors['username'] = 'Username must be at least 5 characters long.';
        }

        // Validate password match
        if ($userData['password'] !== $userData['password_confirmation']) {
            $errors['password'] = 'Ensure passwords match.';
        }
        // If there are no errors, display the entered values
        if (empty($errors)) {
            $showForm = false; // Hide the form
        } 
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="styles/reset.css">
    <link rel="stylesheet" type="text/css"  href="styles/order.css">
    
    <title>Assignment #2</title>
</head>
<body>
    <header>
        <h1>ITEC 464: Assignment #2</h1>
    </header>
    <main>
        <?php if ($showForm): ?>
            <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>">
                <fieldset id="addressFields">                
                    <fieldset id="billing_address">
                        <div>
                            <legend>Billing Address</legend>
                            <label for="deliver_to_billing_address" id="labelDeliverToBillingAddress">Deliver to billing address<input type="checkbox" id="deliver_to_billing_address" name="deliver_to_billing_address" value="true" checked="true" onchange="toggleDeliverAddress()"></label>
                        </div>
                        <label for="billing_first_name">First Name</label>
                        <input type="text" id="billing_first_name" name="billing_first_name" placeholder="Enter the billing first name" class="required">
                        <?php if(!empty($errors['billing_first_name'])) { echo "<p>{$errors['billing_first_name']}</p>"; } ?>
                        <label for="billing_last_name">Last Name</label>
                        <input type="text" id="billing_last_name" name="billing_last_name" placeholder="Enter the billing last name" class="required">
                        <?php if(!empty($errors['billing_last_name'])) { echo "<p>{$errors['billing_last_name']}</p>"; } ?>
                        <label for="billing_street_address">Street Address</label>
                        <input type="text" id="billing_street_address" name="billing_street_address" placeholder="Enter the billing street address" class="required">
                        <?php if(!empty($errors['billing_street_address'])) { echo "<p>{$errors['billing_street_address']}</p>"; } ?>
                        <div id="billing_city_and_state">
                            <label for="billing_city">City</label>
                            <input type="text" id="billing_city" name="billing_city" placeholder="Enter the billing city" class="required">
                            <?php if(!empty($errors['billing_city'])) { echo "<p>{$errors['billing_city']}</p>"; } ?>
                            <label for="billing_state">State</label>
                            <select id="billing_state" name="billing_state" placeholder="Select the billing city" class="required">
                                <option value="Alabama">AL</option>
                                <option value="Alaska">AK</option>
                                <option value="Arizona">AZ</option>
                                <option value="Arkansas">AR</option>
                                <option value="California">CA</option>
                                <option value="Colorado">CO</option>
                                <option value="Connecticut">CT</option>
                                <option value="Delaware">DE</option>
                                <option value="Washington, D.C.">DC</option>
                                <option value="Florida">FL</option>
                                <option value="Georgia">GA</option>
                                <option value="Hawaii">HI</option>
                                <option value="Idaho">ID</option>
                                <option value="Illinois">IL</option>
                                <option value="Indiana">IN</option>
                                <option value="Iowa">IA</option>
                                <option value="Kansas">KS</option>
                                <option value="Kentucky">KY</option>
                                <option value="Louisiana">LA</option>
                                <option value="Maine">ME</option>
                                <option value="Maryland">MD</option>
                                <option value="Massachusetts">MA</option>
                                <option value="Michigan">MI</option>
                                <option value="Minnesota">MN</option>
                                <option value="Mississippi">MS</option>
                                <option value="Missouri">MO</option>
                                <option value="Montana">MT</option>
                                <option value="Nebraska">NE</option>
                                <option value="Nevada">NV</option>
                                <option value="New Hampshire">NH</option>
                                <option value="New Jersey">NJ</option>
                                <option value="New Mexico">NM</option>
                                <option value="New York">NY</option>
                                <option value="North Carolina">NC</option>
                                <option value="North Dakota">ND</option>
                                <option value="Ohio">OH</option>
                                <option value="Oklahoma">OK</option>
                                <option value="Oregon">OR</option>
                                <option value="Pennsylvania">PA</option>
                                <option value="Rhode Island">RI</option>
                                <option value="South Carolina">SC</option>
                                <option value="South Dakota">SD</option>
                                <option value="Tennessee">TN</option>
                                <option value="Texas">TX</option>
                                <option value="Utah">UT</option>
                                <option value="Vermont">VT</option>
                                <option value="Virginia">VA</option>
                                <option value="Washington">WA</option>
                                <option value="West Virginia">WV</option>
                                <option value="Wisconsin">WI</option>
                                <option value="Wyoming">WY</option>
                            </select>
                            <?php if(!empty($errors['billing_state'])) { echo "<p>{$errors['billing_state']}</p>"; } ?>
                        </div>                
                    </fieldset>
                    <fieldset id="delivery_address">
                        <legend>Delivery Address</legend>
                        <label for="delivery_first_name">First Name</label>
                        <input type="text" id="delivery_first_name" name="delivery_first_name" placeholder="Enter the delivery first name" class="required" value="<?php echo !$deliveryData['deliver_to_billing_address'] ? $billingData['billing_first_name'] : ''; ?>">
                        <?php if(!empty($errors['delivery_first_name'])) { echo "<p>{$errors['delivery_first_name']}</p>"; } ?>
                        <label for="delivery_last_name">Last Name</label>
                        <input type="text" id="delivery_last_name" name="delivery_last_name" placeholder="Enter the delivery last name" class="required" value="<?php echo !$deliveryData['deliver_to_billing_address'] ? $billingData['billing_last_name'] : ''; ?>">
                        <?php if(!empty($errors['delivery_last_name'])) { echo "<p>{$errors['delivery_last_name']}</p>"; } ?>
                        <label for="delivery_street_address">Street Address</label>
                        <input type="text" id="delivery_street_address" name="delivery_street_address" placeholder="Enter the delivery street address" class="required" value="<?php echo !$deliveryData['deliver_to_billing_address'] ? $billingData['billing_street_address'] : ''; ?>">
                        <?php if(!empty($errors['delivery_street_address'])) { echo "<p>{$errors['delivery_street_address']}</p>"; } ?>
                        <div id="delivery_city_and_state">
                            <label for="delivery_city">City</label>
                            <input type="text" id="delivery_city" name="delivery_city" placeholder="Enter the delivery city" class="required" value="<?php echo !$deliveryData['deliver_to_billing_address'] ? $billingData['billing_city'] : ''; ?>">
                            <?php if(!empty($errors['delivery_city'])) { echo "<p>{$errors['delivery_city']}</p>"; } ?>
                            <label for="delivery_state">State</label>
                            <select id="delivery_state" name="delivery_state" placeholder="Select the delivery city" class="required" value="<?php echo !$deliveryData['deliver_to_billing_address'] ? $billingData['billing_state'] : ''; ?>">
                                <option value="Alabama">AL</option>
                                <option value="Alaska">AK</option>
                                <option value="Arizona">AZ</option>
                                <option value="Arkansas">AR</option>
                                <option value="California">CA</option>
                                <option value="Colorado">CO</option>
                                <option value="Connecticut">CT</option>
                                <option value="Delaware">DE</option>
                                <option value="Washington, D.C.">DC</option>
                                <option value="Florida">FL</option>
                                <option value="Georgia">GA</option>
                                <option value="Hawaii">HI</option>
                                <option value="Idaho">ID</option>
                                <option value="Illinois">IL</option>
                                <option value="Indiana">IN</option>
                                <option value="Iowa">IA</option>
                                <option value="Kansas">KS</option>
                                <option value="Kentucky">KY</option>
                                <option value="Louisiana">LA</option>
                                <option value="Maine">ME</option>
                                <option value="Maryland">MD</option>
                                <option value="Massachusetts">MA</option>
                                <option value="Michigan">MI</option>
                                <option value="Minnesota">MN</option>
                                <option value="Mississippi">MS</option>
                                <option value="Missouri">MO</option>
                                <option value="Montana">MT</option>
                                <option value="Nebraska">NE</option>
                                <option value="Nevada">NV</option>
                                <option value="New Hampshire">NH</option>
                                <option value="New Jersey">NJ</option>
                                <option value="New Mexico">NM</option>
                                <option value="New York">NY</option>
                                <option value="North Carolina">NC</option>
                                <option value="North Dakota">ND</option>
                                <option value="Ohio">OH</option>
                                <option value="Oklahoma">OK</option>
                                <option value="Oregon">OR</option>
                                <option value="Pennsylvania">PA</option>
                                <option value="Rhode Island">RI</option>
                                <option value="South Carolina">SC</option>
                                <option value="South Dakota">SD</option>
                                <option value="Tennessee">TN</option>
                                <option value="Texas">TX</option>
                                <option value="Utah">UT</option>
                                <option value="Vermont">VT</option>
                                <option value="Virginia">VA</option>
                                <option value="Washington">WA</option>
                                <option value="West Virginia">WV</option>
                                <option value="Wisconsin">WI</option>
                                <option value="Wyoming">WY</option>
                            </select>
                            <?php if(!empty($errors['delivery_state'])) { echo "<p>{$errors['delivery_state']}</p>"; } ?>
                        </div>                
                    </fieldset> <!-- END OF id="delivery_address" -->
                </fieldset> <!-- END OF id="addressFields" -->
                <fieldset id="payment_fields">
                    <legend>Payment</legend>
                    <fieldset id="billing_card_type" class="required">                    
                        <div><input type="radio" id="billing_visa" class="credit_card_type" name="billing_card_type" value="Visa" checked aria-checked><img src="images/visa_small.png" alt="Visa"></div>
                        <div><input type="radio" id="billing_mastercard" class="credit_card_type" name="billing_card_type" value="Mastercard"><img src="images/mastercard_small.png" alt="Mastercard"></div>
                        <div><input type="radio" id="billing_american_express" class="credit_card_type" name="billing_card_type" value="American Express"><img src="images/amex_small.png" alt="American Express"></div>
                        <div><input type="radio" id="billing_discover" class="credit_card_type" name="billing_card_type" value="Discover"><img src="images/discover_small.png" alt="Discover"></div>
                    </fieldset>
                    <label for="billing_card_number">Credit Card Number</label>
                    <input type="text" id="billing_card_number" name="billing_card_number" placeholder="Enter the credit card number" class="required">
                    <?php if(!empty($errors['billing_card_number'])) { echo "<p>{$errors['billing_card_number']}</p>"; } ?>
                    <div id="billing_exp_date_and_cvv">
                        <label id="billing_card_expiration_date">Exp Date
                            <select id="billing_card_expiration_month" name="billing_card_expiration_month" class="required">
                                <option>Month</option>
                                <option value="1">01</option>
                                <option value="2">02</option>
                                <option value="3">03</option>
                                <option value="4">04</option>
                                <option value="5">05</option>
                                <option value="6">06</option>
                                <option value="7">07</option>
                                <option value="8">08</option>
                                <option value="9">09</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                            </select>
                            <select id="billing_card_expiration_year" name="billing_card_expiration_year" class="required">
                                <option>Year</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                                <option value="2028">2028</option>
                                <option value="2029">2029</option>
                            </select>                    
                        </label>
                        <label for="billing_card_cvv">CVV</label>
                        <input type="text" id="billing_card_cvv" name="billing_card_cvv" class="required">
                        <?php if(!empty($errors['billing_card_cvv'])) { echo "<p>{$errors['billing_card_cvv']}</p>"; } ?>
                    </div>
                </fieldset> <!-- END OF id="paymentFields" -->
                <fieldset id="user_account_fields">
                    <legend>Create Account</legend>
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" class="required">
                    <?php if(!empty($errors['username'])) { echo "<p>{$errors['username']}</p>"; } ?>
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" class="required">
                    <?php if(!empty($errors['password'])) { echo "<p>{$errors['password']}</p>"; } ?>
                    <label for="password_confirmation">Confirm Password</label>
                    <input type="password" id="password_confirmation" name="password_confirmation" class="required">
                    <?php if(!empty($errors['password_confirmation'])) { echo "<p>{$errors['password_confirmation']}</p>"; } ?>
                </fieldset> <!-- END OF id="paymentFields" -->
                <input type="submit" name="submit" value="Submit">
            </form>
    <?php else: ?>
        <table>
            <thead>
                <tr>
                    <th>Field</th>
                    <th>Value</th>
                </tr>
            </thead>
            <?php
                foreach($billingData as $key => $value) {
                    echo "<tr><td>$key</td><td>$value</td></tr>";
                }
                foreach($deliveryData as $key => $value) {
                    echo "<tr><td>$key</td><td>$value</td></tr>";
                }
                foreach($paymentData as $key => $value) {
                    echo "<tr><td>$key</td><td>$value</td></tr>";
                }
                foreach($userData as $key => $value) {
                    echo "<tr><td>$key</td><td>$value</td></tr>";
                }
            ?>                
        </table>
    <?php endif; ?>
    </main>
    <footer>
        <p>&copy;2024 Tim Kipp</p>
        <p>ITEC 464: Web Development</p>        
        <address>
            Towson University<br>
            Department of Computer & Information Sciences<br>
            7800 York Road<br>
            Towson, MD 21204
        </address>
    </footer>
</body>
<script>
    function toggleDeliverAddress() {
        const checkbox = document.getElementById("deliver_to_billing_address");
        const delivery_address = document.getElementById("delivery_address");

        if(checkbox.checked) {
            delivery_address.style.display = "none";
        } else {
            delivery_address.style.display = "flex"
        }
    }
</script>
</html>