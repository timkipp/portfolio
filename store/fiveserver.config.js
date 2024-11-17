module.exports = {
  php: "C:\\xampp\\php\\php.exe",   // Ensure correct path and double backslashes
  watch: {
    ignored: [
      '**/C:/Windows/**',
      '**/AppData/**',
      '**/Intel/**',
      '**/System32/**',
      '**/config/**' // Add any other paths you want to ignore
    ]
  }
};