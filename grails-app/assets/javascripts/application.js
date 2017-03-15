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
            toPage('0');
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
    }
}
