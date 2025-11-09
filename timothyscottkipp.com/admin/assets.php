<?php
    // Base directory for backend assets
    $baseDir = realpath(__DIR__ . '/../../backend');

    // Sanitize and get requested file
    $file = $_GET['page'] ?? '';
    $path = realpath($baseDir . '/' . $file);

    // Security check: make sure the requested file is inside backend/
    if (!$path || strpos($path, $baseDir) !== 0 || !file_exists($path)) {
        header("HTTP/1.0 404 Not Found");
        exit("File not found");
    }

    // Set proper MIME type
    $ext = pathinfo($path, PATHINFO_EXTENSION);
    switch ($ext) {
        case 'css': header("Content-Type: text/css"); break;
        case 'js': header("Content-Type: application/javascript"); break;
        default: header("Content-Type: text/plain"); break;
    }

    // Output the file
    readfile($path);
    exit;