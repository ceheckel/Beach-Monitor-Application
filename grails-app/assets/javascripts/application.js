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

        $('#btn-new-survey').click(function() {
            clearAllFields();
            surveyId = guid();
            surveyDate = getDateFormatted();
            toPage(0);
        });

        $('#btn-past-reps').click(function() {
            console.log('past reports');
        });
    });

    function newSurvey(){
        toPage(0);
        $('#page-questions').css('display', 'block');
    }

    function toPage(page) {
        completePage(curPage, page);
        $('div[data-page]').hide();
        var p = $('div[data-page=' + page + ']');
        p.show();
        $('#page-title').html(p.data('page-title'));
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
        }
        else {
            document.getElementById("surveySectionsDrawer").style.display = 'block';
            document.getElementById("homeSectionDrawer").style.display = 'none';
        }
    }

    function btnPrev() {
        toPage(curPage - 1);
    }

    function btnNext() {
        if (curPage == totalQuestionPages - 1)
            toReview();
        else if (curPage == totalQuestionPages)
            submit();
        else
            toPage(curPage + 1);
        saveSurvey();
    }

    function toReview() {
        completePage(curPage,totalQuestionPages);
        $('div[data-page]').show();
        $('div[data-page=home]').hide();
        $('#page-title').html('Review');
        $('#page-title-drawer').html('Review');
        curPage = totalQuestionPages;
        $('#btn-next').html('Submit');
    }

    function saveSurvey() {
        data = getAllFields();
        data.id = surveyId;
        data.date = surveyDate;
        survey = new Survey(surveyId, data);
        survey.save();
    }

    function loadSurvey(id) {
        surveyId = id;
        Surveys.getById(id, function(survey) {
            $('[name]').each(function () {
                var nameToString = this.name.toString();
                if (this.name in survey)
                {
                    this.value = survey[nameToString];
                    this.parentElement.className += " is-dirty";
                }
            });
            surveyDate = survey['date'];
        });
    }

    function getSurveys() {
        var unsubmittedList = document.getElementById("unsubmitted-reports");
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
        // Populate list
        Surveys.getAll(function(surveys) {
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
                action.href = "#";
                action.onclick = (function() {
                    var id = surveys[i].id;
                    return function() {
                        clearAllFields();
                        loadSurvey(id);
                        toPage(0);
                        $('#page-questions').css('display', 'block');
                    }
                })();
                var icon = document.createElement("i");
                icon.className="material-icons";


                nameSpan.appendChild(document.createTextNode(surveys[i].BEACH_SEQ));
                infoSpan.appendChild(document.createTextNode(surveys[i].date + " - Site " + surveys[i].MONITOR_SITE_SEQ));
                icon.appendChild(document.createTextNode("edit"));

                dataSpan.appendChild(nameSpan);
                dataSpan.appendChild(infoSpan);
                action.appendChild(icon);
                actionSpan.appendChild(action);
                li.appendChild(dataSpan);
                li.appendChild(actionSpan);

                unsubmittedList.appendChild(li);
            }
        });
    }

    function getAllFields() {
        data = {};
        $('[name]').each(function () {
            if (this.value)
                data[this.name] = this.value;
        });
        return data;
    }

    function clearAllFields() {
        $('[name]').each(function () {
            if (this.value) {
                this.parentElement.className = this.parentElement.className.replace("is-dirty", "");
                this.value = '';
            }
        });
    }

    function closeDrawer() {
        var d = document.querySelector('.mdl-layout');
        d.MaterialLayout.toggleDrawer();
    }

    function completePage(page, nextPage) {
        var p = $('div[data-page=' + page + '] > div > input');
        var complete = true;
        var other = false;
        p.each(function () {
            if ($(this).attr("id") == '__county' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == '__lake' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'BEACH_SEQ' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'MONITOR_SITE_SEQ' && $(this).val() == "")
                complete = false;
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
            if ($(this).attr("id") == 'NO_PEOPLE_OTHER') {
                if ($(this).val() == "")
                    complete = false;
                else if (parseInt($(this).val()) > 0)
                    other = true;
            }
            if (other && $(this).attr("id") == 'NO_PEOPLE_OTHER_DESC' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'PART_3_COMMENTS' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'NO_GULLS' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'NO_GEESE' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'NO_DOGS' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'NO_ANIMALS_OTHER'){
                    if ($(this).val() == "")
                        complete = false;
                    else if (parseInt($(this).val()) > 0)
                        other = true;
            }
            if (other && $(this).attr("id") == 'NO_ANIMALS_OTHER_DESC' && $(this).val() == "")
                complete = false;
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
            if ($(this).attr("id") == 'NUM_OTHER'){
                if ($(this).val() == "")
                    complete = false;
                else if (parseInt($(this).val()) > 0)
                    other = true;
            }
            if (other && $(this).attr("id") == 'NUM_OTHER_DESC' && $(this).val() == "")
                complete = false;

            if($(this).attr("id") == 'FLOAT_OTHER' && $(this).attr("checked"))
                other = true;
            if (other && $(this).attr("id") == 'FLOAT_OTHER_DESC' && $(this).val() == "")
                complete = false;

            if($(this).attr("id") == 'DEBRIS_OTHER' && $(this).attr("checked"))
                other = true;
            if (other && $(this).attr("id") == 'DEBRIS_OTHER_DESC' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'AIR_TEMP' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'WIND_SPEED' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'WIND_DIR_DEGREES' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'WIND_DIR_DESC' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'RAINFALL' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'WAVE_HEIGHT' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'CURRENT_SPEED' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'PART_1_COMMENTS' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'PH' && $(this).val() == "")
                complete = false;

            if($(this).attr("id") == 'COLOR_CHANGE-1' && $(this).attr("checked"))
                other = true;
            if (other && $(this).attr("id") == 'COLOR_DESCRIPTION' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'ODOR_DESCRIPTION-4' && $(this).attr("checked"))
                other = true;
            if (other && $(this).attr("id") == 'ODOR_OTHER_DESCRIPTION' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'PART_2_COMMENTS' && $(this).val() == "")
                complete = false;

            if($(this).attr("id") == 'ALGAE_TYPE_OTHER' && $(this).attr("checked"))
                other = true;
            if (other && $(this).attr("id") == 'ALGAE_TYPE_OTHER_DESC' && $(this).val() == "")
                complete = false;

            if($(this).attr("id") == 'ALGAE_COLOR_OTHER' && $(this).attr("checked"))
                other = true;
            if (other && $(this).attr("id") == 'ALGAE_COLOR_OTHER_DESC' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'AVG_WATER_TEMP' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'NTU' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'SECCHI_TUBE_CM' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'PART_4_COMMENTS' && $(this).val() == "")
                complete = false;

            console.log($(this).attr("id"));
        });
        console.log(complete);
        if(nextPage == 'home'){
            for(var i = 0; i < totalQuestionPages; i++){
                document.getElementById('Complete_' + i).style.display = 'none';
            }
            getSurveys();
        }
        else if (page >= 0 && page < totalQuestionPages) {
            if (complete) {
                console.log("CURRENT PAGE: " + page);
                document.getElementById('Complete_' + page).style.display = 'inline';
                console.log("SUCCESS");
            }
            else
                document.getElementById('Complete_' + page).style.display = 'none';
        }
        //console.log(complete);
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

    function getDateFormatted() {
        date = new Date();
        formattedString = "";
        switch (date.getMonth()) {
            case 0:
                formattedString += "Jan. "
                break;
            case 1:
                formattedString += "Feb. "
                break;
            case 2:
                formattedString += "Mar. "
                break;
            case 3:
                formattedString += "Apr. "
                break;
            case 4:
                formattedString += "May. "
                break;
            case 5:
                formattedString += "Jun. "
                break;
            case 6:
                formattedString += "Jul. "
                break;
            case 7:
                formattedString += "Aug. "
                break;
            case 8:
                formattedString += "Sep. "
                break;
            case 9:
                formattedString += "Oct. "
                break;
            case 10:
                formattedString += "Nov. "
                break;
            case 11:
                formattedString += "Dec. "
                break;
        }
        formattedString += date.getDate();
        return formattedString;
    }
}
