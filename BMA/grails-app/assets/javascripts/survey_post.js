/**
 * Created by cwbaldwi on 10/11/17.
 */

window.survey_post = {};

survey_post.TEST = false;
survey_post.POST_URL = "";
survey_post.LOCALHOST_SURVEYS_URL = "http://localhost:8081/bms/survey";
survey_post.TOMCAT_SURVEYS_URL = "https://hci-dev.cs.mtu.edu:8105/BMS2/survey";

survey_post.test_survey = {
    __county: "Test County",
    __lake: "Test Lake",
    __beach: "Test Beach",
    __site: "Test Site",
    user_id: "asdf",
    NO_GULLS: 1,
    NO_GEESE: 2,
    NO_DOGS: 2,
    NO_ANIMALS_OTHER: 0,
    NUM_LOONS: 1,
    NUM_HERR_GULLS: 1,
    NUM_RING_GULLS: 1,
    NUM_CORMORANTS: 1,
    NUM_LONGTAIL_DUCKS: 1,
    NUM_SCOTER: 1,
    NUM_HORN_GREBE: 1,
    NUM_REDNECKED_GREBE: 1,
    NUM_FISH: 1,
    NUM_OTHER: 0,
    FLOAT_STREET_LITTER: true,
    FLOAT_FOOD: true,
    FLOAT_MEDICAL: true,
    FLOAT_SEWAGE: true,
    FLOAT_BLDG_MATERIALS: true,
    FLOAT_FISHING: true,
    FLOAT_OTHER: false,
    DEBRIS_STREET_LITTER: true,
    DEBRIS_FOOD: true,
    DEBRIS_MEDICAL: true,
    DEBRIS_SEWAGE: true,
    DEBRIS_BLDG_MATERIALS: true,
    DEBRIS_FISHING: true,
    DEBRIS_HOUSEHOLD: true,
    DEBRIS_TAR: true,
    DEBRIS_OIL: true,
    DEBRIS_OTHER: false,
    DEBRIS_AMOUNT: "much",
    NO_IN_WATER: 1,
    NUM_OUT_OF_WATER: 1,
    NO_PEOPLE_BOATING: 1,
    NO_PEOPLE_FISHING: 1,
    NO_PEOPLE_SURFING: 1,
    NO_PEOPLE_WINDSURFING: 1,
    NUM_PEOPLE_DIVING: 1,
    NO_PEOPLE_CLAMMING: 1,
    NO_PEOPLE_OTHER: 0,
    AIR_TEMP: 70,
    AIR_UNITS: "F",
    WIND_SPEED: 5,
    WIND_SPEED_UNITS: "mph",
    WIND_DIR_DEGREES: 50,
    WIND_DIR_DESC: "very light",
    WEATHER_DES: "mostly clear",
    RAINFALL_LAST_EVENT: "2 hours",
    RAINFALL: 3,
    RAINFALL_UNITS: "IN",
    RAINFALL_STD_DESC: "Not much",
    WAVE_HEIGHT: 1.2,
    WAVE_HEIGHT_UNITS: "FT",
    EST_ACT_FLAG: true,
    WAVE_DIRECTION: "NNW",
    WAVE_CONDITIONS: "Not many",
    CURRENT_SPEED: "10",
    LONGSHORE_CURRENT_UNITS: "cm/sec",
    SHORELINE_CURRENT_DIR: "NNW",
    PH: 7.0,
    COLOR_CHANGE: false,
    ODOR_DESCRIPTION: "Smells like a lake alright",
    AVG_WATER_TEMP: 60,
    AVG_WATER_TEMP_UNITS: "F",
    CLARITY_DESC: "Pretty clear, pretty clear",
    NTU: 1.0,
    SECCHI_TUBE_CM: 5,
    ALGAE_NEARSHORE: "yep",
    ALGAE_ON_BEACH: "yep",
    ALGAE_TYPE_PERIPHYTON: true,
    ALGAE_TYPE_GLOBULAR: true,
    ALGAE_TYPE_FREEFLOATING: true,
    ALGAE_TYPE_OTHER: false,
    ALGAE_COLOR_LT_GREEN: true,
    ALGAE_COLOR_BRGHT_GREEN: true,
    ALGAE_COLOR_DRK_GREEN: true,
    ALGAE_COLOR_YELLOW: true,
    ALGAE_COLOR_BROWN: true,
    ALGAE_COLOR_OTHER: false
};

/**
 * Uploads all surveys to the Wi Beach Server
 * @param callback
 */
survey_post.upload = function() {
    if (survey_post.TEST) {

        $.ajax({
            type: 'POST',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            url: survey_post.POST_URL,
            dataType: 'json',
            data: JSON.stringify(survey_post.test_survey),
            success: function(response) {
                alert("Success");
                console.log(response);
            },
            error: function(response) {
                alert('Failed!');
                console.log(response);
            }
        });
    }
    else {
        Surveys.getAll(function(surveys) {

            surveys.forEach(function(survey) {

                //console.log(survey);

                if (survey.submitted) {

                    $.ajax({
                        type: 'POST',
                        crossDomain: true,
                        contentType: 'application/json; charset=utf-8',
                        url: survey_post.POST_URL,
                        dataType: 'json',
                        data: JSON.stringify(survey),
                        success: function (response) {
                            console.log(response);
                        },
                        error: function (response) {
                            alert('There was a problem uploading Survey ' + survey.id + ' to the server.');
                            console.log(getAllFields());
                        }
                    });
                }
            });


            var callback = function (gotten_beaches) {
                beaches = gotten_beaches;
            };
            window.beaches_sites_get.run(callback, false);

        })
    }
};