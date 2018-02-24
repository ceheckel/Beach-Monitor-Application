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
var completedSurvey; // probably removable
// var visitedPages = []; // probably removable
var surveyDate; // holds the creation date of the survey
var submitted = false; // determines if the survey has been downloaded
var selected = false; // added for mass interactions
var incompletePages = new Set([]); // removable

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


    /**
     * Creates and sets two versions of a new Date instance.
     * Version 1 is for the browser to display
     * Version 2 is for the server to store
     */
    function collectSampleNow() {
        var d = new Date(); // get full date/time
        $('#SAMPLE_DATE_TIME_DISPLAYED').val(dateToLocalDate(d, true)); // parse for field display
        $('#SAMPLE_DATE_TIME').val(dateToLocalDate(d, false)); // parse for server info
    }

    function clearBeachFields() {
        $('#__county').val("");
        $('#__lake').val("");
        $('#__beach').val("");
        $('#__site').val("");
    }


    // /**
    //  * Changes boolean flag, meant to be used for mass interactions
    //  */
    // function toggleSelect() {
    //     if(selected == true) { selected = false; }
    //     else { selected = true; }
    // }
}


function OtherChange(id,desc){
    if(parseInt($(id).val()) > 0){
        if(!$(desc).parent().next().is("br"))
            $(desc).parent().after("<br>");
        $(desc).parent().show();
        if($(desc).next().html().indexOf(" *") < 0)
            $(desc).next().html($(desc).next().html()+" *");
        $(desc).addClass('required');
    }
    else{
        $(desc).next().html($(desc).next().html().replace(" *",""));
        $(desc).removeClass('required');
        $(desc).parent().removeClass('is-dirty');
        $(desc).val("");
        if($(desc).parent().next().is("br"))
            $(desc).parent().next().remove();
        $(desc).parent().hide();
    }
}

function OtherCheckbox(id,desc){
    if($(id).get()[0].checked){
        if(!$(desc).parent().next().is("br"))
            $(desc).parent().after("<br>");
        $(desc).parent().show();
        if($(desc).next().html().indexOf(" *") < 0)
            $(desc).next().html($(desc).next().html()+" *");
        $(desc).addClass('required');
    }
    else{
        $(desc).next().html($(desc).next().html().replace(" *",""));
        $(desc).removeClass('required');
        $(desc).parent().removeClass('is-dirty');
        $(desc).val("");
        if($(desc).parent().next().is("br"))
            $(desc).parent().next().remove();
        $(desc).parent().hide();
    }
}

function RainfallChange(fromChange){
    if(parseFloat($('#RAINFALL').val()) > 0){
        if(!$('#RAINFALL_STD_DESC').is(':visible') && fromChange) {
            $('#RAINFALL_STD_DESC').parent().removeClass('is-dirty');
            $('#RAINFALL_STD_DESC').val("");
        }
        if(!$('#RAINFALL_STD_DESC').parent().next().is("br"))
            $('#RAINFALL_STD_DESC').parent().after("<br>");
        $('#RAINFALL_STD_DESC').parent().show();
        if($('#RAINFALL_STD_DESC').next().next().html().indexOf(" *") < 0)
            $('#RAINFALL_STD_DESC').next().next().html($('#RAINFALL_STD_DESC').next().next().html()+" *");
    }
    else{
        $('#RAINFALL_STD_DESC').next().next().html($('#RAINFALL_STD_DESC').next().next().html().replace(" *",""));
        $('#RAINFALL_STD_DESC').parent().addClass('is-dirty');
        $('#RAINFALL_STD_DESC').val("Other");
        if($('#RAINFALL_STD_DESC').parent().next().is("br"))
            $('#RAINFALL_STD_DESC').parent().next().remove();
        $('#RAINFALL_STD_DESC').parent().hide();
    }
}

function OdorChange(){
    if($("#ODOR_DESCRIPTION").val() == 'Other'){
        if(!$('#ODOR_OTHER_DESCRIPTION').parent().next().is("br"))
            $('#ODOR_OTHER_DESCRIPTION').parent().after("<br>");
        $("#ODOR_OTHER_DESCRIPTION").parent().show();
        if($("#ODOR_OTHER_DESCRIPTION").next().html().indexOf(" *") < 0)
            $("#ODOR_OTHER_DESCRIPTION").next().html($("#ODOR_OTHER_DESCRIPTION").next().html()+" *");
        $("#ODOR_OTHER_DESCRIPTION").addClass('required');
    }
    else{
        $("#ODOR_OTHER_DESCRIPTION").next().html($("#ODOR_OTHER_DESCRIPTION").next().html().replace(" *",""));
        $("#ODOR_OTHER_DESCRIPTION").removeClass('required');
        $("#ODOR_OTHER_DESCRIPTION").parent().removeClass('is-dirty');
        $("#ODOR_OTHER_DESCRIPTION").val("");
        if($('#ODOR_OTHER_DESCRIPTION').parent().next().is("br"))
            $('#ODOR_OTHER_DESCRIPTION').parent().next().remove();
        $("#ODOR_OTHER_DESCRIPTION").parent().hide();
    }
}

function TurbidityOrNTUChange(){
    if($("#CLARITY_DESC option:selected").index() > 0){
        if($('#CLARITY_DESC').next().next().html().indexOf(" *") < 0)
            $('#CLARITY_DESC').next().next().html($('#CLARITY_DESC').next().next().html() + " *");
        $('#CLARITY_DESC').addClass('required');
        if(($('#NTU').val() == "")){
            $('#NTU').next().html($('#NTU').next().html().replace(" *", ""));
            $('#NTU').removeClass('required');
        }
    }
    else if($('#NTU').val() == ""){
        if($('#NTU').next().html().indexOf(" *") < 0)
            $('#NTU').next().html($('#NTU').next().html() + " *");
        $('#NTU').addClass('required');
        if($('#CLARITY_DESC').next().next().html().indexOf(" *") < 0)
            $('#CLARITY_DESC').next().next().html($('#CLARITY_DESC').next().next().html() + " *");
        $('#CLARITY_DESC').addClass('required');
    }

    if($('#NTU').val() != "") {
        if($('#NTU').next().html().indexOf(" *") < 0)
            $('#NTU').next().html($('#NTU').next().html() + " *");
        $('#NTU').addClass('required');
        if($("#CLARITY_DESC option:selected").index() <= 0){
            $('#CLARITY_DESC').next().next().html($('#CLARITY_DESC').next().next().html().replace(" *",""));
            $('#CLARITY_DESC').removeClass('required');
        }
    }
}
