function showColorPickerDialog() {
    alert("Opening color picker...");

    const dialog = document.getElementById('color-picker');
        
    // dialog.open = true;

    if (dialog) {
        dialog.show();
        
    } else {
        console.log("Dialog not found");
    }
    
}

function hideColorPickerDialog() {
    const dialog = document.getElementById('color-picker');
    dialog.close();
    // dialog.open = false;
}