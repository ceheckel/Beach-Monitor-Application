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

var curPage = -1;   // Page tracker ('home', 'help', or form pages '1-10'
var surveyDate; // holds the creation date of the survey
var submitted = false; // determines if the survey has been uploaded
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
    // Cascade changes down to each lower field
    document.getElementById('__county').onchange = fillFromCounty;
    document.getElementById('__lake').onchange = fillFromLake;
    document.getElementById('__beach').onchange = fillFromBeach;
    document.getElementById('__beach').onchange = function() {
        //tryPropagate();
        fillSites();
        updateSeq('#__beach', '#BEACH_SEQ');
    };
    document.getElementById('__site').onchange = function() {
        //tryPropagate();
        updateSeq('#__site', '#MONITOR_SITE_SEQ');
        saveFavoriteEnabled();
    };
    document.getElementById('__county').onkeyup = saveFavoriteEnabled;
    document.getElementById('__lake').onkeyup = saveFavoriteEnabled;
    document.getElementById('__beach').onkeyup = saveFavoriteEnabled;
    document.getElementById('__site').onkeyup = saveFavoriteEnabled;

    var favorites = [];
    loadFavorites();
    saveFavoriteEnabled();

    var deleteTimer = 0;  // This needs to be here for some reason don't delete it
}
