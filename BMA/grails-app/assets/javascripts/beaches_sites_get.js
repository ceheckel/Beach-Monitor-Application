// CS4791 Fall 2017
// Jacob Striebel

var TEST_SITES = 3;

window.beaches_sites_get = {};

beaches_sites_get.BEACHES_GET_URL = "https://wibeaches-test.er.usgs.gov/wibeaches-services/beachesrawdata";
beaches_sites_get.SITES_GET_URL = "https://wibeaches-test.er.usgs.gov/wibeaches-services/beachesrawdata";

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
    var beaches = null;
    var sites = null;
    var at = 0;

    if (use_test_data === true) {
        beaches = beaches_sites_get.test_beaches;
        sites = beaches_sites_get.test_sites;
        beaches_sites_get.parse(beaches, sites, callback);
    }
    else {
        $.ajax({
            type: "GET",
            crossDomain: true,
            url: "https://wibeaches-test.er.usgs.gov/wibeaches-services/beachesrawdata",
            success: function (data) {

                //console.log(data);

                //data = JSON.parse(data);
                JSON.parse(data).foreach(function(tbl){
                    beaches.BEACH_SEQ[at] = tbl.beach_seq;
                    beaches.BEACH_NAME[at] = tbl.beach_name;
                    beaches.COUNTY[at]= tbl.county;
                    beaches.WATERBODY_NAME[at] = null; // How are we deriving this?


                    sites.MONITOR_SITE_SEQ[at] = tbl.site_seq;
                    sites.BEACH_SEQ[at] = tbl.beach_seq;
                    sites.STATION_NAME[at] = tbl.station_name;
                    at++;
            });


                //beaches = data.beaches;
                //sites = data.sites;
                console.log(tbl);
                console.log(beaches);
                console.log(sites);

                beaches_sites_get.parse(beaches, sites, callback);
            },
            error: function () {
                alert('Get beaches and sites failed (' + beaches_sites_get.SITES_GET_URL + ').');
            }
        });

/*
        $.ajax({
            type: 'GET',
            crossDomain: true,
Skip to content
This repository

    Pull requests
    Issues
    Marketplace
    Explore

    @BrettKriz

10
0

    0

2017-SD/Beach-Monitor-App Private
Code
Issues 3
Pull requests 0
Projects 0
Wiki
Insights
Beach-Monitor-App/BMA/grails-app/assets/javascripts/beaches_sites_get.js
239181b Dec 10, 2017
@cwbaldwin cwbaldwin Fixed mass upload
@cwbaldwin
@ceheckel
executable file 157 lines (139 sloc) 4.28 KB
// CS4791 Fall 2017
// Jacob Striebel

var TEST_SITES = 3;

window.beaches_sites_get = {};

beaches_sites_get.BEACHES_GET_URL = "";
beaches_sites_get.SITES_GET_URL = "";

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
    var beaches = null;
    var sites = null;

    if (use_test_data === true) {
        beaches = beaches_sites_get.test_beaches;
        sites = beaches_sites_get.test_sites;
        beaches_sites_get.parse(beaches, sites, callback);
    }
    else {
        $.ajax({
            type: "GET",
            crossDomain: true,
            url: beaches_sites_get.SITES_GET_URL,
            success: function (data) {

                //console.log(data);

                data = JSON.parse(data);

                beaches = data.beaches;
                sites = data.sites;

                //console.log(beaches);
                //console.log(sites);

                beaches_sites_get.parse(beaches, sites, callback);
            },
            error: function () {
                alert('Get beaches and sites failed (' + beaches_sites_get.SITES_GET_URL + ').');
            }
        });

/*
        $.ajax({
            type: 'GET',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            url: beaches_sites_get.BEACHES_GET_URL,
            dataType: 'json',
            success: function(data) {
                beaches = data;
                $.ajax({
                    type: 'GET',
                    crossDomain: true,
                    contentType: 'application/json; charset=utf-8',
                    url: beaches_sites_get.SITES_GET_URL,
                    dataType: 'json',
                    success: function(data) {
                        sites = data;
                        beaches_sites_get.parse(beaches, sites, callback);
                    },
                    error: function () {
                        alert('Get sites failed (' + beaches_sites_get.SITES_GET_URL + ').');
                    }
                });
            },
            error: function () {
                alert('Get beaches failed (' + beaches_sites_get.BEACHES_GET_URL + ').');
            }
        });
*/
    }
};

    © 2018 GitHub, Inc.
    Terms
    Privacy
    Security
    Status
    Help

    Contact GitHub
    API
    Training
    Shop
    Blog
    About


            contentType: 'application/json; charset=utf-8',
            url: beaches_sites_get.BEACHES_GET_URL,
            dataType: 'json',
            success: function(data) {
                beaches = data;

                $.ajax({
                    type: 'GET',
                    crossDomain: true,
                    contentType: 'application/json; charset=utf-8',
                    url: beaches_sites_get.SITES_GET_URL,
                    dataType: 'json',
                    success: function(data) {
                        sites = data;

                        beaches_sites_get.parse(beaches, sites, callback);
                    },
                    error: function () {
                        alert('Get sites failed (' + beaches_sites_get.SITES_GET_URL + ').');
                    }
                });
            },
            error: function () {
                alert('Get beaches failed (' + beaches_sites_get.BEACHES_GET_URL + ').');
            }
        });
*/
    }
};
