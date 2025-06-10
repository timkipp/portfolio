function showColorPickerDialog() {
    const dialog = document.getElementById('color-picker');

    if (dialog) {
        dialog.show();
        
    } else {
        console.log("Dialog not found");
    }
    
}

function hideColorPickerDialog() {
    const dialog = document.getElementById('color-picker');
    dialog.close();
}