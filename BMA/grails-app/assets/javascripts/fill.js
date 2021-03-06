/**
 *
 *
 * @author Heckel (edited 02/17/2018)
 * @author Wagner (edited 02/17/2018)
 */

/**
 * Populates the counties drop down on the beach selection page
 */
function fillCounties() {
    $("#__county").children('option:not(:first)').remove();
    Object.keys(beaches).forEach(function(cval){
        $('#__county').append('<option value="' + cval + '">' + cval + '</option>');
    });
}

/**
 * Populates the lakes dropdown on the beach selection page
 */
function fillLakes() {
    var county = $('#__county');
    if (county.val() !== '' && Object.keys(beaches).indexOf(county.val()) >= 0){
        $("#__lake").children('option:not(:first)').remove();
        Object.keys(beaches[county.val()]).forEach(function (cval){
            $("#__lake").append('<option value="' + cval + '">' + cval + '</option>');
        });
    } else {
        $("#__lake").children('option:not(:first)').remove();
    }
    saveFavoriteEnabled();
}

/**
 * Populates the beaches dropdown on the beach selection page
 */
function fillBeaches() {
    var county = $('#__county');
    var lake = $('#__lake');
    if (county.val() !== '' && lake.val() !== '' && Object.keys(beaches[county.val()]).indexOf(lake.val()) >= 0){
        $("#__beach").children('option:not(:first)').remove();
        Object.keys(beaches[county.val()][lake.val()]).forEach(function (cval){
            $("#__beach").append('<option value="' + cval + '">' + cval + '</option>');
        });
    } else {
        $("#__beach").children('option:not(:first)').remove();
    }
    saveFavoriteEnabled();
}

/**
 * Populates the sites drop down on the beach selection page
 */
function fillSites() {
    var county = $('#__county');
    var lake = $('#__lake');
    var beach = $('#__beach');
    if (county.val() !== '' && lake.val() !== '' && beach.val() !== '' && Object.keys(beaches[county.val()][lake.val()]).indexOf(beach.val()) >= 0) {
        $("#__site").children('option:not(:first)').remove();
        Object.keys(beaches[county.val()][lake.val()][beach.val()]).forEach(function (cval){
            if (cval != '_site') {
                $("#__site").append('<option value="' + cval + '">' + cval + '</option>');
            }
        });
    } else {
        $("#__site").children('option:not(:first)').remove();
    }
    saveFavoriteEnabled();
}

/**
 * Weird helper function that fills all fields under County because of the way onchange works
 */
function fillFromCounty(){
    fillLakes();
    fillBeaches();
    fillSites();
}

/**
 * Helper function that fills all fields under Lake
 */
function fillFromLake(){
    fillBeaches();
    fillSites();
}

/**
 * Helper function that fills Site (possibly superfluous)
 */
function fillFromBeach(){
    fillSites();
}