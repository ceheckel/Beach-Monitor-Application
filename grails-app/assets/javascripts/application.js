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

var curPage = 0;

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
            surveyId = guid();
            toPage(0);
            $('#page-questions').css('display', 'block');

        });

        $('#btn-past-reps').click(function() {
            console.log('past reports');
        });
    });

    function toPage(page) {
        $('div[data-page]').hide();
        var p = $('div[data-page=' + page + ']');
        p.show();
        $('#page-title').html(p.data('page-title'));
        $('#page-title-drawer').html(p.data('page-title'));
        curPage = page;
        if (curPage > 0)
            $('#btn-prev').css('display', 'block');
        if (curPage == totalQuestionPages - 1)
            $('#btn-next').html('Review');
        else
            $('#btn-next').html('Next');
        if (typeof(surveyId) != "undefined")
            saveSurvey();
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
        $('div[data-page]').show();
        $('div[data-page=home]').hide();
        $('#page-title').html('Review');
        $('#page-title-drawer').html('Review');
        curPage = totalQuestionPages;
        $('#btn-next').html('Submit');
    }

    function saveSurvey() {
        data = getAllFields();
        survey = new Survey(surveyId, data);
        survey.save();
    }

    function getAllFields() {
        data = {};
        $('[name]').each( function () {
            if (this.value)
                data[this.name] = this.value;
        });
        return data;
    }
}
