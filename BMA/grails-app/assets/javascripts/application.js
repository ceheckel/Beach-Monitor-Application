// This is a manifest file that'll be compiled into application.js.
//
// Any JavaScript file within this directory can be referenced here using a relative path.
//
// You're free to add application-wide JavaScript to this file, but it's generally better
// to create separate JavaScript files as needed.
//
//= require bootstrap.min.js
//= require bootstrap-dialog.js
//= require page_validation.js
//= require jquery.min.js
//= require jquery-ui.min.js
//= require dialog-polyfill.js
//= require material.min.js
//= require mdl-selectfield.min.js
//= require faves.js
//= require localforage.js
//= require survey.js
//= require survey_post.js
//= require beaches_sites_get.js
//= require display.js
//= require navigation.js
//= require_tree .
//= require_self

var curPage = -1;   // Page tracker ('home', 'review', 'help', or form pages '1-10'
var surveyDate; // holds the creation date of the survey
var submitted = false; // determines if the survey has been downloaded
var selected = false; // added for mass interactions

var is_safari = (navigator.userAgent.indexOf('Safari') != -1) && (navigator.userAgent.indexOf('Chrome') == -1);

if (typeof jQuery !== 'undefined') {
    (function($) {
        $(document).ajaxStart(function() {
            $('#spinner').fadeIn();
        }).ajaxStop(function() {
            $('#spinner').fadeOut();
        });
    })(jQuery);

    /**
     * Function called when document is ready
     */
    $(document).ready(function() {
        // go to home page
        toPage('home',false);


        $('#btn-menu').click(function() {
            console.log('menu button clicked');
        });

        $('#btn-past-reps').click(function() {
            console.log('past reports');
        });

        $('#btn-dialogSub').click(function() {
            var dialog = document.querySelector('#dialog');
            dialog.close();
            submit();
        });

        $('#btn-dialogCan').click(function() {
            var dialog = document.querySelector('#dialog');
            dialog.close();
        });
    });

    fillCounties();

    document.getElementById('__favorites').onchange = fillFavorite;
    document.getElementById('__county').onfocus = fillCounties;
    document.getElementById('__lake').onfocus = fillLakes;
    document.getElementById('__beach').onfocus = fillBeaches;
    document.getElementById('__site').onfocus = fillSites;
    document.getElementById('__county').onchange = tryPropagate;
    document.getElementById('__lake').onchange = tryPropagate;
    document.getElementById('__beach').onchange = function() {
        tryPropagate();
        updateSeq('#__beach', '#beachList', '#BEACH_SEQ');
    };

    document.getElementById('__site').onchange = function() {
        tryPropagate();
        updateSeq('#__site', '#monitorList', '#MONITOR_SITE_SEQ');
    };

    document.getElementById('__county').onkeyup = saveFavoriteEnabled;
    document.getElementById('__lake').onkeyup = saveFavoriteEnabled;
    document.getElementById('__beach').onkeyup = saveFavoriteEnabled;
    document.getElementById('__site').onkeyup = saveFavoriteEnabled;

    var favorites;
    loadFavorites();

    saveFavoriteEnabled();

    var deleteTimer = 0;

    /**
     * Displays a delete countdown to prevent accidental deletions of surveys
     */
    function deleteCountdown() {
        var btn = $('#btn-delete');
        var btn2 = $('#del-surveys-btn');
        deleteTimer--;
        if (deleteTimer > 0) {
            btn.html('Really? Click again to confirm(' + deleteTimer + ')');
            btn2.html('Really? Click again to confirm(' + deleteTimer + ')');
            setTimeout(deleteCountdown, 1000);
        } else {
            deleteTimer = 0;
            btn.html('Delete');
            btn2.html('Delete');
            btn.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
            btn2.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
        }
    }
}
