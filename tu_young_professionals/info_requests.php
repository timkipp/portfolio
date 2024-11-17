<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="styles/reset.css" type="text/css" rel="stylesheet">
    <link href="styles/global.css" type="text/css" rel="stylesheet">
    <title>Information Requests</title>
</head>
<body>
    <header>
        <h2>Towson University</h2>
        <h1>Young Professionals</h1>
    </header>
    <main>
        <table>
            <thead>
                <tr>
                    <th>Request Date</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone Number</th>
                    <th>Email Address</th>
                    <th>Campus</th>
                    <th>Workshop</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $servername = "localhost";
                $username = "root";       
                $password = "";           
                $dbname = "tu_young_professionals";

                // Create a new MySQL connection
                $conn = new mysqli($servername, $username, $password, $dbname);

                // Check if the connection is successful
                if ($conn->connect_error) {
                    die("Connection failed: " . $conn->connect_error);
                }

                // Fetch the data from the info_requests table
                $sql = "SELECT request_date, first_name, last_name, phone_number, email_address, campus, workshop, status FROM info_requests";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    // Output data of each row
                    while ($row = $result->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>" . $row["request_date"] . "</td>";
                        echo "<td>" . $row["first_name"] . "</td>";
                        echo "<td>" . $row["last_name"] . "</td>";
                        echo "<td>" . $row["phone_number"] . "</td>";
                        echo "<td>" . $row["email_address"] . "</td>";
                        echo "<td>" . $row["campus"] . "</td>";
                        echo "<td>" . $row["workshop"] . "</td>";
                        
                        // Create a checkbox for the status column
                        // If the status is "Complete", the checkbox is checked, otherwise it's unchecked
                        $checked = $row["status"] === "Complete" ? "checked" : "";
                        echo "<td><input type='checkbox' $checked></td>";

                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='8'>No records found</td></tr>";
                }

                // Close the connection
                $conn->close();
                ?>
            </tbody>
        </table>
    </main>
</body>
</html>