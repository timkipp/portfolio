<?php
    include 'scripts/db_connection.php';

    // Fetch data from the tables
    $sql = "
        SELECT Region.RegionName, Region.Description AS RegionDescription, Country.CountryName, Country.Description AS CountryDescription, 
            State.Name AS StateName, State.Abbreviation, City.CityName, Location.LocationName, Location.Address 
        FROM Region r
        LEFT JOIN State ON State.RegionID = Region.RegionID
        LEFT JOIN Country ON Country.CountryID = State.CountryID
        LEFT JOIN City ON City.StateID = State.StateID
        LEFT JOIN Location ON Location.CityID = City.CityID
    ";

    $result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
    <h1>Country, Region, State, City, and Location Data</h1>

    <?php if ($result->num_rows > 0): ?>
        <table>
            <thead>
                <tr>
                    <th>Region Name</th>
                    <th>Region Description</th>
                    <th>Country Name</th>
                    <th>Country Description</th>
                    <th>State Name</th>
                    <th>State Abbreviation</th>
                    <th>City Name</th>
                    <th>Location Name</th>
                    <th>Location Address</th>
                </tr>
            </thead>
            <tbody>
                <?php while($row = $result->fetch_assoc()): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($row['RegionName']); ?></td>
                        <td><?php echo htmlspecialchars($row['RegionDescription']); ?></td>
                        <td><?php echo htmlspecialchars($row['CountryName']); ?></td>
                        <td><?php echo htmlspecialchars($row['CountryDescription']); ?></td>
                        <td><?php echo htmlspecialchars($row['StateName']); ?></td>
                        <td><?php echo htmlspecialchars($row['Abbreviation']); ?></td>
                        <td><?php echo htmlspecialchars($row['CityName']); ?></td>
                        <td><?php echo htmlspecialchars($row['LocationName']); ?></td>
                        <td><?php echo htmlspecialchars($row['Address']); ?></td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>`
    <?php else: ?>
        <p>No data found</p>
    <?php endif; ?>

    <?php $conn->close(); ?>

</body>
</html>