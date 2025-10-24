<?php
    session_start();
    if (empty($_SESSION['logged_in'])) {
        header("Location: login.php");
        exit;
    }
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/reset.css" type="text/css" />
        <link rel="stylesheet" href="messages.css" type="text/css" />
        <script src="messages.js" type="text/javascript" defer></script>
        <title>Messages</title>
    </head>
    <body>
        <header>
            <h1>Welcome, Tim!</h1>
            <h2>
                Today is
                <time datetime=""></time>
            </h2>
            <button type="button" id=logout>Log out</button>
        </header>
        <main>
            <section id="message-list">
                <table>
                    <caption>Messages</caption>
                    <thead>
                        <tr>
                            <th class="id">#</th>
                            <th class="new">New</th>
                            <th class="sent">Sent</th>
                            <th class="name">Name</th>
                            <th class="email">Email</th>
                            <th class="message">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="new-message">
                            <td class="id">1</td>
                            <td class="new">✔</td>
                            <td class="sent">10/21/25&nbsp;&nbsp;3:05 pm</td>
                            <td class="name">Mary Richards</td>
                            <td class="email">maryrichards@google.com</td>
                            <td class="message">
                                Maecenas ac mi sit amet nulla porta accumsan consequat eu mi. Pellentesque eget ex ultricies erat sollicitudin laoreet non vel ipsum. Nam maximus, velit at facilisis vulputate, nunc enim rutrum arcu, sit amet dignissim arcu justo et ligula. Etiam quam ante, fermentum vel erat eu, luctus aliquam diam. Nulla ornare sit amet ligula vel porta. Cras faucibus sodales dignissim. Duis dolor urna, vestibulum quis eros sed, cursus aliquam lorem. Morbi ac lectus lobortis,
                                efficitur turpis nec, sodales lacus. Nulla ornare mi neque, in faucibus urna luctus vitae. Curabitur feugiat, arcu nec venenatis ullamcorper, turpis ante tempor sapien, ut malesuada felis ante in libero. Nam id diam ut ante tempor hendrerit at a est. Aliquam erat volutpat. Donec purus erat, interdum eget volutpat non, ullamcorper in mi. Sed placerat at metus vitae scelerisque. Donec porttitor finibus massa vitae pharetra. Donec in placerat velit. In scelerisque,
                                erat eget venenatis faucibus, nisl arcu rutrum nibh, sit amet suscipit risus libero et ante. Curabitur ullamcorper eleifend urna, quis dictum nisi tempus ac. Morbi sed lobortis ex, quis aliquet purus. Vivamus scelerisque lorem sapien, ac consectetur augue suscipit sed. Nulla et pulvinar ligula, sed pharetra arcu. Etiam in nisl eget libero gravida laoreet.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <section id="reading-pane">
                <form>
                    <fieldset id="message-header">
                        <div id="name-field" class="form-field">
                            <label for="name">Name:</label>
                            <input type="text" id="name" />
                        </div>
                        <div id="email-field" class="form-field">
                            <label for="email">Email:</label>
                            <input type="email" id="email" />
                        </div>
                        <div id="sent-field" class="form-field">
                            <label for="sent">Sent:</label>
                            <input type="text" id="sent" />
                        </div>
                    </fieldset>
                    <hr />
                    <div id="message-body">
                        <textarea id="message" class="form-field"></textarea>
                    </div>
                </form>
            </section>
        </main>
    </body>
</html>