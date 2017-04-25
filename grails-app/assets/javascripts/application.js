// This is a manifest file that'll be compiled into application.js.
//
// Any JavaScript file within this directory can be referenced here using a relative path.
//
// You're free to add application-wide JavaScript to this file, but it's generally better
// to create separate JavaScript files as needed.
//
//= require jquery.min.js
//= require jquery-ui.min.js
//= require material.min.js
//= require mdl-selectfield.min.js
//= require beaches.js
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

    function downloadCSV(){
        Surveys.getById(surveyId, function(myData) {

            // var myData = getAllFields();
            console.log(myData);

            var stuff = myData.toString();
            console.log(stuff.toString());

            //delimeters for csv format
            var colDelim = '","';
            var rowDelim = '"\r\n"';

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

            var csvData = 'data:application/csv;charset=utf-8,' + encodeURI(csv);
            nameOfFile = myData["__beach"] + "," + myData["__site"] + ',' + myData['date'] + '.csv';
            var link = document.createElement("a");
            link.setAttribute("href", csvData);
            link.setAttribute("download", nameOfFile);
            document.body.appendChild(link);
            link.click();
        });
    }

    function newSurvey(){
        clearAllFields();
        surveyId = guid();
        surveyDate = new Date();
        $('#DATE_ENTERED').val(dateToLocalDate(surveyDate));
        submitted = false;
        toPage(0);
        $('#page-questions').css('display', 'block');
        window.onbeforeunload = function() {
            saveSurvey(curPage);
            return "Are you sure you want to refresh?";
        };
    }

    function toPage(page) {
        saveSurvey(page);
        if(visitedPages.indexOf(page) < 0)
            visitedPages.push(page);
        $('div[data-page]').hide();
        var p = $('div[data-page=' + page + ']');
        p.show();
        $('#page-title').html(p.data('page-title') + ((submitted && p.data('page-title') !== 'WI Beaches') ? ' <span style="font-size:1rem">(Read Only)</span>' : ''));
        $('#page-title-drawer').html(p.data('page-title'));

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
            document.getElementById("surveySectionsDrawer").style.display = 'none';
            document.getElementById("homeSectionDrawer").style.display = 'block';
            $('#page-questions').css('display', 'none');
            $('#page-beach-drawer').css('display', 'none');
            visitedPages = [];
            window.onbeforeunload = null;
        }
        else {
            document.getElementById("surveySectionsDrawer").style.display = 'block';
            document.getElementById("homeSectionDrawer").style.display = 'none';
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

    function btnPrev() {
        toPage(curPage - 1);
    }

    function btnNext() {
        if (curPage == totalQuestionPages - 1)
            toReview();
        else if (curPage == totalQuestionPages)
            completionCheck();
        else
            toPage(curPage + 1);
    }

    function completionCheck() {
        completePage(curPage);
        if(completedSurvey){
            submit();
        }
        else {
            var dialog = document.querySelector('dialog');
            dialog.showModal();

            // load and display incomplete pages
            var list = $('#incomplete-page-list');
            list.empty();
            incompletePages.forEach(function(page) {
                var pageName = $('div[data-page=' + page + ']').data('page-title');
                list.append('<li><p>' + pageName + '</p></li>');
            });
        }
    }

    function submit(){
        saveSurvey(totalQuestionPages, false);
        console.log("Survey submitted!");//  <-- DOWNLOAD CSV HERE
        downloadCSV();
        submitted = true;
        toPage('home');
    }

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

    function saveSurvey(page, toast) {
        if (typeof(surveyId) === 'undefined' || curPage == 'home') {
            completePage(page);
            return;
        }
        $('#DATE_UPDATED').val(dateToLocalDate(new Date()));
        data = getAllFields();
        data.id = surveyId;
        data.date = surveyDate;
        survey = new Survey(surveyId, data);
        survey.save(function(){
            completePage(page);
        });
        if (toast || toast === undefined) showSaveToast();
    }

    function showSaveToast() {
        'use strict';
        if (submitted) return;
        var snackbarContainer = document.querySelector('#toast-container');
        snackbarContainer.MaterialSnackbar.showSnackbar({message: 'Survey saved!', timeout: 750});
    }

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
        return data;
    }

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
    }

    function closeDrawer() {
        var d = document.querySelector('.mdl-layout');
        d.MaterialLayout.toggleDrawer();
    }

    function completePage(nextPage) {
        completedSurvey = true;
        for(var page = 0; page < totalQuestionPages; page++) {
            var p = $('div[data-page=' + page + '] :input');
            var complete = true;
            p.each(function () {
                //Beach Selection
                if ($(this).attr("id") == '__county' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == '__lake' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'BEACH_SEQ' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'MONITOR_SITE_SEQ' && $(this).val() == "")
                    complete = false;

                //Animals
                if ($(this).attr("id") == 'NO_GULLS' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NO_GEESE' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NO_DOGS' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NO_ANIMALS_OTHER' && $(this).val() == "")
                    complete = false;
                if (parseInt($('#NO_ANIMALS_OTHER').val()) > 0 && $(this).attr("id") == 'NO_ANIMALS_OTHER_DESC' && $(this).val() == "")
                    complete = false;

                //Deceased Animals
                if ($(this).attr("id") == 'NUM_LOONS' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NUM_HERR_GULLS' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NUM_RING_GULLS' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NUM_CORMORANTS' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NUM_LONGTAIL_DUCKS' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NUM_SCOTER' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NUM_HORN_GREBE' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NUM_REDNECKED_GREBE' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NUM_FISH' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NUM_OTHER' && $(this).val() == "")
                    complete = false;
                if (parseInt($('#NUM_OTHER').val()) > 0 && $(this).attr("id") == 'NUM_OTHER_DESC' && $(this).val() == "")
                    complete = false;

                //Debris In water
                if ($(this).attr("id") == 'FLOAT_OTHER_DESC' && $(this).val() == "" && $('#FLOAT_OTHER').get()[0].checked)
                    complete = false;

                //Beach Debris
                if ($(this).attr("id") == 'DEBRIS_OTHER_DESC' && $(this).val() == "" && $('#DEBRIS_OTHER').get()[0].checked)
                    complete = false;
                if ($(this).attr("id") == 'DEBRIS_AMOUNT' && $("#DEBRIS_AMOUNT option:selected").index() < 0)
                    complete = false;

                //Bathers
                if ($(this).attr("id") == 'NO_IN_WATER' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NUM_OUT_OF_WATER' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NO_PEOPLE_BOATING' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NO_PEOPLE_FISHING' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NO_PEOPLE_SURFING' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NO_PEOPLE_WINDSURFING' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NUM_PEOPLE_DIVING' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NO_PEOPLE_CLAMMING' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NO_PEOPLE_OTHER' && $(this).val() == "")
                    complete = false;
                if (parseInt($('#NO_PEOPLE_OTHER').val()) > 0 && $(this).attr("id") == 'NO_PEOPLE_OTHER_DESC' && $(this).val() == "")
                    complete = false;

                //Weather
                if ($(this).attr("id") == 'AIR_TEMP' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'WIND_SPEED' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'WIND_DIR_DEGREES' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'WIND_DIR_DESC' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'WEATHER_DES' && $("#WEATHER_DES option:selected").index() < 0)
                    complete = false;
                if ($(this).attr("id") == 'RAINFALL_LAST_EVENT' && $("#RAINFALL_LAST_EVENT option:selected").index() < 0)
                    complete = false;
                if ($(this).attr("id") == 'RAINFALL' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'RAINFALL_STD_DESC' && $("#RAINFALL_STD_DESC option:selected").index() < 0 && parseInt($('#RAINFALL').val()) > 0)
                    complete = false;

                //Waves
                if ($(this).attr("id") == 'WAVE_HEIGHT' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'WAVE_DIRECTION' && $("#WAVE_DIRECTION option:selected").index() < 0)
                    complete = false;
                if ($(this).attr("id") == 'WAVE_CONDITIONS' && $("#WAVE_CONDITIONS option:selected").index() < 0)
                    complete = false;
                if ($(this).attr("id") == 'CURRENT_SPEED' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'SHORELINE_CURRENT_DIR' && $("#SHORELINE_CURRENT_DIR option:selected").index() < 0)
                    complete = false;

                //Water Conditions
                if ($(this).attr("id") == 'PH' && $(this).val() == "")
                    complete = false;
                if ($('#COLOR_CHANGE').get()[0].checked && $(this).attr("id") == 'COLOR_DESCRIPTION' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'ODOR_DESCRIPTION' && $("#ODOR_DESCRIPTION option:selected").index() < 0)
                    complete = false;
                if ($('#ODOR_DESCRIPTION').val() == 'Other' && $(this).attr("id") == 'ODOR_OTHER_DESCRIPTION' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'AVG_WATER_TEMP' && $(this).val() == "")
                    complete = false;
                if ($(this).attr("id") == 'CLARITY_DESC' && $("#CLARITY_DESC option:selected").index() < 0 && $('#NTU').val() == "")
                    complete = false;
                if ($(this).attr("id") == 'NTU' && $(this).val() == "" && $("#CLARITY_DESC option:selected").index() < 0)
                    complete = false;
                if ($(this).attr("id") == 'SECCHI_TUBE_CM' && $(this).val() == "")
                    complete = false;

                //Algae
                if ($(this).attr("id") == 'ALGAE_NEARSHORE' && $("#ALGAE_NEARSHORE option:selected").index() < 0)
                    complete = false;
                if ($(this).attr("id") == 'ALGAE_ON_BEACH' && $("#ALGAE_ON_BEACH option:selected").index() < 0)
                    complete = false;
                if ($('#ALGAE_TYPE_OTHER').get()[0].checked && $(this).attr("id") == 'ALGAE_TYPE_OTHER_DESC' && $(this).val() == "")
                    complete = false;
                if ($('#ALGAE_COLOR_OTHER').get()[0].checked && $(this).attr("id") == 'ALGAE_COLOR_OTHER_DESC' && $(this).val() == "")
                    complete = false;

                //Comments - Not Required for completion
            });
            if (!visitedPages)
                visitedPages = [];
            if(visitedPages.indexOf(page) < 0 && visitedPages.indexOf(totalQuestionPages) < 0)
                complete = false;

            if (nextPage != 'home' && page >= 0 && page < totalQuestionPages) {
                if (complete) {
                    document.getElementById('Complete_' + page).style.display = 'inline';
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

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

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
                $("#BEACH_SEQ").autocomplete({source: availableTags, change: fillSites});
            }
        }
        saveFavoriteEnabled();
    }

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
                $("#MONITOR_SITE_SEQ").autocomplete({source: availableTags, change: saveFavoriteEnabled});
            }
        }
        saveFavoriteEnabled();
    }

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

    document.getElementById('__beach').onchange = function() {
        updateSeq('#__beach', '#beachList', '#BEACH_SEQ');
    };

    document.getElementById('__site').onchange = function() {
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

    function dateToLocalDate(d) {
        return ('000'+d.getFullYear()).slice(-4) + '-' +
            ('0'+d.getMonth()).slice(-2) + '-' +
            ('0'+d.getDate()).slice(-2) + 'T' +
            ('0'+d.getHours()).slice(-2) + ':' +
            ('0'+d.getMinutes()).slice(-2);
    }
}

function checkDirtyNumber(e){
    e = e || window.event;
    var targ = e.target || e.srcElement;
    if (targ.nodeType == 3) targ = targ.parentNode; // defeat Safari bug
    if(targ.parentNode.classList.contains("is-invalid"))
        targ.parentNode.classList.add("is-dirty");
    else if(targ.value == "")
        targ.parentNode.classList.remove("is-dirty");
    //alert(targ.id);
}
