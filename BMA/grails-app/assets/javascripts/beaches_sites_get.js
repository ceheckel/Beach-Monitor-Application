// CS4791 Fall 2017
// Jacob Striebel
// Kriz (edited)
// Wilson (edited)

var TEST_SITES = 3;

window.beaches_sites_get = {};

beaches_sites_get.GET_URL = "https://wibeaches-test.er.usgs.gov/wibeaches-services/beachesrawdata";

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

    if (use_test_data === true) {
        beaches = beaches_sites_get.test_beaches;
        sites = beaches_sites_get.test_sites;
        beaches_sites_get.parse(beaches, sites, callback);
    }
    else {
        $.ajax({
            type: "GET",
            crossDomain: true,
            // ifModified: true, // This seems to be the only way to get semi-consistant results
            // headers: {"If-Modified-Since": "Tue, 13 Feb 2018 14:05:19 GMT"},
            url: beaches_sites_get.GET_URL,
            success: function (data) {

                console.log(data);
                at = 0;
                //data = JSON.parse(data);
                data.forEach(function(tbl){
                    //console.log(tbl);
                    //console.log("At iteration # " , at);

                    curb =     {
                        BEACH_SEQ: tbl.BEACH_SEQ,
                        BEACH_NAME: tbl.BEACH_NAME,
                        COUNTY: tbl.COUNTY,
                        WATERBODY_NAME: tbl.WATERBODY_NAME// How are we deriving this?
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


                //beaches = data.beaches;
                //sites = data.sites;
                //console.log("DONE READING IN NOW!");
                console.log(beaches);
                console.log(beaches.length);
                console.log(sites);
                console.log(sites.length);

                beaches_sites_get.parse(beaches, sites, callback);
                fillCounties();
            },
            error: function () {
                alert('Get beaches and sites failed (' + beaches_sites_get.GET_URL + ').');
            }
        });
    }
};

