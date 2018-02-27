/**
 * Created by cwbaldwi on 10/11/17.
 * Edited by Heckel on 02/11/18.
 */

window.survey_post = {};

// http://localhost:8081/bms/survey
// https://hci-dev.cs.mtu.edu:8117/BMS2/survey <-- TOMCAT URL IS CURRENTLY FOR TESTING SERVER
survey_post.URL_POST = "http://localhost:8081/bms/survey";

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
        if (survey.submitted) { // upload only submitted surveys
            toUpload = toUpload + JSON.stringify(survey) + ","; // stringify survey
        }
    });
    toUpload = toUpload.substr(0,toUpload.length-1) + "]"; // removes the last comma
    console.log(toUpload);

    // POST the clump
    promises.push($.ajax({
        type: 'POST',
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        url: survey_post.URL_POST,
        dataType: 'json',
        data: toUpload,
        success: function () { alert("success"); },
        error: function (response) { alert("no success:\n" + response); }
    }));

    Promise.all(promises).then(function() { /* waiting for promises to return */ });

    // Update the beaches/sites lists while we can connect to the server
    var callback = function (gotten_beaches) {
        beaches = gotten_beaches;
    };

    // GET updated info from server
    window.beaches_sites_get.run(callback, false);
};