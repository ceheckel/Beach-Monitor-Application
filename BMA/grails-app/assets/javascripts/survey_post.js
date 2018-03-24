/**
 * Created by cwbaldwi on 10/11/17.
 * Edited by Heckel on 02/11/18.
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
        //ensure that water and air temp are null if they ="" upon upload
        // if(survey.AVG_WATER_TEMP == "")
        //     survey.AVG_WATER_TEMP = null;
        // if(survey.AIR_TEMP == "")
        //     survey.AIR_TEMP = null;

        //ensure only submitted surveys get uploaded
        // console.log("survey: ", survey.submitted);
        if (survey.submitted) { // upload only submitted surveys
            toUpload = toUpload + JSON.stringify(survey) + ","; // stringify survey
        }
    });
    toUpload = toUpload.substr(0,toUpload.length-1) + "]"; // removes the last comma
    console.log(toUpload);

    var user = btoa($("#username-field").val());
    var pw =  btoa($("#password-field").val());
    console.log("user: ", user, " pw:", pw);

    // POST the clump
    promises.push($.ajax({
        type: 'POST',
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        url: survey_post.URL_POST,
        dataType: 'json',
        data: toUpload,
        success: function () {
            //alert("success");
            BootstrapDialog.alert("Report submitted successfully");
            console.log(toUpload);
        },
        error: function (response) {
            console.log("err with post, response: ", response);
            if (response.status == 500) {
                BootstrapDialog.alert("Problem with submit\nA survey with this location and date/time has already been submitted");
            } else if (response.status == 400) {
                BootstrapDialog.alert("Problem with submit\nThere was an issue with the data in the request");
            } else if (response.status == 401) {
                BootstrapDialog.alert("Problem with submit\nThere was an issue with sign-in");
            } else {
                BootstrapDialog.alert("Problem with submit:\n", response.status, " ", response.statusText);
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