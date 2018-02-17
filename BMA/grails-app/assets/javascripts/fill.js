/**
 *
 *
 * @author Heckel (edited 02/17/2018)
 * @author Wagner (edited 02/17/2018)
 */

/**
 *
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
 *
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
 *
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
            list.append('<option value="' + cval + '"/>');
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
 *
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
                list.append('<option value="' + cval + '"/>');
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
 *
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
