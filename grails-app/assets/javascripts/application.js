// This is a manifest file that'll be compiled into application.js.
//
// Any JavaScript file within this directory can be referenced here using a relative path.
//
// You're free to add application-wide JavaScript to this file, but it's generally better
// to create separate JavaScript files as needed.
//
//= require jquery-2.2.0.min
//= require_tree .
//= require_self

if (typeof jQuery !== 'undefined') {
    (function($) {
        $(document).ajaxStart(function() {
            $('#spinner').fadeIn();
        }).ajaxStop(function() {
            $('#spinner').fadeOut();
        });
    })(jQuery);

    $(document).ready(function() {
        $('section[id*=page-survey-]').hide();

        $('#btn-menu').click(function() {
            console.log('menu button clicked');
        });

        $('#btn-new').click(function() {
            toPage('#page-survey-0');
        });

        $('#btn-past-reps').click(function() {
            console.log('past reports');
        });
    });

    function toPage(page) {
        $('section[id*=page-]').hide();
        $(page).show();
    }

    function toPageNum(num) {
        toPage('#page-survey-' + num);
    }
}
