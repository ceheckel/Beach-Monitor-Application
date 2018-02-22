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