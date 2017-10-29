// This is a manifest file that'll be compiled into application.js.
//
// Any JavaScript file within this directory can be referenced here using a relative path.
//
// You're free to add application-wide JavaScript to this file, but it's generally better
// to create separate JavaScript files as needed.
//
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

var curPage = -1;
var completedSurvey;
var visitedPages = [];
var surveyDate;
var submitted = false;
var incompletePages = new Set([]);

var is_safari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;

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
        $('div[data-page]').hide();
        toPage('home');

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
     * Generates and downloads a CSV of the current survey
     */
    function downloadCSV(){
        // Gets current survey from localforage
        Surveys.getById(surveyId, function(myData) {

            // var myData = getAllFields();
            console.log(myData);

            var stuff = myData.toString();
            console.log(stuff.toString());

            //delimeters for csv format
            var colDelim = '","';
            var rowDelim = '"\r\n"';

            // generates rows and columns of csv from survey data
            var csv = '"';
            for (var key in myData) {
                if (myData.hasOwnProperty(key)) {
                    csv += key;
                    csv += colDelim;
                }
            }
            csv += rowDelim;

            for (var key in myData) {
                if (myData.hasOwnProperty(key)) {
                    csv += myData[key];
                    csv += colDelim;
                }
            }
            csv += '"';

            // generates file data for csv
            var csvData = 'data:application/csv;charset=utf-8,' + encodeURI(csv);
            nameOfFile = myData["__beach"] + "," + myData["__site"] + ',' + myData['date'] + '.csv';
            var link = document.createElement("a");
            link.setAttribute("href", csvData);
            link.setAttribute("download", nameOfFile);
            document.body.appendChild(link);
            link.click();
        });
    }

    /**
     * Clears all fields and starts a new survey, navigating to the beach selection page.
     * Sets onbeforeunload function to warn user before refreshing page.
     */
    function newSurvey(){
        // Clears all fields
        clearAllFields();

        // Generate new guid and date
        surveyId = guid();
        surveyDate = new Date();
        $('#DATE_ENTERED').val(dateToLocalDate(surveyDate));
        submitted = false;

        // Navigate to beach selection page
        toPage(0);
        $('#page-questions').css('display', 'block');

        // Set page to warn user before reloading
        window.onbeforeunload = function() {
            saveSurvey(curPage);
            return "Are you sure you want to refresh?";
        };
    }

    /**
     * Navigates to a page, saving all changes to the current survey
     * @param page
     *      The page to be navigated to. This can either be an integer denoting survey page number,
     *      or the string 'home'
     */
    function toPage(page) {
        saveSurvey(page);
        if(visitedPages.indexOf(page) < 0)
            visitedPages.push(page);

        // hide everything, then show only desired page
        $('div[data-page]').hide();
        var p = $('div[data-page=' + page + ']');
        p.show();
        $('#page-title').html(p.data('page-title') + ((submitted && p.data('page-title') !== 'WI Beaches') ? ' <span style="font-size:1rem">(Read Only)</span>' : ''));
        $('#page-title-drawer').html(p.data('page-title'));

        // set current page
        curPage = page;
        if (curPage > 0)
            $('#btn-prev').css('display', 'block');
        else
            $('#btn-prev').css('display', 'none');
        if (curPage == totalQuestionPages - 1) {
            $('#btn-next').html('Review');
            $('#bottom-nav').css('display', 'flex');
        }
        else if (curPage >= 0) {
            $('#btn-next').css('display', 'block');
            $('#btn-next').html('Next');
            $('#bottom-nav').css('display', 'flex');
        }
        else
            $('#bottom-nav').css('display', 'none');
        if (curPage == 'home') {

            $('#help-button').hide();

            document.getElementById("surveySectionsDrawer").style.display = 'none';
            document.getElementById("homeSectionDrawer").style.display = 'block';
            document.getElementById("helpSectionDrawer").style.display = 'block';
            $('#page-questions').css('display', 'none');
            $('#page-beach-drawer').css('display', 'none');
            visitedPages = [];
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
        $('#btn-delete').css('display', 'none');
        $('.mdl-layout__content').scrollTop(0);

        $('#surveySectionsDrawer a').each(function(i,e) {
            if (i === curPage) $(e).css('font-weight', 'bold').addClass('mdl-color--accent').addClass('mdl-color-text--accent-contrast');
            else $(e).css('font-weight', 'inherit').removeClass('mdl-color--accent').removeClass('mdl-color-text--accent-contrast');
        });
    }

    /**
     * Called upon the previous button being pressed in a survey
     */
    function btnPrev() {
        toPage(curPage - 1);
    }

    /**
     * Called upon the next button being pressed in a survey
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
            toPage(curPage + 1);
    }

    /**
     * Checks to see if survey is complete.
     * If survey is incomplete, alerts user of incomplete pages
     */
    function completionCheck() {
        completePage(curPage);
        if(completedSurvey){
            submit();
        }
        else {
            var dialog = document.querySelector('dialog');
            dialog.showModal();

            // load and display incomplete pages
            // var list = $('#incomplete-page-list');
            // list.empty();
            // incompletePages.forEach(function(page) {
            //     var pageName = $('div[data-page=' + page + ']').data('page-title');
            //     list.append('<li><p>' + pageName + '</p></li>');
            // });
        }
    }

    /**
     * Downloads csv, marks survey as submitted, and returns to home page
     */
    function submit(){
        saveSurvey(totalQuestionPages, false);
        console.log("Survey submitted!");//  <-- DOWNLOAD CSV HERE
        downloadCSV();
        submitted = true;
        toPage('home');
    }

    /**
     * Handles navigation to review page
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

    /**
     * Saves survey to localforage
     * @param {Integer} page
     *      Calls completePage on page
     */
    function saveSurvey(page, toast) {
        if (typeof(surveyId) === 'undefined' || curPage == 'home') {
            completePage(page);
            return;
        }
        $('#DATE_UPDATED').val(dateToLocalDate(new Date()));
        $('#MISSING_REQUIRED_FLAG').val(('' + !completedSurvey).toUpperCase());
        data = getAllFields();
        data.id = surveyId;
        data.date = surveyDate;
        survey = new Survey(surveyId, data);
        survey.save(function() {
            completePage(page);
        });
        if (toast || toast === undefined) showSaveToast();
    }

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
     * Loads a survey from local forage and navigates to beach selection page
     * @param {String} id
     *      id of survey to be loaded from local forage
     */
    function loadSurvey(id) {
        surveyId = id;
        Surveys.getById(id, function(survey) {
            submitted = survey['submitted'];
            $('[name]').each(function () {
                $(this).prop('disabled', submitted);
                var nameToString = this.name.toString();
                if ($(this).attr('class') == "mdl-radio__button") {
                    $(this.parentElement.parentElement).children().each(function () {
                        forProp = $(this).prop("for");
                        if (forProp === survey[nameToString]) {
                            this.className += " is-checked";
                        }
                    });
                }
                else if ($(this).attr('class') == "mdl-checkbox__input") {
                    if (survey[nameToString]) {
                        this.parentElement.className += " is-checked";
                        $(this).prop("checked", true);
                    }
                    else {
                        $(this).prop("checked", false);
                    }
                }
                else if (this.name in survey && survey[nameToString])
                {
                    this.value = survey[nameToString];
                    this.parentElement.className += " is-dirty";
                }
            });
            fillCounties();
            fillLakes();
            fillBeaches();
            fillSites();
            updateSeq('#__beach', '#beachList', '#BEACH_SEQ');
            updateSeq('#__site', '#monitorList', '#MONITOR_SITE_SEQ');
            surveyDate = new Date(survey['date']);
            visitedPages = survey['vPages'];
            if(submitted)
                window.onbeforeunload = null;
            else
                window.onbeforeunload = function() {
                    saveSurvey(curPage);
                    return "Are you sure you want to refresh?";
                };
            toPage(0);
        });
    }

    /**
     * Loads saved surveys in local forage and displays them in a list on home page
     */
    function getSurveys() {
        var unsubmittedList = document.getElementById("unsubmitted-reports");
        var submittedList = document.getElementById("submitted-reports");
        // Remove all elements
        while (unsubmittedList.firstChild)
            unsubmittedList.removeChild(unsubmittedList.firstChild);
        // Create header
        var header = document.createElement("li");
        var span1 = document.createElement("span");
        var span2 = document.createElement("span");
        header.className = "mdl-list__item";
        span1.className = "mdl-list__item-primary-content";
        span2.className = "mdl-typography--font-bold";
        span2.appendChild(document.createTextNode("Unsubmitted Reports"));
        header.appendChild(span1);
        span1.appendChild(span2);
        unsubmittedList.appendChild(header);
        //Submitted Reports
        while (submittedList.firstChild)
            submittedList.removeChild(submittedList.firstChild);
        // Create header
        header = document.createElement("li");
        span1 = document.createElement("span");
        span2 = document.createElement("span");
        header.className = "mdl-list__item";
        span1.className = "mdl-list__item-primary-content";
        span2.className = "mdl-typography--font-bold";
        span2.appendChild(document.createTextNode("Past Reports"));
        header.appendChild(span1);
        span1.appendChild(span2);
        submittedList.appendChild(header);
        // Populate list
        Surveys.getAll(function(surveys) {
            surveys.sort(function(a, b){return new Date(b.date) - new Date(a.date)});
            for (var i = 0; i < surveys.length; i++)
            {
                var li = document.createElement("li");
                li.className = "mdl-list__item mdl-list__item--two-line";
                var dataSpan = document.createElement("span");
                dataSpan.className = "mdl-list__item-primary-content";
                var nameSpan = document.createElement("span");
                var infoSpan = document.createElement("span");
                infoSpan.className = "mdl-list__item-sub-title";
                var actionSpan = document.createElement("span");
                actionSpan.className = "mdl-list__item-secondary-content";
                var action = document.createElement("a");
                action.id = surveys[i].id;
                action.className = "mdl-list__item-secondary-action";
                li.onclick = (function() {
                    var id = surveys[i].id;
                    return function() {
                        setTimeout(function()
                        {
                            clearAllFields();
                            loadSurvey(id);
                            toPage(0);
                            $('#page-questions').css('display', 'block');
                        }, 10);
                    }
                })();
                $(li).hover(function(){
                    $(this).css("background-color", "#e4e4e4");
                }, function(){
                    $(this).css("background-color", "white");
                });
                $(li).css('cursor', 'pointer');
                var icon = document.createElement("i");
                icon.className="material-icons";

                nameSpan.appendChild(document.createTextNode((surveys[i].__beach ? surveys[i].__beach : 'Unknown Beach')));
                infoSpan.appendChild(document.createTextNode(getDateFormatted(new Date(surveys[i].date)) + " - Site: " + (surveys[i].__site ? surveys[i].__site : 'Unknown')));
                if(!surveys[i].submitted)
                    icon.appendChild(document.createTextNode("edit"));
                else
                    icon.appendChild(document.createTextNode("visibility"));

                dataSpan.appendChild(nameSpan);
                dataSpan.appendChild(infoSpan);
                action.appendChild(icon);
                actionSpan.appendChild(action);
                li.appendChild(dataSpan);
                li.appendChild(actionSpan);
                if(!surveys[i].submitted)
                    unsubmittedList.appendChild(li);
                else
                    submittedList.appendChild(li);
            }
        });
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
     * Generates a random guid
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
     * Generates the list of counties for beach selection page
     */
    function fillCounties() {
        var list = $('#countyList');
        list.empty();
        if(is_safari) {
            var selector = document.createElement("select");
            selector.id = "countyListSelect";
            //selector.className = "mdl-selectfield__select";
            selector.setAttribute("style","display:none");
            list.append(selector);
            list = $('#countyListSelect');
        }
        Object.keys(beaches).forEach(function(cval) {
            list.append('<option value="' + cval + '"/>');
        });
        if(is_safari) {
            var availableTags = list.find('option').map(function () {
                return this.value;
            }).get();
            $("#__county").autocomplete({source: availableTags, change: fillLakes});
        }
    }

    /**
     * Generates the list of lakes for beach selection page
     */
    function fillLakes() {
        var list = $('#lakeList');
        var county = $('#__county');
        list.empty();
        if (typeof(beaches[county.val()]) !== 'undefined' && Object.keys(beaches).indexOf(county.val()) >= 0) {
            if(is_safari) {
                var selector = document.createElement("select");
                selector.id = "lakeListSelect";
                //selector.className = "mdl-selectfield__select";
                selector.setAttribute("style","display:none");
                list.append(selector);
                list = $('#lakeListSelect');
            }
            Object.keys(beaches[county.val()]).forEach(function (cval) {
                list.append('<option value="' + cval + '"/>');
            });
            if(is_safari) {
                var availableTags = list.find('option').map(function () {
                    return this.value;
                }).get();
                $("#__lake").autocomplete({source: availableTags, change: fillBeaches});
            }
        }
        saveFavoriteEnabled();
    }

    /**
     * Generates the list of beaches for beach selection page
     */
    function fillBeaches() {
        var list = $('#beachList');
        var lake = $('#__lake');
        var county = $('#__county');
        list.empty();
        if (typeof(beaches[county.val()]) !== 'undefined' && typeof(beaches[county.val()][lake.val()]) !== 'undefined' && Object.keys(beaches[county.val()]).indexOf(lake.val()) >= 0) {
            if(is_safari) {
                var selector = document.createElement("select");
                selector.id = "beachListSelect";
                //selector.className = "mdl-selectfield__select";
                selector.setAttribute("style","display:none");
                list.append(selector);
                list = $('#beachListSelect');
            }
            Object.keys(beaches[county.val()][lake.val()]).forEach(function (cval) {
                list.append('<option value="'
                    + cval
                    // + ' (ID: '
                    // + beaches[county.val()][lake.val()][cval]._site
                    // + '" data-entity-id="'
                    // + beaches[county.val()][lake.val()][cval]._site
                    + '"/>');
            });
            if(is_safari) {
                var availableTags = list.find('option').map(function () {
                    return this.value;
                }).get();
                $("#__beach").autocomplete({source: availableTags, change: fillSites});
            }
        }
        saveFavoriteEnabled();
    }

    /**
     * Generates the list of sites for beach selection page
     */
    function fillSites() {
        var list = $('#monitorList');
        // var beach = $('#BEACH_SEQ');
        var beach = $('#__beach');
        var lake = $('#__lake');
        var county = $('#__county');
        list.empty();
        if (typeof(beaches[county.val()]) !== 'undefined' && typeof(beaches[county.val()][lake.val()]) !== 'undefined' && typeof(beaches[county.val()][lake.val()][beach.val()]) !== 'undefined' && Object.keys(beaches[county.val()][lake.val()]).indexOf(beach.val()) >= 0) {
            if(is_safari) {
                var selector = document.createElement("select");
                selector.id = "siteListSelect";
                //selector.className = "mdl-selectfield__select";
                selector.setAttribute("style","display:none");
                list.append(selector);
                list = $('#siteListSelect');
            }
            Object.keys(beaches[county.val()][lake.val()][beach.val()]).forEach(function (cval) {
                if (cval != '_site')
                    list.append('<option value="'
                        + cval
                        // + ' (ID: '
                        // + beaches[county.val()][lake.val()][beach.val()][cval]
                        // + '" data-entity-id="'
                        // + beaches[county.val()][lake.val()][beach.val()][cval]
                        + '"/>');
            });
            if(is_safari) {
                var availableTags = list.find('option').map(function () {
                    return this.value;
                }).get();
                $("#__site").autocomplete({source: availableTags, change: saveFavoriteEnabled});
            }
        }
        saveFavoriteEnabled();
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

    // document.getElementById('__county').oninput = fillLakes;
    // document.getElementById('__lake').oninput = fillBeaches;
    // document.getElementById('BEACH_SEQ').oninput = fillSites;
    // document.getElementById('MONITOR_SITE_SEQ').oninput = saveFavoriteEnabled;
    document.getElementById('__favorites').onchange = fillFavorite;

    document.getElementById('__county').onfocus = fillCounties;
    document.getElementById('__lake').onfocus = fillLakes;
    document.getElementById('__beach').onfocus = fillBeaches;
    document.getElementById('__site').onfocus = fillSites;

    /**
     * Tries to populate dropdown from current value
     */
    function tryPropagate() {
        var county = $('#__county');
        var lake = $('#__lake');
        var beach = $('#__beach');
        var site = $('#__site');
        if (Object.keys(beaches[county.val()]).length === 1) {
            fillLakes();
            lake.val(Object.keys(beaches[county.val()])[0]);
            lake.parent().addClass('is-dirty');
        }
        if (Object.keys(beaches[county.val()][lake.val()]).length === 1) {
            fillBeaches();
            beach.val(Object.keys(beaches[county.val()][lake.val()])[0]);
            beach.parent().addClass('is-dirty');
            updateSeq('#__beach', '#beachList', '#BEACH_SEQ');
        }
        if (Object.keys(beaches[county.val()][lake.val()][beach.val()]).length === 2) {
            fillSites();
            site.val(Object.keys(beaches[county.val()][lake.val()][beach.val()])[1]);
            site.parent().addClass('is-dirty');
            updateSeq('#__site', '#monitorList', '#MONITOR_SITE_SEQ');
        }
    }

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

        // if (opt)
        //     $(stored).val(opt.dataset.entityId);
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
     * Deletes the current survey from localforage
     */
    function deleteSurvey() {
        var btn = $('#btn-delete');
        if (deleteTimer == 0) {
            btn.addClass('mdl-color--red-A700').addClass('mdl-color-text--white');
            deleteTimer = 5;
            btn.html('Really? (' + deleteTimer + ')');
            window.cancelDelete = false;
            setTimeout(deleteCountdown, 1000);
        } else {
            var snackbarContainer = document.querySelector('#toast-container');
            var data = {
                message: 'Deleting survey...',
                actionHandler: function() { window.cancelDelete = true; },
                actionText: 'Undo'
            };
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
            setTimeout(function() {
                if (!window.cancelDelete) {
                    sId = surveyId;
                    surveyId = undefined;
                    Surveys.remove(surveyId, function () {
                        toPage('home');
                    });
                    btn.html('Delete');
                    btn.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
                    deleteTimer = 0;
                }
            }, 3000);
            btn.html('Delete');
            btn.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
        }
    }

    /**
     * Displays a delete countdown to prevent accidental deletions of surveys
     */
    function deleteCountdown() {
        var btn = $('#btn-delete');
        deleteTimer--;
        if (deleteTimer > 0) {
            btn.html('Really? (' + deleteTimer + ')');
            setTimeout(deleteCountdown, 1000);
        } else {
            deleteTimer = 0;
            btn.html('Delete');
            btn.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
        }
    }

    var deleteTimer = 0;

    function collectSampleNow() {
        var d = new Date();
        $('#SAMPLE_DATE_TIME').val(dateToLocalDate(d));
    }

    /**
     * Changes date to localized date
     * @param d
     * @returns {string}
     */
    function dateToLocalDate(d) {
        return ('000'+d.getFullYear()).slice(-4) + '-' +
            ('0'+d.getMonth()).slice(-2) + '-' +
            ('0'+d.getDate()).slice(-2) + 'T' +
            ('0'+d.getHours()).slice(-2) + ':' +
            ('0'+d.getMinutes()).slice(-2);
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
