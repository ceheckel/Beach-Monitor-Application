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
        toPage('home')

        $('#btn-menu').click(function() {
            console.log('menu button clicked');
        });

        $('#btn-new-survey').click(function() {
            toPage(0);
            $('#page-questions').css('display', 'block');

        });

        $('#btn-past-reps').click(function() {
            console.log('past reports');
        });
    });

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
        if (curPage == 'home')
            document.getElementById("drawerStyle").innerHTML='.mdl-layout .mdl-layout__drawer-button {display: none;}';
        else
            document.getElementById("drawerStyle").innerHTML='.mdl-layout .mdl-layout__drawer-button {display: block;}';
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

    function closeDrawer() {
        var d = document.querySelector('.mdl-layout');
        d.MaterialLayout.toggleDrawer();
    }

    function completePage(page, nextPage) {
        var p = $('div[data-page=' + page + '] > div > input');
        var complete = true;
        var other = false;
        p.each(function () {
            //var text = $(this).find(".mdl-textfield mdl-js-textfield mdl-textfield--floating-label input");
            // var radio = $(this).find(".mdl-radio mdl-js-radio mdl-js-ripple-effect input");
            // var checkbox = $(this).find(".mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect input");
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

            if ($(this).attr("id") == 'AIR_TEMP' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'WIND_SPEED' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'WIND_DIR_DEGREES' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'WIND_DIR_ DESC' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'WEATHER_DESC' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'RAINFALL' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'WAVE_HEIGHT' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'WAVE_DIRECTION' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'WAVE_CONDITIONS' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'EST_ACT_FLAG' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'CURRENT_SPEED' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'SHORELINE_CURRENT_DIR' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'PART_1_COMMENTS' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'PH' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'COLOR_CHANGE' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'COLOR_DESCRIPTION' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'ODOR_DESCRIPTION' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'ODOR_OTHER_DESCRIPTION' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'PART_2_COMMENTS' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'ALGAE_TYPE_OTHER_DESC' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'ALGAE_COLOR_OTHER_DESC' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'AVG_WATER_TEMP' && $(this).val() == "")
                complete = false;

            if ($(this).attr("id") == 'NTU' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'SEECHI_TUBE_CM' && $(this).val() == "")
                complete = false;
            if ($(this).attr("id") == 'PART_4_COMMENTS' && $(this).val() == "")
                complete = false;



            console.log($(this).attr("id"));
            //if (!radio.is(':checked')) {
            //    complete = false;
            //  }
        });
        console.log(complete);
        if(nextPage == 'home'){
            for(var i = 0; i < totalQuestionPages; i++){
                document.getElementById('Complete_' + i).style.display = 'none';
            }
        }
        else if (page >= 0 && page < totalQuestionPages) {
            if (complete)
                document.getElementById('Complete_' + page).style.display = 'inline';
            else
                document.getElementById('Complete_' + page).style.display = 'none';
        }
        //console.log(complete);
    }
}
