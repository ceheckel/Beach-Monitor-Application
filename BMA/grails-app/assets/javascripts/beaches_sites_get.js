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

beaches_sites_get.GET_URL = "https://wibeaches-test.er.usgs.gov/wibeaches-services/beachesrawdata";

beaches_sites_get.parse = function (beaches, sites, callback) {
    var formatted_beaches = {};
    var this_beach = null;
    var map_beach_seq_to_obj = {};
    var i;
    var j;
    // Process beaches data
    for (i = 0; i < beaches.length; i++) {
        // Check for imperfections in data
        if (formatted_beaches[beaches[i].COUNTY] === undefined) {
            formatted_beaches[beaches[i].COUNTY] = {};
        }
        if (formatted_beaches[beaches[i].COUNTY][beaches[i].WATERBODY_NAME] === undefined) {
            formatted_beaches[beaches[i].COUNTY][beaches[i].WATERBODY_NAME] = {};
        }
        // Push and index in the formatted list
        this_beach = {};
        formatted_beaches[beaches[i].COUNTY][beaches[i].WATERBODY_NAME][beaches[i].BEACH_NAME] = this_beach;
        this_beach["_site"] = beaches[i].BEACH_SEQ;

        map_beach_seq_to_obj[beaches[i].BEACH_SEQ] = this_beach;
    }
    // Process sites data with beaches data (Reduce repeats)
    for (j = 0; j < sites.length; j++) {
        map_beach_seq_to_obj[sites[j].BEACH_SEQ][sites[j].STATION_NAME] = sites[j].MONITOR_SITE_SEQ;
    }
    // Return the results
    callback(formatted_beaches);
};

beaches_sites_get.run = function (callback, use_test_data) {
    var beaches = [];
    var sites = [];

    if (use_test_data === true) {
        beaches = beaches_sites_get.test_beaches;
        sites = beaches_sites_get.test_sites;
        beaches_sites_get.parse(beaches, sites, callback);
    } else {
        // Create a GET request then read out status code and parse data sent
        $.ajax({
            type: "GET",
            url: beaches_sites_get.GET_URL,
            success: function (data) {
                // Parse the data we were sent
                at = 0;
                data.forEach(function(tbl){
                    // curb is Current Beach
                    // curs is Current Site
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
                // Send the raw lists of beaches and sites to be properly parsed
                beaches_sites_get.parse(beaches, sites, callback);
            },
            error: function () {
                alert('\nGet beaches and sites failed \n(URL: ' + beaches_sites_get.GET_URL + ').');
            }
        });
    }
};

// In case we want to use just a test list
// Keep this in the code just in case!

beaches_sites_get.test_beaches = [
    {
        BEACH_SEQ: 1,
        BEACH_NAME: "Big Bay Town Park Beach",
        COUNTY: "Ashland",
        WATERBODY_NAME: "Lake Superior"
    },
    {
        BEACH_SEQ: 171,
        BEACH_NAME: "Braod Street Beach",
        COUNTY: "Bayfield",
        WATERBODY_NAME: "Lake Superior"
    },
    {
        BEACH_SEQ: 3,
        BEACH_NAME: "Maslowski Beaches",
        COUNTY: "Ashland",
        WATERBODY_NAME: "Lake Superior"
    },
    {
        BEACH_SEQ: 298,
        BEACH_NAME: "Copper Falls SP Beach",
        COUNTY: "Ashland",
        WATERBODY_NAME: "Loon Lake"
    }
];

beaches_sites_get.test_sites = [
    {
        MONITOR_SITE_SEQ: 192,
        BEACH_SEQ: 1,
        STATION_NAME: "Center of beach"
    },
    {
        MONITOR_SITE_SEQ: 1000,
        BEACH_SEQ: 1,
        STATION_NAME: "West end of beach"
    },
    {
        MONITOR_SITE_SEQ: 80,
        BEACH_SEQ: 3,
        STATION_NAME: "Center of beach"
    },
    {
        MONITOR_SITE_SEQ: 320,
        BEACH_SEQ: 298,
        STATION_NAME: "Center of beach"
    },
    {
        MONITOR_SITE_SEQ: 165,
        BEACH_SEQ: 171,
        STATION_NAME: "Center of beach"
    }
];
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
        beaches = beaches_sites_get.test_beaches;
        sites = beaches_sites_get.test_sites;
        beaches_sites_get.parse(beaches, sites, callback);
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

                beaches_sites_get.parse(beaches, sites, callback);
                fillCounties();
            },
            error: function () {
                alert('Get beaches and sites failed (' + beaches_sites_get.GET_URL + ').\nUsing test data');

                // fallback to test set on failure
                beaches = beaches_sites_get.test_beaches;
                sites = beaches_sites_get.test_sites;
                beaches_sites_get.parse(beaches, sites, callback);
            }
        });
    }
};
