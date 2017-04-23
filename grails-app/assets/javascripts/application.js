// This is a manifest file that'll be compiled into application.js.
//
// Any JavaScript file within this directory can be referenced here using a relative path.
//
// You're free to add application-wide JavaScript to this file, but it's generally better
// to create separate JavaScript files as needed.
//
//= require jquery-2.2.0.min
//= require material.min.js
//= require mdl-selectfield.min.js
//= require_tree .
//= require_self

var curPage = -1;
var completedSurvey;
var visitedPages = [];
var surveyDate;
var submitted = false;
var incompletePages = new Set([]);

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
                // action.href = "#";
                // action.onclick = (function() {
                //     var id = surveys[i].id;
                //     return function() {
                //         clearAllFields();
                //         loadSurvey(id);
                //         toPage(0);
                //         $('#page-questions').css('display', 'block');
                //     }
                // })();
                li.onclick = (function(e) {
                    $(e).addClass('mdl-color--grey');
                    var id = surveys[i].id;
                    return function() {
                        clearAllFields();
                        loadSurvey(id);
                        toPage(0);
                        $('#page-questions').css('display', 'block');
                    }
                })();
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

    var beaches = {
        'Adams': {
            'Other': {
                'Patrick Lake Beach': { _site: 425, 'Center of beach': 532,  },
            },
        },
        'Ashland': {
            'Lake Superior': {
                '6th Ave W Beach': {_site: 459, 'Center of beach': 491},
                'Bayview Park Beach': {_site: 173, 'Center of beach': 166},
                'Big Bay State Park Beach': {_site: 4, 'Center of beach': 81},
                'Big Bay Town Park Beach': {_site: 1, 'Center of beach': 192},
                'Casper Road Beach': {_site: 5, 'Center of beach': 82},
                'Kreher Park Beach': {_site: 2, 'Center of beach': 79},
                'La Pointe Memorial Beach': {_site: 6, 'Center of beach': 83},
                'Maslowski Beaches': {_site: 3, 'Center of beach': 80}
            },
            'Loon Lake': {
                'Copper Falls SP Beach': { _site: 298, 'Center of beach': 320,  },
            },
        },
        'Barron': {
            'Other': {
                'SILVER LAKE IN BARRON COUNTY': { _site: 336, 'Center of beach': 517,  },
            },
        },
        'Bayfield': {
            'Lake Superior': {
                'Bark Bay Beaches': {_site: 172, 'Center of beach': 66},
                'Bono Creek Boat Launch Beach': {_site: 219, 'Bono Creek Boat Launch': 227},
                'Broad Street Beach': {_site: 171, 'Center of beach': 165},
                'Herbster Beach': {_site: 170, 'Center of beach': 164},
                'Highway 13 Wayside Beach': {_site: 232},
                'Little Sand Bay Beach': {_site: 244, 'Center of beach': 560},
                'Memorial Beach Bayfield': {_site: 169, 'Center of beach': 163},
                'Memorial Park Beach Washburn': {_site: 168, 'Center of beach': 162},
                'Meyers Beach': {_site: 486, 'Center of beach': 609},
                'Port Wing Beach East': {_site: 152, 'Center of beach': 76},
                'Port Wing Beach West': {_site: 153, 'Center of beach': 77},
                'River Loop Road Beach': {_site: 259},
                'Sioux River Beach North': {_site: 154, 'Center of beach': 151},
                'Sioux River Beach South': {_site: 155, 'North of Kjarvick Rd': 152, 'Between Kjarvick and Friendly Valley Rds': 153},
                'Siskiwit Bay Beach East': {_site: 156, 'Center of beach': 154},
                'Siskiwit Bay Beach West': {_site: 480, 'Center of beach': 588},
                'Thompson West End Park Beach': {_site: 157, 'Center of beach': 155},
                'Washburn Marina Beach': {_site: 158, 'Center of beach': 156},
                'Washburn Walking Trail Beach / BAB Beach': {_site: 159, 'Center of beach': 157},
                'Washington Avenue Beach': {_site: 160, 'Center of beach': 158},
                'Wikdal Memorial Boat Launch Beach': {_site: 161, 'Center of beach': 159}
            }
        },
        'Brown': {
            'Lake Michigan': {
                'Bay Beach': {_site: 215, 'Center of beach': 592},
                'Bayshore Park Beach': {_site: 165, 'Center of beach': 160},
                'Communiversity Park Beach': {_site: 166, 'Center of beach': 161},
                'Joliet Park': {_site: 235},
                'Longtail Beach': {_site: 199, 'Longtail Beach South': 215, 'Longtail Beach North': 191},
                'Sunset Beach Road': {_site: 260},
                'Town of Scott Park Beach': {_site: 269},
                'Van Lanen Beach': {_site: 273},
                'Volk\'s Landing Boat Launch Beach': {_site: 275}
            }
        },
        'Calumet': {
            'Lake Winnebago': {
                'High Cliff SP - Lake Winnebago Beach': { _site: 306, 'Center of beach': 328,  },
            },
        },
        'Chippewa': {
            'Lake Wissota': {
                'Lake Wissota State Park Beach': { _site: 310, 'Center of beach': 332,  },
            },
            'Chippewa River': {
                'Brunet Island State Park Beach': { _site: 296, 'Center of beach': 318,  },
            },
        },
        'Dane': {
            'Other': {
                'MAPLE BLUFF BEACH': { _site: 349,  },
                'Fireman\'s Park Beach': { _site: 424, 'Center of beach': 527,  },
            },
            'Lake Kegonsa': {
                'Lake Kegonsa State Park Beach': { _site: 309, 'Center of beach': 331,  },
            },
            'Lake Mendota': {
                'Gov Nelson State Park -- Lake Mendota': { _site: 304, 'Center of beach': 326,  },
            },
        },
        'Dodge': {
            'Other': {
                'Crystal Lake (Dodge Cty) - City Beach': { _site: 428, 'Center of beach': 535,  },
                'Rock River -  River Bend Park': { _site: 343, 'Center of beach': 428,  },
                'Lake Sinsissippi - Butternut Island': { _site: 414, 'Center of beach': 424,  },
                'Lake Sinsissippi - Hubbard Boat Launch': { _site: 413, 'Center of beach': 427,  },
                'Lake Sinsissippi - Neider Park Landing': { _site: 415, 'Center of beach': 425,  },
                'Lake Sinsissippi - Hustisford Ski Club Dock': { _site: 416, 'Center of beach': 426,  },
            },
        },
        'Door': {
            'Lake Michigan': {
                'Anclam Park Beach': {_site: 26, 'Center of beach': 98},
                'Arrowhead Lane Beach': {_site: 214},
                'Baileys Harbor Ridges Park Beach': {_site: 13, 'Center of beach': 84},
                'Bittersweet Lane Beach': {_site: 218},
                'Braunsdorf Beach': {_site: 220},
                'Chippewa Drive Beach': {_site: 221},
                'Clay Banks Beach 1': {_site: 222},
                'Clay Banks Beach 2': {_site: 223, 'Center of beach': 225},
                'Cliff View Drive Beach': {_site: 224},
                'County TT Beach': {_site: 226},
                'Deer Path Lane Beach': {_site: 227},
                'Egg Harbor Beach': {_site: 14, 'Center of beach': 85},
                'Ellison Bay Town Park Beach': {_site: 15, 'Center of beach': 86},
                'Ephraim Beach': {_site: 16, 'Center of beach': 87},
                'Europe Bay Beach 1': {_site: 28, 'Center of beach': 70},
                'Europe Bay Beach 2': {_site: 29, 'Center of beach': 100},
                'Europe Bay Beach 3': {_site: 30, 'Center of beach': 71},
                'Fish Creek Beach': {_site: 19, 'Center of beach': 91},
                'Garrett Bay Boat Launch Beach': {_site: 229},
                'Gislason Beach': {_site: 27, 'Center of beach': 99},
                'Goldenrod Lane Beach': {_site: 230},
                'Haines Park Beach': {_site: 39, 'Center of beach': 108},
                'Hemlock Lane Beach': {_site: 231},
                'Isle View Beach': {_site: 233},
                'Jackson Harbor Ridges - WI': {_site: 31, 'Center of beach': 101},
                'Kickapoo Drive Beach': {_site: 236},
                'Lakeshore Drive Beach Door': {_site: 238},
                'Lakeside Park Beach': {_site: 32, 'Center of beach': 102},
                'Lily Bay Boat Launch Beach': {_site: 242, 'Lily Bay Boat Launch Beach': 368},
                'Murphy Park Beach': {_site: 17, 'Center of beach': 88},
                'Newport Bay Beach': {_site: 18, 'Parking lot 2': 90, 'Parking lot 3': 89},
                'Nicolet Beach': {_site: 20, 'Center of beach': 92},
                'Otumba Park Beach': {_site: 21, 'Center of beach': 75},
                'Pebble Beach Road Beach 1 Door': {_site: 251},
                'Percy Johnson Memorial Park Beach': {_site: 34, 'Center of beach': 103},
                'Portage Park Beach': {_site: 203, 'Center of beach': 203},
                'Potawatomi State Park Beach 1': {_site: 253},
                'Potawatomi State Park Beach 2': {_site: 254},
                'Robert E LaSalle Park': {_site: 492, 'Center of beach': 618},
                'Rock Island State Park Beach': {_site: 40, 'Center of beach': 109},
                'Sand Bay Beach 1': {_site: 261, 'Sand Bay Beach 1': 366},
                'Sand Bay Beach 2': {_site: 262},
                'Sand Cove': {_site: 263},
                'Sand Dune Beach': {_site: 35, 'Center of beach': 104},
                'Sandy Bay Town Park Beach': {_site: 36, 'Center of beach': 105},
                'School House Beach': {_site: 37, 'Center of beach': 106},
                'Sister Bay Beach': {_site: 22, 'Center of beach': 93},
                'Sturgeon Bay Ship Canal Nature Preserve': {_site: 38, 'Center of beach': 107},
                'Sunset Beach Fish Creek': {_site: 23, 'Center of beach': 94},
                'Sunset Park Beach Sturgeon Bay': {_site: 24, 'Center of beach': 95},
                'White Pine Lane Beach': {_site: 278},
                'Whitefish Bay Boat Launch Beach': {_site: 279, 'Center of beach': 281},
                'Whitefish Dunes Beach': {_site: 25, 'Interpretive center office access point': 96, 'Hwy WD access point': 97},
                'Winnebago Drive Beach': {_site: 282}
            },
            'Other': {
                'Clark Lake': { _site: 453, 'Center of beach': 543,  },
                'Kangaroo Lake': { _site: 454, 'Center of beach': 544,  },
                'Europe Lake Beach': { _site: 455, 'Center of beach': 545,  },
            },
        },
        'Douglas': {
            'Lake Superior': {
                'Allouez Bay Lot 10': {_site: 69, 'Center of beach': 64},
                'Amnicon River Beach': {_site: 70, 'Center of beach': 65},
                'Barker\'s Island Inner Beach': {_site: 66, 'Center of beach': 110},
                'Brule River State Forest Beach 1': {_site: 72, 'Center of beach': 111},
                'Brule River State Forest Beach 2': {_site: 73, 'Center of beach': 68},
                'Brule River State Forest Beach 3': {_site: 74, 'Center of beach': 69},
                'Middle River Beach': {_site: 75, 'Center of beach': 112},
                'Wisconsin Point Dutchman Creek (#3)': {_site: 78, 'Moccasin Mike Rd': 121},
                'Wisconsin Point Lighthouse (# 5)': {_site: 292, 'N-S#5': 231},
                'Wisconsin Point Lot 1 (#1)': {_site: 76, 'N-S#1, northern most access point': 113, 'N-S#8, southern most access point': 120, 'N-S#2': 114, 'N-S#3': 115, 'N-S#4': 116, 'N-S#5': 117, 'N-S#6': 118, 'N-S#7': 119},
                'Wisconsin Point Lot 12': {_site: 482, 'Center of beach': 597},
                'Wisconsin Point SE of Breakwater (#4)': {_site: 291, 'N-S#4': 230},
                'Wisconsin Point Shafer Beach (#2)': {_site: 77, 'Center of beach': 78}
            },
            'Interfalls Lake': {
                'Pattison State Park Beach': { _site: 313, 'Center of beach': 335,  },
            },
        },
        'Fond du Lac': {
            'Whitewater Lake': {
                'Whitewater Lake - Kettle Moraine SF - Southern Unit': { _site: 321, 'Center of beach': 343,  },
            },
            'Long Lake South Beach': {
                'Kettle Moraine SF - Northern Unit - Long Lake South Beach': { _site: 324, 'Center of beach': 346,  },
            },
            'Mauthe Lake': {
                'Kettle Moraine SF - Northern Unit - Mauthe Lake': { _site: 322, 'Center of beach': 344,  },
            },
            'Long Lake North Beach': {
                'Kettle Moraine SF - Northern Unit - Long Lake North Beach': { _site: 323, 'Center of beach': 345,  },
            },
        },
        'Green': {
            'Beckman Lake': {
                'Browntown-Cadiz Springs SRA - Beckman Lake': { _site: 295, 'Center of beach': 317,  },
            },
        },
        'Green Lake': {
            'Other': {
                'Silver Creek -- West of Ripon': { _site: 427, 'Center of beach': 534,  },
                'Dodge County Park Beach': { _site: 423, 'Center of beach': 526,  },
                'Hattie Sherwood Beach': { _site: 398, 'Center of beach': 395,  },
                'Silver Creek -- Spaulding Road': { _site: 426, 'Center of beach': 533,  },
                'Sunset County Park': { _site: 421, 'Center of beach': 518,  },
                'Pilgrim Center Beach': { _site: 399, 'Center of beach': 398,  },
                'COUNTY PARK CTY K WEST': { _site: 395, 'Center of beach': 514,  },
                'COUNTY PARK INLET': { _site: 397, 'Center of beach': 515,  },
                'Aba Beach': { _site: 396, 'Center of beach': 397,  },
                'Camp Grow Beach': { _site: 394, 'Center of beach': 396,  },
            },
        },
        'Iowa': {
            'Cox Hollow Lake': {
                'Cox Hollow Beach - Gov Dodge SP': { _site: 303, 'Center of beach': 325,  },
            },
            'Twin Valley Lake': {
                'Twin Valley Beach -- Gov Dodge SP': { _site: 302, 'Center of beach': 324,  },
            },
        },
        'Iron': {
            'Lake Superior': {
                'Oronto Bay Beach 1': {_site: 82, 'Center of Beach': 199},
                'Oronto Bay Beach 2': {_site: 81, 'Center of Beach': 200},
                'Oronto Bay Beach 3': {_site: 80, 'Center of Beach': 201},
                'Saxon Harbor Beach East': {_site: 174, 'Center of beach': 167},
                'Saxon Harbor Beach West': {site: 83, 'Center of beach': 122}
            },
            'Other': {
                'Lake of the Falls Beach': { _site: 475, 'Center of beach': 583,  },
                'Grand Portage Lake': { _site: 477, 'Center of beach': 585,  },
                'Weber Beach': { _site: 476, 'Center of beach': 584,  },
                'Gile Flowage Beach': { _site: 474, 'Center of beach': 582,  },
            },
            'Sandy Lake': {
                'Sandy Beach': { _site: 458, 'Center of beach': 581,  },
            },
        },
        'Jackson': {
            'Other': {
                'East Arbutus': { _site: 409, 'Center of beach': 399,  },
                'West Arbutus': { _site: 412, 'Center of beach': 401,  },
                'Wazee Lake': { _site: 411, 'Center of beach': 400,  },
            },
            'Robinson Pond': {
                'Black River Fall SF-Robinson Pond': { _site: 317, 'Center of beach': 339,  },
            },
            'Pigeon Creek Flowage': {
                'Black River Fall SF--Pigeon Creek': { _site: 316, 'Center of beach': 338,  },
            },
        },
        'Jefferson': {
            'Other': {
                'Lake Ripley Beach': { _site: 401, 'Center of beach': 502,  },
                'Rock Lake Ferry Park Beach': { _site: 400, 'Center of beach': 503,  },
                'Lower Spring Lake Beach': { _site: 402, 'Center of beach': 501,  },
            },
            'Rock Lake': {
                'Sandy Beach West': { 'Center of Beach': 615, _site: 489,  },
                'Tyranena Park': { 'Center of Beach': 616, _site: 490,  },
                'Bartel\'s Beach': { 'Center of Beach': 612, _site: 487,  },
                'Sandy Beach East': { 'Center of Beach': 614, _site: 488,  },
            },
        },
        'Juneau': {
            'Castle Rock Lake': {
                'Buckhorn State Park Beach': { _site: 297, 'Center of beach': 319,  },
            },
        },
        'Kenosha': {
            'Lake Michigan': {
                'Alford Park Beach': {_site: 87, 'North parking area': 127, 'South parking area': 126},
                'Eichelman Beach': {_site: 85, 'Center of beach': 123},
                'Lakeshore Drive Beach Kenosha': {_site: 239, 'North': 605, 'South': 606},
                'Melissa Beach': {_site: 245},
                'Pennoyer Park Beach': {_site: 88, 'Center of beach': 128},
                'Simmons Island Beach': {_site: 86, '51st St parking lot': 125, 'Beach house': 124},
                'Southport Park Beach': {_site: 89, 'Center of beach': 129}
            },
            'Vern Wolf Lake': {
                'Richard Bong State Rec Area - Vern Wolf Lake Beach': { _site: 294, 'Center of beach': 316,  },
            },
        },
        'Kewaunee': {
            'Lake Michigan': {
                '9th Avenue Wayside Beach': {_site: 212},
                'City Of Kewaunee Beach': {_site: 175, 'Center of beach': 168},
                'Crescent Beach': {_site: 197, 'Visitors center': 189, 'Boardwalk': 190},
                'Lighthouse Vista Beach': {_site: 241},
                'Pioneer Park': {_site: 496},
                'Red River Park Beaches': {_site: 258}
            }
        },
        'Lafayette': {
            'Yellowstone Lake': {
                'Yellowstone Lake State Park Swim Beach': { _site: 315, 'Center of beach': 337,  },
            },
        },
        'Lincoln': {
            'Other': {
                'Echo Lake': { _site: 355, 'Center of beach': 407,  },
                'Crystal Lake(Lincoln Cty)': { _site: 354, 'Center of beach': 406,  },
                'Otter Lake': { _site: 356, 'Center of beach': 404,  },
                'Sara Park Beach': { _site: 422, 'Center of beach': 519,  },
                'Tug Lake': { _site: 357, 'Center of beach': 405,  },
            },
            'Wisconsin River': {
                'Council Grounds State Park Beach': { _site: 299, 'Center of beach': 321,  },
            },
        },
        'Manitowoc': {
            'Lake Michigan': {
                'Blue Rail Marina Beach': {_site: 181, 'Center of beach': 174},
                'Fischer Park Beaches': {_site: 185, 'Center of beach': 181},
                'Hika Park Bay': {_site: 180, 'Center of beach': 173},
                'Lincoln High School Beach': {_site: 243},
                'Memorial Drive Mariners at Waldo': {_site: 183, 'Center of beach': 178},
                'Memorial Drive Parkway': {_site: 182, 'Center of beach': 175},
                'Memorial Drive Thiede': {_site: 481, 'Center of beach': 589},
                'Memorial Drive Wayside Beach Middle': {_site: 246},
                'Neshotah Beach': {_site: 184, 'Center of beach': 180},
                'Point Beach State Forest - Concession Stand Beach': {_site: 287, 'Concession Stand Beach (Site 1)': 170},
                'Point Beach State Forest - Lakeshore Picnic Area Beach': {_site: 288, 'Lakeshore Picnic Area Beach (Site 2)': 171},
                'Point Beach State Forest - Lighthouse Picnic Area Beach': {_site: 179, 'Lighthouse Picnic Area Beach (Site 3)': 172},
                'Red Arrow Park Beach Manitowoc': {_site: 186, 'Center of beach': 182},
                'Silver Creek Beach': {_site: 268},
                'Two Creek Boat Launch Beach': {_site: 270},
                'University Beach': {_site: 271},
                'YMCA Beach': {_site: 210, 'Center of beach': 224}
            }
        },
        'Marinette': {
            'Lake Michigan': {
                'Michaelis Park Beach': {_site: 247},
                'Peshtigo Harbor Boat Launch Beach': {_site: 252},
                'Red Arrow Marinette 1 Beach': {_site: 255, 'Red Arrow Marinette 1 Beach': 561},
                'Red Arrow Marinette 2 Beach': {_site: 256, 'Red Arrow Marinette 2 Beach': 562},
                'Red Arrow Marinette 3 Beach': {_site: 257, 'Red Arrow Marinette 3 Beach': 563}
            },
            'Other': {
                'Town of Dunbar Beach -- Lily Lake': { _site: 429, 'Center of beach': 536,  },
            },
            'Caldron Falls Flowage': {
                'Musky Point Beach': { _site: 462, 'Center of beach': 569,  },
            },
            'Old Veteran Lake': {
                'Old Veteran Lake Beach': { _site: 333, 'Center of beach': 369,  },
            },
        },
        'Milwaukee': {
            'Lake Michigan': {
                'Atwater Park Beach': {_site: 149, 'Center of beach': 149},
                'Bay View Park Beach': {_site: 216, 'Center of beach': 225},
                'Bender Beach': {_site: 131, 'B1': 433, 'B2': 434, 'B3': 435, 'Center of beach': 138},
                'Big Bay Park Beach': {_site: 217},
                'Bradford Beach': {_site: 194, 'North end of beach': 185, 'South end of beach': 186, 'Center of beach': 311},
                'Grant Park Beach': {_site: 132, 'Grant Park Beach 2 (northernmost)': 212, 'Center of beach': 280, 'G1': 429, 'G2': 430, 'G3': 431, 'G4': 432, 'Grant Park Beach 1 (southernmost)': 139},
                'Klode Park Beach': {_site: 150, 'Center of beach': 150},
                'McKinley Beach': {_site: 195, 'Center of beach': 187},
                'Sheridan Park Beach': {_site: 165},
                'South Shore Beach': {_site: 196, 'Center of beach': 188},
                'Tietjen Beach / Doctor\'s Park': {_site: 115, 'Center of beach': 130},
                'Watercraft Beach': {_site: 289, 'Center of beach': 228}
            }
        },
        'Monroe': {
            'Unnamed pond': {
                'Mill Bluff State Park Beach': { _site: 311, 'Center of beach': 333,  },
            },
        },
        'Oconto': {
            'Lake Michigan': {
                'Oconto City Park': {_site: 249}
            }
        },
        'Oneida': {
            'Other': {
                'Clear Lake Picnic Beach': { _site: 430, 'Center of beach': 537,  },
            },
            'Clear Lake': {
                'Clear Lake Campground Beach': { _site: 326, 'Center of beach': 348,  },
            },
        },
        'Ozaukee': {
            'Lake Michigan': {
                'Cedar Beach Rd Beach': {_site: 116, 'Cedar beach': 131},
                'Concordia University': {_site: 435, 'public beach': 436},
                'County Road D Boat Launch Beach': {_site: 117, 'County Hwy D': 132},
                'Harrington State Park Beach North': {_site: 118, 'Harrington North Beach': 133},
                'Harrington State Park Beach South': {_site: 198, 'Harrington South beach': 61},
                'Jay Road Beach': {_site: 234},
                'Lion\'s Den Gorge Nature Preserve': {_site: 207, 'Northern site': 314, 'Southern site': 218},
                'Pebble Road Beach': {_site: 208, 'Center of beach': 219},
                'Sandy Beach Road Beach': {_site: 209, 'Center of beach': 220},
                'Silver Beach Road Beach': {_site: 267},
                'Upper Lake Park Beach': {_site: 119, 'Upper Lake Park (Southern)': 210, 'Offshore Valley Creek': 530, 'Main Channel Inner Harbor': 531, 'Valley Creek Outfall': 520, 'North Slip': 521, 'West Slip': 522, 'Sauk Creek': 523, 'PWTP': 524, 'WE Energies': 525, 'Upper Lake Park (Northern)': 134},
                'Virmond County Park': {_site: 274}
            }
        },
        'Pierce': {
            'St. Croix River': {
                'Kinnickinnic SP': { _site: 308, 'Center of beach': 330,  },
            },
        },
        'Polk': {
            'Lake o\' the Dalles': {
                'Interstate SP': { _site: 307, 'Center of beach': 329,  },
            },
        },
        'Price': {
            'Other': {
                'Solberg Lake Campground Beach': { _site: 379, 'Center of beach': 512,  },
                'Pixley Flowage -- Smith Lake County Park': { _site: 431, 'Center of beach': 538,  },
                'Phillips City Beach': { _site: 378, 'Center of beach': 511,  },
                'Newman Lake Campground Beach': { _site: 392, 'Center of beach': 513,  },
                'Timm\'s Hill Park Beach': { _site: 376, 'Center of beach': 510,  },
                'Buccaneer Pond': { _site: 393, 'Center of beach': 422,  },
            },
            'Solberg  Lake': {
                'Solberg  Lake North Swimming Beach': { _site: 456, 'Center of beach': 559,  },
            },
        },
        'Racine': {
            'Lake Michigan': {
                '5 1/2 Mile Road': {_site: 493, 'Center of beach': 619},
                'North Beach': {_site: 126, 'North Beach 1 (southernmost)': 206, 'North Beach 2': 207, 'North Beach 3': 135, 'North Beach 4 (northernmost)': 136},
                'Olympia Center (Curley Rd)': {_site: 494, 'Center of beach': 620},
                'Parkway Beach': {_site: 250, 'Center of beach': 567},
                'Shoop Park Beach': {_site: 266, 'Center of beach': 568},
                'Siena Center': {_site: 495, 'Center of beach': 621},
                'Wind Point Lighthouse Beach': {_site: 281, 'Center of beach': 568},
                'Zoo Beach': {_site: 127, 'Zoo Beach 2': 208, 'Zoo Beach 3 (northernmost)': 209, 'Zoo Beach 1 (southernmost)': 137}
            }
        },
        'Rock': {
            'Other': {
                'Rock River Traxler Park Skier\'s Platform': { _site: 347, 'Center of beach': 421,  },
                'Lion\'s Beach': { _site: 348, 'Center of beach': 516,  },
                'Lakeland Campground Beach -- 2803 E. State Rd. 59': { _site: 345, 'Center of beach': 419,  },
                'Clear Lake, Rock County': { _site: 346, 'Center of beach': 420,  }
            },
            'Spring Brook': {
                'Palmer Park Beach': { 'Palmer Park Beach': 564, _site: 460,  },
            },
            'Lake Koshkonong': {
                'Lakeview Campground Beach -- 1901 E. State Rd. 59': { _site: 334, 'Center of beach': 370,  },
            },
        },
        'Sauk': {
            'Devils Lake North Beach': {
                'Devil\'s Lake SP - North Shore Beach': { _site: 300, 'Center of beach': 322,  },
            },
            'Devils Lake South Beach': {
                'Devil\'s Lake State Park - South Shore Beach': { _site: 301, 'Center of beach': 323,  },
            },
            'Mirror Lake': {
                'Mirror Lake SP Beach': { _site: 312, 'Center of beach': 334,  },
            },
        },
        'Sawyer': {
            'Connors Lake': {
                'Flambeau River State Forest Beach - Connors Lake': { _site: 319, 'Center of beach': 341,  },
            },
            'Lake of the Pines': {
                'Flambeau River State Forest -- Lake of the Pines': { _site: 318, 'Center of beach': 340,  },
            },
        },
        'Sheboygan': {
            'Lake Michigan': {
                '3rd Street Beach': {_site: 211},
                'Amsterdam Beach': {_site: 213, 'East of grassy area': 284},
                'Blue Harbor Beach': {_site: 290, 'Blue Harbor': 226},
                'Deland Park Beach': {_site: 137, 'Between jetty and break': 144, 'Beach house': 145},
                'Foster Road Beach': {_site: 228},
                'General King Park Beach': {_site: 138, 'Illinois Ave': 146, 'Broadway Ave': 147, 'Alabama Ave': 148},
                'KK Road Beach': {_site: 237, 'East of pier': 282},
                'Kohler Andrae State Park North/Nature Center Beach': {_site: 484, 'North of natural area': 599, 'Center of beach': 601},
                'Kohler Andrae State Park Picnic Beach North and South': {_site: 485, 'Center of beach south picnic': 600, 'Center of beach': 602},
                'Lakeview Park Beach': {_site: 240},
                'Van Ess Road Beach': {_site: 272, 'East of post': 283},
                'Vollrath Park Beach': {_site: 276},
                'Whitcomb Avenue Beach': {_site: 277},
                'Wilson Lima Beach / White\'s Beach': {_site: 280}
            }
        },
        'St. Croix': {
            'Other': {
                'Perch Lake Beach': { _site: 373, 'Center of beach': 408,  },
                'Eau Galle Rec Area Beach': { _site: 364, 'Center of beach': 413,  },
                'Apple River Upper': { _site: 360, 'Center of beach': 416,  },
                'Pembles Beach': { _site: 372, 'Center of beach': 412,  },
                'Apple River Midpoint': { _site: 359, 'Center of beach': 418,  },
                'Glen Hills Beach': { _site: 365, 'Center of beach': 415,  },
                'Apple River - Star Prairie Town Park': { _site: 420, 'Center of beach': 542,  },
                'Lake Front Beach': { _site: 367, 'Center of beach': 394,  },
                'Mary Park Beach': { _site: 371, 'Center of beach': 414,  },
                'Hinman Park Beach': { _site: 366, 'Center of beach': 423,  },
                'Troy Beach': { _site: 374, 'Center of beach': 411,  },
                'Brown\'s Beach': { _site: 362, 'Center of beach': 409,  },
                'YMCA Beach': { _site: 375, 'Center of beach': 410,  },
                'Apple River Lower Site': { _site: 358, 'Center of beach': 417,  },
            },
            'Little Falls Lake': {
                'Willow River SP Little Fall Lake Beach': { _site: 314, 'Center of beach': 336,  },
            },
        },
        'Taylor': {
            'Other': {
                'Wood Lake': { _site: 353, 'Center of beach': 391,  },
                'Sackett Lake Beach': { _site: 351, 'Center of beach': 393,  },
                'South Harper Beach': { 'Center of Beach': 390, _site: 350,  },
                'Wellington Lake Beach': { _site: 352, 'Center of beach': 392,  },
            },
        },
        'Trempealeau': {
            'Trempealeau River': {
                'Trempealeau River - Pietrek County Park Beach': { 'Center of Beach': 617, _site: 491,  },
            },
        },
        'Vilas': {
            'Other': {
                'Kentuck Lake Beach': { _site: 440, 'Center of beach': 550,  },
                'Crystal Lake Beach': { _site: 445, 'Center of beach': 555,  },
                'Hunter Lake Beach': { _site: 438, 'Center of beach': 548,  },
                'Lac Vieux Desert Beach': { _site: 447, 'Center of beach': 557,  },
                'Black Oak Lake Beach': { _site: 448, 'Center of beach': 558,  },
                'Brandy Lake Beach': { _site: 437, 'Center of beach': 547,  },
                'Anvil Lake Beach': { _site: 441, 'Center of beach': 551,  },
                'Big Arbor Vitae Beach': { _site: 446, 'Center of beach': 556,  },
                'Eagle Lake Beach': { _site: 443, 'Center of beach': 553,  },
                'North Twin Beach': { _site: 439, 'Center of beach': 549,  },
                'Silver Lake Beach': { _site: 442, 'Center of beach': 552,  },
                'Presque Isle Swim Beach': { _site: 473, 'Center of beach': 580,  },
                'Crystal Lake  Beach Left (Vilas Cty)': { 'Left': 539, _site: 432,  },
                'Torch Lake Beach': { _site: 444, 'Center of beach': 554,  },
            },
            'Nichols Lake': {
                'Nichols Lake Picnic Beach': { _site: 331, 'Center of beach': 353,  },
            },
            'Jag Lake': {
                'Jag Lake Beach': { _site: 328, 'Center of beach': 350,  },
            },
            'Crystal Lake': {
                'Crystal Lake Beach - Right (Vilas Cty)': { 'Left': 349, _site: 327, 'Right': 528,  },
            },
            'Little Star Lake': {
                'Little Star Lake Picnic Beach': { _site: 330, 'Center of beach': 352,  },
            },
            'Big Muskellunge Lake': {
                'Big Muskellunge Lake Group Campground Beach': { _site: 332, 'Center of beach': 354,  },
            },
            'Lake Tomahawk': {
                'Indian Mounds Picnic Beach': { _site: 329, 'Center of beach': 351,  },
            },
        },
        'Walworth': {
            'Other': {
                'Memorial Park at Booth Lake': { _site: 337, 'Center of beach': 403,  },
                'Village of Fontana Public Beach': { 'LAGOON STORM SEWER': 529, 'C.C. BEACH SOUTH OF CHANNEL': 389, 'SWIM PIER': 373, _site: 407, 'GUARD STAND': 374, 'ABBY CHANNEL': 372, 'NORTH END OF BEACH': 375,  },
                'City of Lake Geneva Public Beach': { 'SWIM PIER': 377, _site: 405, 'WEST END': 378, 'EAST END': 376,  },
                'Town of Linn - Robinson Hillside Creek': { 'SWIM AREA': 385, 'CREEK/LAKE MIXING ZONE': 386, _site: 406, 'CREEK': 387,  },
                'Linn Pier Road Beach': { 'BEACH/SWIM AREA': 505, _site: 417,  },
                'Rice Lake Beach': { _site: 433, 'Center of beach': 540,  },
                'Delavan Township Park': { _site: 436, 'Center of beach': 546,  },
                'Williams Bay Public Beach': { 'CREEK/LAKE MIXING ZONE': 381, 'SWIM PIER': 382, _site: 408, 'WEST MIXING ZONE IN LAKE': 380, 'EAST MIXING ZONE IN LAKE': 384, 'EAST END OF BEACH': 388, 'SOUTH MIXING ZONE IN LAKE': 379, 'WEST END': 383,  },
            },
            'Whitewater Lake': {
                'Whitewater Lake Beach - Kettle Moraine SF': { _site: 419, 'Center of beach': 504,  },
            },
            'Delavan Lake': {
                'House in The Wood Beach': { _site: 461, 'House In the Woods Beach': 565,  },
            },
            'Lake Geneva': {
                'Big Foot Beach SP Swim Area': { _site: 293, 'Center of beach': 315,  },
            },
        },
        'Washington': {
            'Other': {
                'Sandy Knoll County Park Beach': { _site: 404, 'Center of beach': 402,  },
                'Leonard Yahr Park Beach': { _site: 434, 'Center of beach': 541,  },
                'Ackerman\'s Grove Park Beach': { _site: 403, 'Center of beach': 500,  },
            },
            'Pike Lake': {
                'Kettle Moraine RD KMSF Pike Lake Beach': { _site: 325, 'Center of beach': 347,  },
            },
        },
        'Waukesha': {
            'Ottawa Lake': {
                'Ottawa Lake Beach': { _site: 320, 'Center of beach': 342,  },
            },
        },
        'Waupaca': {
            'Hartman Lake': {
                'Hartman Creek State Park Beach': { _site: 305, 'Center of beach': 327,  },
            },
        },
        'Winnebago': {
            'Other': {
                'Boom Bay Boat Landing': { _site: 465, 'Center of beach': 572,  },
                'Fritse Park': { _site: 483, 'Center of beach': 590,  },
                'Menominee Park': { _site: 457, 'Menominee Beach': 440,  },
                'Grundman Park Boat Landing': { _site: 466, 'Center of beach': 573,  },
                'Village of Winneconne Park Swim Area': { _site: 471, 'Center of beach': 578,  },
                'Black Wolf Boat Landing': { _site: 464, 'Center of beach': 571,  },
                'Winnebago County Community Park Swim Area': { _site: 472, 'Center of beach': 579,  },
                'Fresh Air Park': { _site: 478, 'Center of beach': 586,  },
                'Asylum Point Park and Boat Landing': { _site: 463, 'Center of beach': 570,  },
                'Village of Butte des Morts Boat Landing': { _site: 470, 'Center of beach': 577,  },
                'Lake Poygan Bay Lane Boat Landing': { _site: 468, 'Center of beach': 575,  },
                'Little Herb and Dolly Smith Park (kayak launch area)': { _site: 479, 'Center of beach': 587,  },
                'Lake Butte des Morts Boat Landing': { _site: 467, 'Center of beach': 574,  },
                'Lake Poygan Boat Landing': { _site: 469, 'Center of beach': 576,  },
            },
        },
    };

    function fillCounties() {
        var list = $('#countyList');
        list.empty();
        Object.keys(beaches).forEach(function(cval) {
            list.append('<option value="' + cval + '"/>');
        });
    }

    function fillLakes() {
        var list = $('#lakeList');
        var county = $('#__county');
        list.empty();
        if (typeof(beaches[county.val()]) !== 'undefined' && Object.keys(beaches).indexOf(county.val()) >= 0) {
            Object.keys(beaches[county.val()]).forEach(function (cval) {
                list.append('<option value="' + cval + '"/>');
            });
        }
        saveFavoriteEnabled();
    }

    function fillBeaches() {
        var list = $('#beachList');
        var lake = $('#__lake');
        var county = $('#__county');
        list.empty();
        if (typeof(beaches[county.val()]) !== 'undefined' && typeof(beaches[county.val()][lake.val()]) !== 'undefined' && Object.keys(beaches[county.val()]).indexOf(lake.val()) >= 0) {
            Object.keys(beaches[county.val()][lake.val()]).forEach(function (cval) {
                list.append('<option value="'
                    + cval
                    // + ' (ID: '
                    // + beaches[county.val()][lake.val()][cval]._site
                    + '" data-entity-id="'
                    + beaches[county.val()][lake.val()][cval]._site
                    + '"/>');
            });
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
            Object.keys(beaches[county.val()][lake.val()][beach.val()]).forEach(function (cval) {
                if (cval != '_site')
                    list.append('<option value="'
                        + cval
                        // + ' (ID: '
                        // + beaches[county.val()][lake.val()][beach.val()][cval]
                        + '" data-entity-id="'
                        + beaches[county.val()][lake.val()][beach.val()][cval]
                        + '"/>');
            });
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

    document.getElementById('__county').oninput = saveFavoriteEnabled;

    document.getElementById('__lake').oninput = saveFavoriteEnabled;

    document.getElementById('__beach').oninput = function() {
        updateSeq('#__beach', '#beachList', '#BEACH_SEQ');
        saveFavoriteEnabled();
    };

    document.getElementById('__site').oninput = function() {
        updateSeq('#__site', '#monitorList', '#MONITOR_SITE_SEQ');
        saveFavoriteEnabled();
    };

    var favorites;
    loadFavorites();

    saveFavoriteEnabled();

    function updateSeq(input, list, stored) {
        var val = $(input).val();
        var opt = undefined;

        $(list).find('> option').each(function() {
            if ($(this).val() === val) opt = this;
        });

        if (opt)
            $(stored).val(opt.dataset.entityId);
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
            btn.html('Really Delete? (' + deleteTimer + ')');
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
            btn.html('Really Delete? (' + deleteTimer + ')');
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
        $('#SAMPLE_DATE_TIME').val(
            ('000'+d.getFullYear()).slice(-4) + '-' +
            ('0'+d.getMonth()).slice(-2) + '-' +
            ('0'+d.getDate()).slice(-2) + 'T' +
            ('0'+d.getHours()).slice(-2) + ':' +
            ('0'+d.getMinutes()).slice(-2)
        );
    }
}

