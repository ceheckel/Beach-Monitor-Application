/**
 * Collection of functions that aid in page navigation
 *
 * @author Heckel (edited 02/17/2018)
 * @author Wagner (edited 02/17/2018)
 */

/**
 * Go to a specified page
 * @param page Page to jump to
 * @param needsValidation Boolean stating whether or not to delete survey
 */
function toPage(page, needsValidation) {
    // if deleting survey, ignore validation?
    if(needsValidation === false) {
        if (validatePage(curPage) === false) {
            return;
        }
    }

    // save survey
    saveSurvey();

    // reset global var
    if(page == 'home') {
        submitted = false;
        getSurveys();
    }

    // hide everything, then show only desired page
    $('div[data-page]').hide();
    var p = $('div[data-page=' + page + ']');
    p.show();

    if(submitted == true){
        //Turn off buttons
        $("#__remFavorite").attr("disabled", true);
        $("#__addFavorite").attr("disabled", true);
        $("#__collectSampleNow").attr("disabled", true);
    } else {
        //Turn on buttons
        $("#__remFavorite").attr("disabled", false);
        $("#__addFavorite").attr("disabled", false);
        $("#__collectSampleNow").attr("disabled", false);
    }

    // setup page title
    $('#page-title').html(
        p.data('page-title') +
        ((submitted && (p.data('page-title') !== 'WI Beaches')) ? ' <span style="font-size:1rem">(Read Only)</span>' : '') // if submitted, add '(Read Only)'
    );
    $('#page-title-drawer').html(p.data('page-title'));

    curPage = page;  // curPage is a GLOBAL variable, and this is where it gets set

    // Display buttons on the page based upon current page
    displayBtns();
    saveFavoriteEnabled();
}

/**
 * Function for previous button behavior
 * Goes to page directly before current page
 * NOTE: Logic checking for array out of bounds is in toPage()
 * @see toPage
 */
function btnPrev() {
    // if button is pressed from the help page, return to last visited page
    if(document.getElementById("btn-prev").innerHTML == "Return") {
        $('#btn-prev').html('Previous');
        toPage(curPage, true);
    } else { // else, go back one page
        toPage(curPage - 1, false);
    }
}

/**
 * Function for next button behavior
 * Goes to page directly after current page
 * NOTE: Logic checking for array out of bounds is in toPage()
 * @see toPage
 */
function btnNext() {
    // if current page is last page on form, go to review page
    if (curPage == totalQuestionPages - 1) { toReview(); }
    // if current page is review page, save any possible changes
    else if (curPage == totalQuestionPages) {
        saveSurvey(totalQuestionPages);
        if(validatePage(curPage) == true) {
            submit();
        }

    }
    // if current page is any other form page, move ahead
    else
        toPage(curPage + 1,false);
}

/**
 * Display the Review page if the user is at the end of survey
 *  @see btnNext
 */
function toReview() {
    saveSurvey(totalQuestionPages);
    $('div[data-page]').show();
    $('div[data-page=home]').hide();
    $('div[data-page=help]').hide();
    $('#page-title').html('Review' + (submitted ? ' <span style="font-size:1rem">(Read Only)</span>' : ''));
    $('#page-title-drawer').html('Review');
    curPage = totalQuestionPages;
    $('#btn-next').html('Complete');
    $('#btn-prev').css('display', 'block');
    $('#btn-delete').css('display', 'block');
    $('.mdl-layout__content').scrollTop(0);
    $('#surveySectionsDrawer a').each(function(i,e) {
        $(e).css('font-weight', 'inherit').removeClass('mdl-color--accent').removeClass('mdl-color-text--accent-contrast');
    });
    $('#surveySectionsDrawer a').last().addClass('mdl-color--accent').addClass('mdl-color-text--accent-contrast');
}

/**
 *
 */
function toHelp() {
    // hide everything, then show only help info
    $('div[data-page]').hide();
    var p = $('div[data-page=help]');
    p.show();

    // Change bottom navbar buttons
    $('#btn-prev').css('display', 'block');
    if(curPage != 'home') {
        $('#btn-prev').html('Return');
    }
    $('#btn-delete').css('display', 'none');
    $('#btn-next').css('display', 'none');
}

/**
 * Display buttons based upon current page
 * @see toPage
 *      toPage calls this after loading the new page and
 *      setting curPage [GLOBAL] to the new current page
 */
function displayBtns(){

    if (curPage > 0) { $('#btn-prev').css('display', 'block'); }    // if not on first page, display previous button
    else { $('#btn-prev').css('display', 'none'); }                 // else, remove previous button

    if (curPage == totalQuestionPages - 1) { // if on last page, make 'Review' button
        $('#btn-next').html('Review');
        $('#bottom-nav').css('display', 'flex');
    }
    else if (curPage >= 0) { // if on any survey page, show 'Next' and 'Delete'
        $('#btn-next').html('Next');
        $('#btn-next').css('display', 'block');
        $('#btn-delete').html('Delete');
        $('#btn-delete').css('display', 'block');

        $('#bottom-nav').css('display', 'flex');    // dynamic spacer
    }
    else {    // if not on form pages, don't display navigation buttons
        $('#bottom-nav').css('display', 'none');
    }

    // if on home page, setup home page drawer
    if (curPage == 'home') {
        $('#help-button').hide(); // '#help-button' is bad name

        //getSurveys(); // retrieves the surveys to populate home screen

        document.getElementById("surveySectionsDrawer").style.display = 'none'; // hide survey sections
        document.getElementById("homeSectionDrawer").style.display = 'block';   // show home section
        document.getElementById("helpSectionDrawer").style.display = 'block';   // show help section
        $('#page-questions').css('display', 'none');
        $('#page-beach-drawer').css('display', 'none');
        window.onbeforeunload = null;
    }
    else if(curPage == 'help') {
        // possible links on navbar
        document.getElementById("surveySectionsDrawer").style.display = 'none'; // not visible
        document.getElementById("homeSectionDrawer").style.display = 'block';   // visible
        document.getElementById("helpSectionDrawer").style.display = 'none';    // not visible

        // show data from help page
        $('#help-button').show();

        // save current survey info
        saveSurvey(curPage);
        curPage = 'help';

        // hide previous page's information
        $('div[data-page=home]').hide();
        $('#page-questions').css('display', 'none');
        $('#page-beach-drawer').css('display', 'none');

        // update page title
        $('#page-title').html("Help Page");
    }
    else {
        // hide help page info if navigating away from help page
        $('#help-button').hide();

        // possible links in navbar
        document.getElementById("surveySectionsDrawer").style.display = 'block';
        document.getElementById("homeSectionDrawer").style.display = 'none';
        document.getElementById("helpSectionDrawer").style.display = 'block';
        $('#page-beach-drawer').css('display', 'inline');
        $('#page-beach-drawer').html($('#__beach').val().length > 0 ? $('#__beach').val() : 'Unknown Beach');
    }

    $('.mdl-layout__content').scrollTop(0);

    $('#surveySectionsDrawer a').each(function(i,e) {
        if (i === curPage) $(e).css('font-weight', 'bold').addClass('mdl-color--accent').addClass('mdl-color-text--accent-contrast');
        else $(e).css('font-weight', 'inherit').removeClass('mdl-color--accent').removeClass('mdl-color-text--accent-contrast');
    });
}