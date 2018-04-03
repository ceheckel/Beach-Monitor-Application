/**
 * Created by cwbaldwi on 10/11/17.
 * Edited by Heckel (most recent) on 03/20/18.
 */

window.survey_post = {};

// http://localhost:8081/bms/survey
// https://hci-dev.cs.mtu.edu:8117/BMS2/survey <-- TOMCAT URL IS CURRENTLY FOR TESTING SERVER

survey_post.URL_POST = "https://wibeaches-test.er.usgs.gov/wibeaches-services/sanitaryData" //<-- WiDNR POST URL
// survey_post.URL_POST = "http://localhost:8081/bms/survey";

/**
 * Uploads all surveys to the Wi Beach Server
 * @param surveys
 */
survey_post.upload = function(surveys) {
    var promises = [];
    var toUpload = ""; // all the surveys clumped into one string

    // Start construction of the survey clump
    toUpload = "[";
    surveys.forEach(function(survey) {
        toUpload = toUpload + JSON.stringify(survey) + ","; // stringify survey
    });
    toUpload = toUpload.substr(0,toUpload.length-1) + "]"; // removes the last comma

    // get user name and password for encoding
    var usrpw = $("#username-field").val()+":"+$("#password-field").val();

    // POST the clump
    promises.push($.ajax({
        type: 'POST',
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        url: survey_post.URL_POST,
        dataType: 'json',
        data: toUpload,
        headers: {
            "Authorization": "Basic " + btoa(usrpw)
        },
        success: function (response) {
            BootstrapDialog.alert("Report submitted successfully\n <details>" + response.responseText + "</details>");
            surveys.forEach(function(survey) { survey['submitted'] = true; });
        },
        error: function (response) {
            console.log("err with post, response: ", response);
            if (response.status == 500) {
                BootstrapDialog.alert("Problem with submit\nA survey with this location and date/time has already been submitted\n <details>" + response.responseText + "</details>");
            } else if (response.status == 400) {
                BootstrapDialog.alert("Problem with submit\nThere was an issue with the data in the request\n <details>" + response.responseText + "</details>");
            } else if (response.status == 401) {
                BootstrapDialog.alert("Problem with submit\nThere was an issue with sign-in\n <details>" + response.responseText + "</details>");
            } else {
                BootstrapDialog.alert("Problem with submit\n <details>", response.status, " ", response.statusText + "</details>");
            }
        }
    }));

    Promise.all(promises).then(function() { /* waiting for promises to return */ });

    // Update the beaches/sites lists while we can connect to the server
    var callback = function (gotten_beaches) {
        beaches = gotten_beaches;
    };

    // GET updated info from server
    window.beaches_sites_get.run(callback, false);
};
