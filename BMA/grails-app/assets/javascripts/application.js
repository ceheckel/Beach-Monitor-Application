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
//= require_tree .
//= require_self

var curPage = -1;   // Page tracker ('home', 'review', 'help', or form pages '1-10'
var completedSurvey; // probably removable
var visitedPages = []; // probably removable
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



    /**
     * Creates toast that tells user survey is saved
     */
    function showSaveToast() {
        'use strict';
        if (submitted) return;
        var snackbarContainer = document.querySelector('#toast-container');
        snackbarContainer.MaterialSnackbar.showSnackbar({message: 'Survey saved!', timeout: 750});
    }

    /**
     * Gets all of the fields in the current survey and returns them as a map
     * @returns {{}|*}
     *      Maps the name of each field to its value, including undefined fields
     */
    function getAllFields() {
        data = {};
        $('[name]').each(function () {
            if ($(this).attr('class') == "mdl-radio__button") {
                if (this.parentElement.className.includes('is-checked')) {
                    data[this.name] = $(this).attr("id");
                }
            }
            else if ($(this).attr('class') == "mdl-checkbox__input") {
                if (this.parentElement.className.includes('is-checked'))
                    data[this.name] = true;
                else
                    data[this.name] = false;
            }
            else /*if (this.value)*/ {
                data[this.name] = this.value;
            }
        });
        data['vPages'] = visitedPages;
        data['submitted'] = submitted;
        OtherChange("#NO_ANIMALS_OTHER","#NO_ANIMALS_OTHER_DESC");
        OtherChange("#NO_PEOPLE_OTHER","#NO_PEOPLE_OTHER_DESC");
        OtherChange("#NUM_OTHER","#NUM_OTHER_DESC");
        OtherCheckbox("#FLOAT_OTHER","#FLOAT_OTHER_DESC");
        OtherCheckbox("#DEBRIS_OTHER","#DEBRIS_OTHER_DESC");
        OtherCheckbox("#COLOR_CHANGE","#COLOR_DESCRIPTION");
        OtherCheckbox("#ALGAE_TYPE_OTHER","#ALGAE_TYPE_OTHER_DESC");
        OtherCheckbox("#ALGAE_COLOR_OTHER","#ALGAE_COLOR_OTHER_DESC");
        RainfallChange(false);
        OdorChange();
        TurbidityOrNTUChange();
        return data;
    }

    /**
     * Sets the value of each field in the survey to be the default values
     */
    function clearAllFields() {
        $('[name]').each(function () {
            $(this).prop('disabled', false);
            if (this.value && !this.dataset.keep) {
                this.parentElement.className = this.parentElement.className.replace("is-dirty", "");
                this.value = '';
            }
            if(this.parentElement.classList.contains("is-invalid")){
                this.parentElement.className = this.parentElement.className.replace("is-dirty", "");
                this.parentElement.className = this.parentElement.className.replace("is-invalid", "");
                this.value = '';
            }
            if ($(this).attr('class') == "mdl-radio__button") {
                $(this.parentElement.parentElement).children().each(function () {
                    this.className = this.className.replace("is-checked", "");
                });
            }
            if ($(this).attr('class') == "mdl-checkbox__input") {
                this.parentElement.className = this.parentElement.className.replace("is-checked", "");
            }
        });
        OtherChange("#NO_ANIMALS_OTHER","#NO_ANIMALS_OTHER_DESC");
        OtherChange("#NO_PEOPLE_OTHER","#NO_PEOPLE_OTHER_DESC");
        OtherChange("#NUM_OTHER","#NUM_OTHER_DESC");
        OtherCheckbox("#FLOAT_OTHER","#FLOAT_OTHER_DESC");
        OtherCheckbox("#DEBRIS_OTHER","#DEBRIS_OTHER_DESC");
        OtherCheckbox("#COLOR_CHANGE","#COLOR_DESCRIPTION");
        OtherCheckbox("#ALGAE_TYPE_OTHER","#ALGAE_TYPE_OTHER_DESC");
        OtherCheckbox("#ALGAE_COLOR_OTHER","#ALGAE_COLOR_OTHER_DESC");
        RainfallChange(false);
        OdorChange();
        TurbidityOrNTUChange();
    }

    /**
    * Closes the drawer
    */
    function closeDrawer() {
        var d = document.querySelector('.mdl-layout');
        d.MaterialLayout.toggleDrawer();
    }

    /**
     * Determines if the page is completed or not and marks it as such
     * @param nextPage
     */
    function completePage(nextPage) {
        completedSurvey = true;
        for(var page = 0; page < totalQuestionPages; page++) {
            var p = $('div[data-page=' + page + '] :input');
            var complete = true;
            p.each(function () {
                // Required Fields for POSTing
                if ($(this).attr("id") == '__beach' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == '__site' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'SAMPLE_DATE_TIME' && $(this).val() == "")
                    complete = false;
                /*
                 * Many of the previously required fields are no longer needed.
                 * Large portion of if-then's were removed.
                 * See previous version
                 */
            });
            if (!visitedPages)
                visitedPages = [];
            if(visitedPages.indexOf(page) < 0 && visitedPages.indexOf(totalQuestionPages) < 0)
                complete = false;

            if (nextPage != 'home' && page >= 0 && page < totalQuestionPages) {
                if (complete) {
                    /*
                     * inclusion of the next line provides check marks next to page names on drawer.
                     * With new set of requirements (beach id, site id, and time), most pages are 'complete' by default.
                     * Removed by Heckel
                     */
                    // document.getElementById('Complete_' + page).style.display = 'inline';
                    incompletePages.delete(page);
                }
                else {
                    document.getElementById('Complete_' + page).style.display = 'none';
                    completedSurvey = false;
                    incompletePages.add(page);
                }
            }
        }
        if (nextPage == 'home') {
            for (var i = 0; i < totalQuestionPages; i++) {
                document.getElementById('Complete_' + i).style.display = 'none';
            }
            getSurveys();
        }
    }

    /**
     * Generates a random "global unique identifier"
     * @returns {string} The guid generated
     */
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    /**
     * Enables save favorite button if valid beach information is entered
     */
    function saveFavoriteEnabled() {
        var unique = true;
        if(favorites) {
            favorites.forEach(function (f, i) {
                if (f.county == $('#__county').val() && f.lake == $('#__lake').val() && f.beach == $('#__beach').val() && f.site == $('#__site').val()) {
                    unique = false;
                }
            });
        }
        $('#__addFavorite').prop('disabled',
            !unique ||
            $('#__county').val() == '' ||
            $('#__lake').val() == '' ||
            $('#__beach').val() == '' ||
            $('#__site').val() == '' ||
            submitted
        )
    }

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

    function updateSeq(input, list, stored) {
        var val = $(input).val();
        var opt = undefined;

        $(list).find('> option').each(function() {
            if ($(this).val() === val) opt = this;
        });

        if (opt) {
            var county = $('#__county').val();
            var lake = $('#__lake').val();
            var beach = $('#__beach').val();
            if (input === '#__beach')
                $(stored).val(beaches[county][lake][beach]._site);
            else
                $(stored).val(beaches[county][lake][beach][$('#__site').val()])
        }
    }

    /**
     * Takes a date and returns a formatted string for surveys in home page
     * @param date
     * @returns {number|*|string}
     */
    function getDateFormatted(date) {
        formattedString = "";
        switch (date.getMonth()) {
            case 0:
                formattedString += "Jan. ";
                break;
            case 1:
                formattedString += "Feb. ";
                break;
            case 2:
                formattedString += "Mar. ";
                break;
            case 3:
                formattedString += "Apr. ";
                break;
            case 4:
                formattedString += "May. ";
                break;
            case 5:
                formattedString += "Jun. ";
                break;
            case 6:
                formattedString += "Jul. ";
                break;
            case 7:
                formattedString += "Aug. ";
                break;
            case 8:
                formattedString += "Sep. ";
                break;
            case 9:
                formattedString += "Oct. ";
                break;
            case 10:
                formattedString += "Nov. ";
                break;
            case 11:
                formattedString += "Dec. ";
                break;
        }
        formattedString += date.getDate();
        return formattedString;
    }



    /**
     * Deletes multiple surveys from localforage by calling 'deleteSurvey()'
     */
    function deleteSelected() {
        var selected = $(".mdl-checkbox__input:checked"); // Determines if survey is marked for deletion
        var surveys = []; // collection of all surveys to be deleted
        var promises = []; // each callback is going to promise to return, used to prevent asynch deleting

        // check if any surveys selected
        if (selected.length == 0) {
            alert("No Surveys Selected");
            return;
        }

        var btn = $('#del-surveys-btn');
        if (deleteTimer == 0) { // on first button press
            // change button style
            btn.addClass('mdl-color--red-A700').addClass('mdl-color-text--white');
            deleteTimer = 5;
            btn.html('Really? (' + deleteTimer + ')');
            window.cancelDelete = false;

            // start countdown
            setTimeout(deleteCountdown, 1000);
        } else { // on second button press
            // ready toast
            var snackbarContainer = document.querySelector('#toast-container');
            var data = {
            message: 'Deleting survey...',
                actionHandler: function() { window.cancelDelete = true; },
                actionText: 'Undo'
            };
            snackbarContainer.MaterialSnackbar.showSnackbar(data);

            // start deletion
            setTimeout(function() {
                if (!window.cancelDelete) {

                    // Due to the asynchronous nature of the localforage functions, removing the surveys must be done sequentially
                    // As such, we have opted to use a recursive loop as opposed to a normal for-loop so that we can control the
                    // pace of its execution
                    var i = 0;
                    var loopArray = function() {
                        Surveys.remove(selected[i].parentElement.id, function() {
                            i += 1;

                            // If there are more surveys to remove, continuing removing them
                            if (i < selected.length) {
                                loopArray();
                            }
                            // Otherwise (i.e. last survey removed) navigate back to the home page
                            else {
                                toPage('home', false);
                            }
                        });
                    };

                    loopArray();
                }
            }, 3000);

            // change button back to normal
            btn.html('Delete');
            btn.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
            deleteTimer = 0;
        }
    }

    /**
     * Displays a delete countdown to prevent accidental deletions of surveys
     */
    function deleteCountdown() {
        var btn = $('#btn-delete');
        var btn2 = $('#del-surveys-btn');
        deleteTimer--;
        if (deleteTimer > 0) {
            btn.html('Really? (' + deleteTimer + ')');
            btn2.html('Really? (' + deleteTimer + ')');
            setTimeout(deleteCountdown, 1000);
        } else {
            deleteTimer = 0;
            btn.html('Delete');
            btn2.html('Delete');
            btn.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
            btn2.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
        }
    }

    var deleteTimer = 0;

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

    /**
     * Changes date to localized date
     * @param d
     * @param isDisplay boolean to determine if format is for button or for server
     * @returns {string}
     *
     * @author Heckel (edited)
     */
    function dateToLocalDate(d, isDisplay) {
        if(isDisplay == true) { // The display's version
            return ('000'+d.getFullYear()).slice(-4) + '-' +
                ('0'+(d.getMonth()+1)).slice(-2) + '-' +
                ('0'+d.getDate()).slice(-2) + 'T' +
                ('0'+d.getHours()).slice(-2) + ':' +
                ('0'+d.getMinutes()).slice(-2);
        } else { // The server's version includes seconds and milliseconds
            return ('000'+d.getFullYear()).slice(-4) + '-' +
                ('0'+(d.getMonth()+1)).slice(-2) + '-' +
                ('0'+d.getDate()).slice(-2) + 'T' +
                ('0'+d.getHours()).slice(-2) + ':' +
                ('0'+d.getMinutes()).slice(-2) + ':' +
                ('0'+d.getSeconds()).slice(-2) + '.' +
                ('0'+d.getMilliseconds()).slice(-3) + 'Z';
        }
    }

    /**
     * Changes boolean flag, meant to be used for mass interactions
     */
    function toggleSelect() {
        if(selected == true) { selected = false; }
        else { selected = true; }
    }
}

function checkDirtyNumber(e) {
    e = e || window.event;
    var targ = e.target || e.srcElement;
    if (targ.nodeType == 3) targ = targ.parentNode; // defeat Safari bug
    if(targ.parentNode.classList.contains("is-invalid"))
        targ.parentNode.classList.add("is-dirty");
    else if(targ.value == "")
        targ.parentNode.classList.remove("is-dirty");
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
