// CS4791 Fall 2017
// Jacob Striebel


window.beaches_sites_get = {};

beaches_sites_get.BEACHES_GET_URL = "http://localhost:8081/bms/beaches/get";
beaches_sites_get.SITES_GET_URL   = "http://localhost:8081/bms/sites/get";

beaches_sites_get.test_beaches = [
    {
        BEACH_SEQ: 1,
        BEACH_NAME: "Big Bay Town Park Beach",
        COUNTY: "Ashland",
        WATER_BODY_NAME: "Lake Superior"
    },
    {
        BEACH_SEQ: 171,
        BEACH_NAME: "Braod Street Beach",
        COUNTY: "Bayfield",
        WATER_BODY_NAME: "Lake Superior"
    },
    {
        BEACH_SEQ: 3,
        BEACH_NAME: "Maslowski Beaches",
        COUNTY: "Ashland",
        WATER_BODY_NAME: "Lake Superior"
    },
    {
        BEACH_SEQ: 298,
        BEACH_NAME: "Copper Falls SP Beach",
        COUNTY: "Ashland",
        WATER_BODY_NAME: "Loon Lake"
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
        if (formatted_beaches[beaches[i].COUNTY][beaches[i].WATER_BODY_NAME] === undefined) {
            formatted_beaches[beaches[i].COUNTY][beaches[i].WATER_BODY_NAME] = {};
        }
        this_beach = {};
        formatted_beaches[beaches[i].COUNTY][beaches[i].WATER_BODY_NAME][beaches[i].BEACH_NAME] = this_beach;
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
        jQuery.get({
            url: beaches_sites_get.BEACHES_GET_URL,
            success: function (data) {
                beaches = data;
                jQuery.get({
                    url: beaches_sites_get.SITES_GET_URL,
                    success: function (data) {
                        sites = data;
                        beaches_sites_get.parse(beaches, sites, callback);
                    }
                });
            }
        });
    }
};
