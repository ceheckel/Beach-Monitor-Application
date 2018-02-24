/**
 * All display specific functions live here
 * Specifically, any function that displays something
 * outside of working with the survey
 *
 * @author Wagner (edited 02/17/2018)
 */

/**
 * Display the "survey saved" toast pop up
 */
function showSaveToast() {
    'use strict';
    if (submitted) return;
    var snackbarContainer = document.querySelector('#toast-container');
    snackbarContainer.MaterialSnackbar.showSnackbar({message: 'Survey saved!', timeout: 750});
}



/**
 * Closes the drawer displaying the
 * various pages on the survey
 */
function closeDrawer() {
    var d = document.querySelector('.mdl-layout');
    d.MaterialLayout.toggleDrawer();
}

/**
 * Displays a delete countdown to prevent accidental deletions of surveys
 */
function deleteCountdown() {
    var btn = $('#btn-delete');
    var btn2 = $('#del-surveys-btn');
    deleteTimer--;
    if (deleteTimer > 0) {
        btn.html('Click again to confirm(' + deleteTimer + ')');
        btn2.html('Click again to confirm(' + deleteTimer + ')');
        setTimeout(deleteCountdown, 1000);
    } else {
        deleteTimer = 0;
        btn.html('Delete');
        btn2.html('Delete');
        btn.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
        btn2.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
    }
}