<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="../styles/reset.css" type="text/css" />
        <link rel="stylesheet" href="/admin/assets.php?page=css/backend.css" type="text/css" />
        <script src="/admin/assets.php?page=js/backend.js" type="module"></script>
        <title>Messages</title>
    </head>
    <body>
        <header>
            <h1>Welcome, Tim!</h1>
            <h2>
                Today is
                <time datetime=""></time>
            </h2>
            <menu>
                <button type="button" id="refresh">Refresh</button>
                <button type="button" id="logout">Log out</button>
            </menu>
        </header>
        <main>            
            <section id="message-list">
                <div id="messages-toolbar">
                    <div id="folder-view-toggle" class="toolbar-control">
                        <label>Folder Selected: </label>

                        <input type="radio" id="view-inbox" name="folder_view" class="default-folder" value="1" data-folder="Inbox" checked>
                        <label for="view-inbox" class="toggle-button">Inbox <span class="message-count" data-folder="Inbox"></span></label>

                        <input type="radio" id="view-deleted" name="folder_view" class="default-folder" value="2" data-folder="Deleted">
                        <label for="view-deleted" class="toggle-button">Deleted <span class="message-count" data-folder="Deleted"></span></label>

                        <input type="radio" id="view-archived" name="folder_view" class="default-folder" value="3" data-folder="Archived">
                        <label for="view-archived" class="toggle-button">Archived <span class="message-count" data-folder="Archived"></span></label>
                    </div>
                    <button type="button" id="empty-folder">Empty Folder</button>
                    <button type="button" id="delete-folder" disabled>Delete Folder</button>

                    <div id="folder-options" class="toolbar-control">
                        <label for="move-to-folder">Move to Folder:</label>
                        <select id="move-to-folder" name="move-to-folder">
                            <option id="inbox" value="1" data-folder="Inbox" disabled>Inbox</option>
                            <option id="deleted" value="2" data-folder="Deleted">Deleted Messages</option>
                            <option id="archived" value="3" data-folder="Archived">Archived Messages</option>
                        </select>
                        <button type="button" id="move-selected" disabled>Move Selected</button>
                        <button type="button" id="new-folder">New Folder</button>                   
                    </div>
                </div>
                <table>
                    <caption>Messages: Inbox</caption>
                    <thead>
                        <tr>
                            <th class="message-header index"># <button class="sort-asc">▲</button><button class="sort-desc">▼</button></th>
                            <th class="message-header read">Read <button class="sort-asc">▲</button><button class="sort-desc">▼</button></th>
                            <th class="message-header sent">Sent <button class="sort-asc">▲</button><button class="sort-desc sort-on">▼</button></th>
                            <th class="message-header from">From <button class="sort-asc">▲</button><button class="sort-desc">▼</button></th>
                            <th class="message-header to">To <button class="sort-asc">▲</button><button class="sort-desc">▼</button></th>
                            <th class="message-header subject">Subject <button class="sort-asc">▲</button><button class="sort-desc">▼</button></th>
                            <th class="message-header body">Body <button class="sort-asc">▲</button><button class="sort-desc">▼</button></th>
                            <th class="message-header delete-message"></th>
                        </tr>
                    </thead>
                    <tbody id="messages" tabIndex="0">
                        
                    </tbody>
                </table>
            </section>
            <div id="divider"></div>
            <section id="reading-pane" class="view-mode" data-id="">
                <form>
                    <div id="message-details">
                        <fieldset id="message-header">
                            <div id="from-field" class="form-field">
                                <label>From:</label>
                                <span>
                                    <input type="text" id="from-name" name="from_name" readonly/>
                                    <input type="text" id="from-email" name="from_email" readonly/>
                                </span>
                            </div>
                            <div id="to-field" class="form-field">
                                <label>To:</label>
                                <span>
                                    <input type="text" id="to-name" name="to_name" readonly/>
                                    <input type="text" id="to-email" name="to_email" readonly/>
                                </span>
                            </div>
                            <div id="sent-field" class="form-field">
                                <label for="sent">Sent:</label>
                                <input type="text" id="sent" readonly/>
                            </div>
                            <div id="subject-field" class="form-field">
                                <label for="subject">Subject:</label>
                                <input type="text" id="subject" readonly/>
                            </div>
                        </fieldset>
                        <fieldset id="message-actions">
                            <button type="button" id="reply" disabled>Reply</button>
                            <button type="button" id="forward" disabled>Forward</button>
                            <button type="button" id="send-message" disabled>Send</button>
                            <button type="button" id="cancel-message">Cancel</button>
                        </fieldset>
                    </div>
                    <hr />
                    <div id="message-body">
                        <textarea id="body" class="form-field" readonly></textarea>
                    </div>
                </form>
            </section>
        </main>
        <aside id="visitors">
            <table>
                <caption>Visitors</caption>
                <thead>
                    <tr>
                        <th>IP Address</th>
                        <th>Referrer</th>
                        <th>Page Visited</th>
                        <th>Date/Time Visited</th>
                        <th>Country</th>
                        <th>Device Type</th>
                    </tr>
                </thead>
            </table>
        </aside>
        <dialog>
            <form method="dialog">
                <section id="add-new-folder">
                    <div class="form-field">
                        <label for="new-folder-name">New Folder Name:</label>
                        <input type="text" id="new-folder-name" name="new-folder-name">
                    </div>                    
                </section>
                <p id="dialog-prompt"></p>
                <menu>
                    <button type="submit" id="execute-dialog-action" value="add-folder" disabled>Add Folder</button>
                    <button type="submit" id="cancel-dialog-action" value="cancel">Cancel</button>
                </menu>
            </form>
        </dialog>
    </body>
</html>