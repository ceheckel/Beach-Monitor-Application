/**
 * fill populates each drop down menu with content
 * @author Heckel (edited 02/17/2018)
 * @author Wagner (edited 02/17/2018)
 * @author Kriz   (edited 03/03/2018)
 */

/**
 * Populates the counties drop down on the beach selection page
 */
function fillCounties() {
    var list = $('#countyList');

    list.empty();
    if (is_safari) {
        var selector = document.createElement("select");
        selector.id = "countyListSelect";
        //selector.className = "mdl-selectfield__select";
        selector.setAttribute("style", "display:none");
        list.append(selector);
        list = $('#countyListSelect');
    }

    Object.keys(beaches).forEach(function (cval) {
        list.append('<option value="' + cval + '"/>');
    });

    if (is_safari) {
        var availableTags = list.find('option').map(function () {
            return this.value;
        }).get();
        $("#__county").autocomplete({source: availableTags, change: fillLakes});
    }
}

/**
 * Populates the lakes dropdown on the beach selection page
 */
function fillLakes() {
    var list = $('#lakeList');
    var county = $('#__county');

    list.empty();
    if (typeof(beaches[county.val()]) !== 'undefined' && Object.keys(beaches).indexOf(county.val()) >= 0) {
        if (is_safari) {
            var selector = document.createElement("select");
            selector.id = "lakeListSelect";
            //selector.className = "mdl-selectfield__select";
            selector.setAttribute("style", "display:none");
            list.append(selector);
            list = $('#lakeListSelect');
        }

        Object.keys(beaches[county.val()]).forEach(function (cval) {
            list.append('<option value="' + cval + '"/>');
        });

        if (is_safari) {
            var availableTags = list.find('option').map(function () {
                return this.value;
            }).get();
            $("#__lake").autocomplete({source: availableTags, change: fillBeaches});
        }
    }
    saveFavoriteEnabled();
}

/**
 * Populates the beaches dropdown on the beach selection page
 */
function fillBeaches() {
    var list = $('#beachList');
    var lake = $('#__lake');
    var county = $('#__county');

    list.empty();
    if (typeof(beaches[county.val()]) !== 'undefined' && typeof(beaches[county.val()][lake.val()]) !== 'undefined' && Object.keys(beaches[county.val()]).indexOf(lake.val()) >= 0) {
        if (is_safari) {
            var selector = document.createElement("select");
            selector.id = "beachListSelect";
            //selector.className = "mdl-selectfield__select";
            selector.setAttribute("style", "display:none");
            list.append(selector);
            list = $('#beachListSelect');
        }

        Object.keys(beaches[county.val()][lake.val()]).forEach(function (cval) {
            list.append('<option value="' + cval + '"/>');
        });

        if (is_safari) {
            var availableTags = list.find('option').map(function () {
                return this.value;
            }).get();
            $("#__beach").autocomplete({source: availableTags, change: fillSites});
        }
    }
    saveFavoriteEnabled();
}

/**
 * Populates the sites drop down on the beach selection page
 */
function fillSites() {
    var list = $('#monitorList');
    // var beach = $('#BEACH_SEQ');
    var beach = $('#__beach');
    var lake = $('#__lake');
    var county = $('#__county');

    list.empty();
    if (typeof(beaches[county.val()]) !== 'undefined' && typeof(beaches[county.val()][lake.val()]) !== 'undefined' && typeof(beaches[county.val()][lake.val()][beach.val()]) !== 'undefined' && Object.keys(beaches[county.val()][lake.val()]).indexOf(beach.val()) >= 0) {
        if (is_safari) {
            var selector = document.createElement("select");
            selector.id = "siteListSelect";
            //selector.className = "mdl-selectfield__select";
            selector.setAttribute("style", "display:none");
            list.append(selector);
            list = $('#siteListSelect');
        }

        Object.keys(beaches[county.val()][lake.val()][beach.val()]).forEach(function (cval) {
            if (cval != '_site')
                list.append('<option value="' + cval + '"/>');
        });

        if (is_safari) {
            var availableTags = list.find('option').map(function () {
                return this.value;
            }).get();
            $("#__site").autocomplete({source: availableTags, change: saveFavoriteEnabled});
        }
    }
    saveFavoriteEnabled();
}

/**
 * Attempt to propagate the fields based on
 * previous selections in the form
 *
 * In other words, display only relevant lakes for
 * a county, only relevant beaches for a lake, and only
 * relevant sites for a beach
 *
 * @see updateSeq
 */
function tryPropagate() {
    var county = $('#__county');
    var lake = $('#__lake');
    var beach = $('#__beach');
    var site = $('#__site');

    // Used to prevent error on propagation of beach / site when no parent is selected
    var onlyLake = null;
    var onlyBeach = null;

    // If only one lake exists for the selected county, auto-fill next text field
    if (Object.keys(beaches[county.val()]).length === 1) {
        fillLakes();
        lake.val(Object.keys(beaches[county.val()])[0]);
        lake.parent().addClass('is-dirty');
        onlyLake = Object.keys(beaches[county.val()])[0];
    }

    // If only one beach exists for the selected lake, auto-fill next text field
    if ((onlyLake != null) && Object.keys(beaches[county.val()][lake.val()]).length === 1) {
        fillBeaches();
        beach.val(Object.keys(beaches[county.val()][lake.val()])[0]);
        beach.parent().addClass('is-dirty');
        updateSeq('#__beach', '#beachList', '#BEACH_SEQ');
        onlyBeach = Object.keys(beaches[county.val()][lake.val()])
    }

    // If only one site exists for the selected lake, auto-fill next text field
    if ((onlyBeach != null) && Object.keys(beaches[county.val()][lake.val()][beach.val()]).length === 2) {
        fillSites();
        site.val(Object.keys(beaches[county.val()][lake.val()][beach.val()])[1]);
        site.parent().addClass('is-dirty');
        updateSeq('#__site', '#monitorList', '#MONITOR_SITE_SEQ');
    }
}
