/**
 * Collection of functions that aid in page navigation
 *
 * @author Heckel (edited 02/17/2018)
 * @author Wagner (edited 02/17/2018)
 * @author Kriz   (edited 03/03/2018)
 */

/**
 * Go to a specified page
 * @param page Page to jump to
 * @param toDelete Boolean stating whether or not to delete survey
 */
function toPage(page, toDelete) {

    // If deleting survey, ignore validation?
    if (toDelete === false) {
        if (validatePage(curPage) === false) {
            return;
        }
    }

    // Save quick
    saveSurvey();

    // Hide everything, then show only desired page
    $('div[data-page]').hide();
    var p = $('div[data-page=' + page + ']');
    p.show();

    // Setup page title
    $('#page-title').html(
        p.data('page-title') +
        ((submitted && (p.data('page-title') !== 'WI Beaches')) ? ' <span style="font-size:1rem">(Read Only)</span>' : '') // if submitted, add '(Read Only)'
    );
    $('#page-title-drawer').html(p.data('page-title'));

    curPage = page;  // curPage is a GLOBAL variable, and this is where it gets set

    // Display buttons on the page based upon current page
    displayBtns();

}

/**
 * Function for previous button behavior
 * Goes to page directly before current page
 * NOTE: Logic checking for array out of bounds is in toPage()
 * @see toPage
 */
function btnPrev() {
    toPage(curPage - 1, false);
}

/**
 * Function for next button behavior
 * Goes to page directly after current page
 * NOTE: Logic checking for array out of bounds is in toPage()
 * @see toPage
 */
function btnNext() {

    if (curPage == totalQuestionPages - 1) {
        // if current page is last page on form, go to review page
        toReview();
    } else if (curPage == totalQuestionPages) {
        // if current page is review page, save any possible changes
        saveSurvey(totalQuestionPages);
        if (validatePage(curPage) == true) {
            submit();
        }
    } else {
        // if current page is any other form page, move ahead
        toPage(curPage + 1, false);
    }
}

/**
 * Display the Review page if the user is at the end of survey
 *  @see btnNext
 */
function toReview() {
    console.log("In review section");
    console.log(curPage);
    // Blank pages are always visited
    if (visitedPages.indexOf(totalQuestionPages) < 0) {
        visitedPages.push(totalQuestionPages);
    }

    saveSurvey(totalQuestionPages);
    // Add pages to review menus
    $('div[data-page]').show();
    $('div[data-page=home]').hide();
    $('#page-title').html('Review' + (submitted ? ' <span style="font-size:1rem">(Read Only)</span>' : ''));
    $('#page-title-drawer').html('Review');

    curPage = totalQuestionPages;

    $('#btn-next').html('Submit');
    $('#btn-prev').css('display', 'block');
    $('#btn-delete').css('display', 'block');
    $('.mdl-layout__content').scrollTop(0);
    $('#surveySectionsDrawer a').each(function (i, e) {
        $(e).css('font-weight', 'inherit').removeClass('mdl-color--accent').removeClass('mdl-color-text--accent-contrast');
    });
    $('#surveySectionsDrawer a').last().addClass('mdl-color--accent').addClass('mdl-color-text--accent-contrast');
}

/**
 * Display buttons based upon current page
 * @see toPage
 *      toPage calls this after loading the new page and
 *      setting curPage [GLOBAL] to the new current page
 */
function displayBtns() {

    if (curPage > 0) {
        $('#btn-prev').css('display', 'block');
    } else {
        // if not on first page, display previous button
        $('#btn-prev').css('display', 'none');
    }                 // else, remove previous button

    if (curPage == totalQuestionPages - 1) { // if on last page, make 'Review' button
        $('#btn-next').html('Review');
        $('#bottom-nav').css('display', 'flex');
    } else if (curPage >= 0) { // if on any survey page, show 'Next' and 'Delete'
        $('#btn-next').html('Next');
        $('#btn-next').css('display', 'block');
        $('#btn-delete').html('Delete');
        $('#btn-delete').css('display', 'block');

        $('#bottom-nav').css('display', 'flex');    // dynamic spacer
    } else {    // if not on form pages, don't display navigation buttons
        $('#bottom-nav').css('display', 'none');
    }

    // if on home page, setup home page drawer
    if (curPage == 'home') {
        $('#help-button').hide(); // '#help-button' is bad name

        getSurveys(); // retrieves the surveys to populate home screen

        document.getElementById("surveySectionsDrawer").style.display = 'none'; // hide survey sections
        document.getElementById("homeSectionDrawer").style.display = 'block';   // show home section
        document.getElementById("helpSectionDrawer").style.display = 'block';   // show help section
        $('#page-questions').css('display', 'none');
        $('#page-beach-drawer').css('display', 'none');
        visitedPages = []; // removable
        window.onbeforeunload = null;
    } else if (curPage == 'help') {
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
    } else {
        // hide help page info if navigating away from help page
        $('#help-button').hide();

        // possible links in navbar
        document.getElementById("surveySectionsDrawer").style.display = 'block';
        document.getElementById("homeSectionDrawer").style.display = 'none';
        document.getElementById("helpSectionDrawer").style.display = 'block';
        $('#page-beach-drawer').css('display', 'inline');
        $('#page-beach-drawer').html($('#__beach').val().length > 0 ? $('#__beach').val() : 'Unknown Beach');
    }

    // Dynamically show Favorite button
    if (curPage == '0') $('#__addFavorite').css('display', 'block').next().css('display', 'block');
    else $('#__addFavorite').css('display', 'none').next().css('display', 'none');
    $('.mdl-layout__content').scrollTop(0);

    // Dynamically show current page
    $('#surveySectionsDrawer a').each(function (i, e) {
        if (i === curPage) $(e).css('font-weight', 'bold').addClass('mdl-color--accent').addClass('mdl-color-text--accent-contrast');
        else $(e).css('font-weight', 'inherit').removeClass('mdl-color--accent').removeClass('mdl-color-text--accent-contrast');
    });
}
