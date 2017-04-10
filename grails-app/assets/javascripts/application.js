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

    function downloadCSV(){
        var myData = getAllFields();
        console.log(myData);

        var stuff = myData.toString();
        console.log(stuff.toString());

        //delimeters for csv format
        var colDelim = '","';
        var rowDelim = '"\r\n"';

        var csv = '"';
        for(var key in myData){
         if(myData.hasOwnProperty(key)){
             csv+=key;
             csv+=colDelim;
         }
        }
        csv+=rowDelim;

        for(var key in myData){
            if(myData.hasOwnProperty(key)){
                csv+=myData[key];
                csv+=colDelim;
            }
        }

        var csvData = 'data:application/csv;charset=utf-8,' + encodeURI(csv);
        nameOfFile = myData["BEACH_SEQ"] + "," + myData["MONITOR_SITE_SEQ"];
        var link = document.createElement("a");
        link.setAttribute("href",csvData);
        link.setAttribute("download",nameOfFile);
        document.body.appendChild(link);
        link.click();
    }

    function newSurvey(){
        toPage(0);
        $('#page-questions').css('display', 'block');
    }

    function toPage(page) {
        completePage(page);
        $('div[data-page]').hide();
        var p = $('div[data-page=' + page + ']');
        p.show();
        $('#page-title').html(p.data('page-title'));
        $('#page-title-drawer').html(p.data('page-title'));

        if(curPage != 'home' && curPage >= 0)
            saveSurvey();
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

        if (curPage == '0') $('#__addFavorite').css('display', 'block').next().css('display', 'block');
        else $('#__addFavorite').css('display', 'none').next().css('display', 'none');
    }

    function btnPrev() {
        toPage(curPage - 1);
    }

    function btnNext() {
        if (curPage == totalQuestionPages - 1)
            toReview();
        else if (curPage == totalQuestionPages) {
            downloadCSV();
            Submit();
        }
        else
            toPage(curPage + 1);
    }

    function toReview() {
        completePage(totalQuestionPages);
        $('div[data-page]').show();
        $('div[data-page=home]').hide();
        $('#page-title').html('Review');
        $('#page-title-drawer').html('Review');
        curPage = totalQuestionPages;
        $('#btn-next').html('Submit');
    }

    function saveSurvey() {
        if (typeof(surveyId) === 'undefined') return;
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
            toPage(0);
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

    function completePage(nextPage) {
        completedSurvey = true;
        for(var page = 0; page < totalQuestionPages; page++) {
            var p = $('div[data-page=' + page + '] :input');
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
                if ($(this).attr("id") == 'NO_ANIMALS_OTHER') {
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
                if ($(this).attr("id") == 'NUM_OTHER') {
                    if ($(this).val() == "")
                        complete = false;
                    else if (parseInt($(this).val()) > 0)
                        other = true;
                }
                if (other && $(this).attr("id") == 'NUM_OTHER_DESC' && $(this).val() == "")
                    complete = false;

                if ($(this).attr("id") == 'FLOAT_OTHER_DESC' && $(this).val() == "" && $('#FLOAT_OTHERLabel').attr('class') == 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded is-checked')
                    complete = false;

                if (other && $(this).attr("id") == 'DEBRIS_OTHER_DESC' && $(this).val() == "" && $('#DEBRIS_OTHERLabel').attr('class') == 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded is-checked')
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

                if ($(this).attr("id") == 'COLOR_CHANGE-0' && $('#COLOR_CHANGE-0Label').attr('class') == 'mdl-radio mdl-js-radio mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded is-checked')
                    other = true;
                if (other && $(this).attr("id") == 'COLOR_DESCRIPTION' && $(this).val() == "")
                    complete = false;

                if ($(this).attr("id") == 'ODOR_DESCRIPTION-4' && $('#ODOR_DESCRIPTION-4Label').attr('class') == 'mdl-radio mdl-js-radio mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded is-checked')
                    other = true;
                if (other && $(this).attr("id") == 'ODOR_OTHER_DESCRIPTION' && $(this).val() == "")
                    complete = false;

                if ($(this).attr("id") == 'PART_2_COMMENTS' && $(this).val() == "")
                    complete = false;

                if ($(this).attr("id") == 'ALGAE_TYPE_OTHER' && $('#ALGAE_TYPE_OTHERLabel').attr('class') == 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded is-checked')
                    other = true;
                if (other && $(this).attr("id") == 'ALGAE_TYPE_OTHER_DESC' && $(this).val() == "")
                    complete = false;

                if ($(this).attr("id") == 'ALGAE_COLOR_OTHER' && $('#ALGAE_COLOR_OTHERLabel').attr('class') == 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded is-checked')
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

                //console.log($(this).attr("id"));
            });
            //console.log(complete);

            if (nextPage != 'home' && page >= 0 && page < totalQuestionPages) {
                if (complete)
                    document.getElementById('Complete_' + page).style.display = 'inline';
                else {
                    document.getElementById('Complete_' + page).style.display = 'none';
                    completedSurvey = false;
                }
            }
        }
        if (nextPage == 'home') {
            for (var i = 0; i < totalQuestionPages; i++) {
                document.getElementById('Complete_' + i).style.display = 'none';
            }
            getSurveys();
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

    var beaches = {
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
            }
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
            }
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
            }
        },
        'Iron': {
            'Lake Superior': {
                'Oronto Bay Beach 1': {_site: 82, 'Center of Beach': 199},
                'Oronto Bay Beach 2': {_site: 81, 'Center of Beach': 200},
                'Oronto Bay Beach 3': {_site: 80, 'Center of Beach': 201},
                'Saxon Harbor Beach East': {_site: 174, 'Center of beach': 167},
                'Saxon Harbor Beach West': {site: 83, 'Center of beach': 122}
            }
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
            }
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
            }
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
        'Oconto': {
            'Lake Michigan': {
                'Oconto City Park': {_site: 249}
            }
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
        }
    };

    function fillCounties() {
        var list = $('#countyList');
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
                list.append('<option value="' + cval + '"/>');
            });
        }
        saveFavoriteEnabled();
    }

    function fillSites() {
        var list = $('#monitorList');
        var beach = $('#BEACH_SEQ');
        var lake = $('#__lake');
        var county = $('#__county');
        list.empty();
        if (typeof(beaches[county.val()]) !== 'undefined' && typeof(beaches[county.val()][lake.val()]) !== 'undefined' &&  typeof(beaches[county.val()][lake.val()][beach.val()]) !== 'undefined' && Object.keys(beaches[county.val()][lake.val()]).indexOf(beach.val()) >= 0) {
            Object.keys(beaches[county.val()][lake.val()][beach.val()]).forEach(function (cval) {
                if (cval != '_site') list.append('<option value="' + cval + '"/>');
            });
        }
        saveFavoriteEnabled();
    }

    function saveFavoriteEnabled() {
        var unique = true;
        if(typeof(favorites) !== 'undefined') {
            favorites.forEach(function (f, i) {
                if (f.county == $('#__county').val() && f.lake == $('#__lake').val() && f.beach == $('#BEACH_SEQ').val() && f.site == $('#MONITOR_SITE_SEQ').val()) {
                    unique = false;
                }
            });
        }
        $('#__addFavorite').prop('disabled',
            !unique ||
            $('#__county').val() == '' ||
                $('#__lake').val() == '' ||
                $('#BEACH_SEQ').val() == '' ||
                $('#MONITOR_SITE_SEQ').val() == ''
        )
    }

    fillCounties();

    document.getElementById('__county').oninput = fillLakes;
    document.getElementById('__lake').oninput = fillBeaches;
    document.getElementById('BEACH_SEQ').oninput = fillSites;
    document.getElementById('MONITOR_SITE_SEQ').oninput = saveFavoriteEnabled;
    document.getElementById('__favorites').onchange = fillFavorite;

    var favorites;
    loadFavorites();

    saveFavoriteEnabled();
}

function getDateFormatted() {
    date = new Date();
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