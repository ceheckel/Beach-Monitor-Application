/**
 * beaches_site_get requests the data used for autocompletion on the beach selection page.
 * The raw data maps counties to lakes to beaches to sites
 * CS4791 Fall 2017
 * @author Streibel
 * CS4791 Spring 2018
 * @author Kriz (edited)
 * @author Wilson (edited)
 */

window.beaches_sites_get = {};

// https://wibeaches-test.er.usgs.gov/wibeaches-services/beachesrawdata  <-- WiDNR Beaches Test URL
beaches_sites_get.GET_URL = "https://www.wibeaches.us/wibeaches-services/beachesrawdata";

beaches_sites_get.parse = function (beaches, sites, callback) {
    var formatted_beaches = {};
    var this_beach = null;
    var map_beach_seq_to_obj = {};
    var i;
    var j;
    for (i = 0; i < beaches.length; i++) {
        if (formatted_beaches[beaches[i].COUNTY] === undefined) {
            formatted_beaches[beaches[i].COUNTY] = {};
        }
        if (formatted_beaches[beaches[i].COUNTY][beaches[i].WATERBODY_NAME] === undefined) {
            formatted_beaches[beaches[i].COUNTY][beaches[i].WATERBODY_NAME] = {};
        }
        this_beach = {};
        formatted_beaches[beaches[i].COUNTY][beaches[i].WATERBODY_NAME][beaches[i].BEACH_NAME] = this_beach;
        this_beach["_site"] = beaches[i].BEACH_SEQ;

        map_beach_seq_to_obj[beaches[i].BEACH_SEQ] = this_beach;
    }
    for (j = 0; j < sites.length; j++) {
        map_beach_seq_to_obj[sites[j].BEACH_SEQ][sites[j].STATION_NAME] = sites[j].MONITOR_SITE_SEQ;
    }

    callback(formatted_beaches);
};

beaches_sites_get.run = function (callback, use_test_data) {
    var beaches = [];
    var sites = [];

    // if the test data is desired
    if (use_test_data === true) {
        localforage.getItem('beaches').then( function(value){
            beaches = value;
            localforage.getItem('sites').then( function(value){
                sites = value;
                beaches_sites_get.parse(beaches, sites, callback);
            });
        });
    }
    else { // Get the real data
        $.ajax({
            type: "GET",
            crossDomain: true,
            // ifModified: true, // This seems to be the only way to get semi-consistant results
            // headers: {"If-Modified-Since": "Tue, 13 Feb 2018 14:05:19 GMT"},
            url: beaches_sites_get.GET_URL,
            success: function (data) {
                at = 0;

                // parse through the data and store it locally
                data.forEach(function(tbl){
                    curb =     {
                        BEACH_SEQ: tbl.BEACH_SEQ,
                        BEACH_NAME: tbl.BEACH_NAME,
                        COUNTY: tbl.COUNTY,
                        WATERBODY_NAME: tbl.WATERBODY_NAME
                    };
                    curs =     {
                        MONITOR_SITE_SEQ: tbl.MONITOR_SITE_SEQ,
                        BEACH_SEQ: tbl.BEACH_SEQ,
                        STATION_NAME: tbl.STATION_NAME
                    };
                    beaches.push(curb);
                    sites.push(curs);

                    at++;
                });

                localforage.setItem('beaches',beaches);
                localforage.setItem('sites',sites);
                beaches_sites_get.parse(beaches, sites, callback);
                fillCounties();
            },
            error: function () {
                alert('Get beaches and sites failed (' + beaches_sites_get.GET_URL + ').\nNow using only pre-existing data');

                // use the values for beaches and sites stored in localforage instead
                localforage.getItem('beaches').then( function(value){
                    beaches = value;
                    localforage.getItem('sites').then( function(value){
                        sites = value;
                        beaches_sites_get.parse(beaches, sites, callback);
                        fillCounties();
                    });
                });
            }
        });
    }
};
