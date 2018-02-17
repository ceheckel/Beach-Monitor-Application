/**
 *
 *
 * @author Heckel (edited 02/17/2018)
 * @author Wagner (edited 02/17/2018)
 */

/**
 *
 * @param page
 * @param toDelete
 */
function toPage(page, toDelete) {

    // if deleting survey, ignore validation?
    if(toDelete === false) {
        if (validatePage(curPage) === false) {
            return;
        }
    }

    // save survey
    saveSurvey(page);

    //
    // if(visitedPages.indexOf(page) < 0)
    //     visitedPages.push(page);

    // hide everything, then show only desired page
    $('div[data-page]').hide();
    var p = $('div[data-page=' + page + ']');
    p.show();

    // setup page title
    $('#page-title').html(
        p.data('page-title') +
        ((submitted && (p.data('page-title') !== 'WI Beaches')) ? ' <span style="font-size:1rem">(Read Only)</span>' : '') // if submitted, add '(Read Only)'
    );
    $('#page-title-drawer').html(p.data('page-title'));


    /**
     * display buttons based on current page
     * could be a separate function?
     */
    curPage = page;
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

        document.getElementById("surveySectionsDrawer").style.display = 'none'; // hide survey sections
        document.getElementById("homeSectionDrawer").style.display = 'block';   // show home section
        document.getElementById("helpSectionDrawer").style.display = 'block';   // show help section
        $('#page-questions').css('display', 'none');
        $('#page-beach-drawer').css('display', 'none');
        visitedPages = []; // removable
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

    if (curPage == '0') $('#__addFavorite').css('display', 'block').next().css('display', 'block');
    else $('#__addFavorite').css('display', 'none').next().css('display', 'none');
    $('.mdl-layout__content').scrollTop(0);

    $('#surveySectionsDrawer a').each(function(i,e) {
        if (i === curPage) $(e).css('font-weight', 'bold').addClass('mdl-color--accent').addClass('mdl-color-text--accent-contrast');
        else $(e).css('font-weight', 'inherit').removeClass('mdl-color--accent').removeClass('mdl-color-text--accent-contrast');
    });
}

/**
 *
 */
function btnPrev() {
    toPage(curPage - 1,false);
}

/**
 *
 */
function btnNext() {
    if (curPage == totalQuestionPages - 1)
        toReview();
    else if (curPage == totalQuestionPages) {
        // Save survey here, in case user made changes on review page
        saveSurvey(totalQuestionPages, false);
        completionCheck();
    }
    else
        toPage(curPage + 1,false);
}

/**
 *
 */
function toReview() {
    if(visitedPages.indexOf(totalQuestionPages) < 0)
        visitedPages.push(totalQuestionPages);
    saveSurvey(totalQuestionPages);
    $('div[data-page]').show();
    $('div[data-page=home]').hide();
    $('#page-title').html('Review' + (submitted ? ' <span style="font-size:1rem">(Read Only)</span>' : ''));
    $('#page-title-drawer').html('Review');
    curPage = totalQuestionPages;
    $('#btn-next').html('Download');
    $('#btn-prev').css('display', 'block');
    $('#btn-delete').css('display', 'block');
    $('.mdl-layout__content').scrollTop(0);
    $('#surveySectionsDrawer a').each(function(i,e) {
        $(e).css('font-weight', 'inherit').removeClass('mdl-color--accent').removeClass('mdl-color-text--accent-contrast');
    });
    $('#surveySectionsDrawer a').last().addClass('mdl-color--accent').addClass('mdl-color-text--accent-contrast');
}