/**
 *   Michigan Tech CS4791
 *   Nov 2017
 *   Jacob Striebel
 */

// TODO: NOTE FROM ZAC: Not all numeric fields are integers. Need to add checks for certain floating-point fields (these fields can be identified in the schema domain docs)

//$(function () {
//    var $btn = $("#btn-next");
//     $btn.click(function () {
//         if ($btn.html() === "Download") {
//             validatePage(undefined, true);
//         }
//    });
//});

function myAlert (msg) {

    // The method of displaying this information to the user can be altered to be made prettier if we want.

    BootstrapDialog.alert("The following form validation error occurred:\n" + msg);

}

function isEmptyOrIsNonnegativeInteger (candidate) {

    if (candidate === "") {
        return true;
    }

    var num = Math.floor(Number(candidate));

    if (num >= 0 && num == parseInt(Number(candidate), 10)){
        return true;
    }

    //if (num >= 0 && String(num) === candidate) {
    //    return true;
    //}

    return false;

}

function isEmptyOrIsInteger (candidate) {

    if (candidate === "") {
        return true;
    }

    var num = Math.floor(Number(candidate));

    if (num == parseInt(Number(candidate), 10)){
        return true;
    }

    // if (String(num) === candidate) {
    //     return true;
    // }

    return false;

}

function isEmptyOrIsIntegerDegree (candidate) {

    if (candidate === "") {
        return true;
    }

    var num = Math.floor(Number(candidate));

    if (num >= 0 && num <= 360 && num == parseInt(Number(candidate), 10)){
        return true;
    }

    // if (num >= 0 && num <= 360 && String(num) === candidate) {
    //     return true;
    // }

    return false;

}

function isNumeric(val) {

    var len;
    var decimalPoint;
    var i;
    var j;
    var ch;

    val = "" + val;
    len = val.length;
    decimalPoint = false;

    for (i = 0; i < len; i++) {

        ch = val.charAt(i);

        if (ch === ".") {
            if (decimalPoint === true) {
                return false;
            }
            decimalPoint = true;
        }
        else {
            for (j = 0; j < 10; j++) {
                if (ch === "0123456789".charAt(j)) {
                    break;
                }
            }
            if (j === 10) {
                return false;
            }
        }
    }

    return  true;

}

function isEmptyOrIspH (candidate) {

    if (candidate === "") {
        return true;
    }

    var num = parseFloat("" + candidate);
    if (isNumeric(candidate) === true && num >= 0 && num <= 14) {
        return true;
    }

    return false;

}

function validatePage (curPage, checkPage1) {

    var userId;
    var county;
    var countyOptions;
    var countyOptionsLen;
    var i;
    var lake;
    var lakeOptions;
    var lakeOptionsLen;
    var beach;
    var beachOptions;
    var beachOptionsLen;
    var site;
    var siteOptions;
    var siteOptionsLen;
    var date;

    var numLivingGulls;
    var numLivingGeese;
    var numLivingDogs;
    var numOtherLiving;
    var otherLivingDescription;

    var numDeadLoons;
    var numDeadHerringGulls;
    var numDeadRingGulls;
    var numDeadCormorants;
    var numDeadLongTailDucks;
    var numDeadScoter;
    var numDeadHornedGrebe;
    var numDeadRedNeckedGrebe;
    var numDeadFish;
    var numDeadBirds;

    var numPeopleInWater;
    var numPeopleOutOfWater;
    var numPeopleBoating;
    var numPeopleFishing;
    var numPeopleSurfing;
    var numPeopleWindSurfing;
    var numPeopleDiving;
    var numPeopleClamming;
    var numPeopleOther;

    var airTemp;
    var airTempUnits;
    var windSpeed;
    var windDirectionDegrees;
    var rainfallAmount;
    var rainfallAmountUnits;

    var waveHeight;
    var currentSpeed;
    var currentSpeedUnits;

    var pH;
    var waterTemp;
    var waterTempUnits;
    var turbidity;
    var NTU;
    var secchiTube;


    // -------------------------------------------

    var deadBirdsDescription;

    var waterMaterialDescription;

    var beachMaterialDescription;

    var otherPeopleDescription;
    
    var algaeTypeDescription;

    var algaeColorDescription;







    // Beach Selection
    if (checkPage1 === true /*curPage === 0*/) {

        //userId = $("#user_id").val();
        //if (/\w/.test(userId) === false) {
        //   myAlert("User ID is a required field and must be a single word made up of only alphanumeric and underscore characters.");
        //   return false;
        //}

        county = $("#__county").val();
        countyOptions = $("#countyList")[0].options;
        countyOptionsLen = countyOptions.length;
        for (i=0; i < countyOptionsLen; i++) {
            if (county === countyOptions[i].value) {
                break;
            }
        }
        if (i === countyOptionsLen) {
            myAlert("County is a required field and must be selected from the dropdown list.");
            return false;
        }

        lake = $("#__lake").val();
        lakeOptions = $("#lakeList")[0].options;
        lakeOptionsLen = lakeOptions.length;
        for (i=0; i < lakeOptionsLen; i++) {
            if (lake === lakeOptions[i].value) {
                break;
            }
        }
        if (i === lakeOptionsLen) {
            myAlert("Lake is a required field and must be selected from the dropdown list.");
            return false;
        }

        beach = $("#__beach").val();
        beachOptions = $("#beachList")[0].options;
        beachOptionsLen = beachOptions.length;
        for (i=0; i < beachOptionsLen; i++) {
            if (beach === beachOptions[i].value) {
                break;
            }
        }
        if (i === beachOptionsLen) {
            myAlert("Beach is a required field and must be selected from the dropdown list.");
            return false;
        }

        site = $("#__site").val();
        siteOptions = $("#monitorList")[0].options;
        siteOptionsLen = siteOptions.length;
        for (i=0; i < siteOptionsLen; i++) {
            if (site === siteOptions[i].value) {
                break;
            }
        }
        if (i === siteOptionsLen) {
            myAlert("Monitoring Site is a required field and must be selected from the dropdown list.");
            return false;
        }

        date = $("#SAMPLE_DATE_TIME").val();
        if (date === "") {
            myAlert("Sample Date is a required field. Please use the current datetime by clicking \"COLLECT SAMPLE NOW\" or use the date picker to choose a custom datetime.");
            return false;
        }

    }
    // Animals
    else if (curPage === 1) {

        numLivingGulls = $("#NO_GULLS").val();
        if (isEmptyOrIsNonnegativeInteger(numLivingGulls) === false) {
            myAlert("Number of living Gulls is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numLivingGeese = $("#NO_GEESE").val();
        if (isEmptyOrIsNonnegativeInteger(numLivingGeese) === false) {
            myAlert("Number of living Geese is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numLivingDogs = $("#NO_DOGS").val();
        if (isEmptyOrIsNonnegativeInteger(numLivingDogs) === false) {
            myAlert("Number of living Dogs is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numOtherLiving = $("#NO_ANIMALS_OTHER").val();
        if (isEmptyOrIsNonnegativeInteger(numOtherLiving) === false) {
            myAlert("Number of other living wildlife is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        otherLivingDescription = $("#NO_ANIMALS_OTHER_DESC").val().trim();
        if ((numOtherLiving !== "" && numOtherLiving !== "0") && otherLivingDescription === "") {
            myAlert("Number of other living wildlife is not a required field. However, if you do choose to provide it, you must also provide a description of that wildlife.");
            return false;
        }

    }
    // Deceased Animals
    else if (curPage === 2) {

        numDeadLoons = $("#NUM_LOONS").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadLoons) === false) {
            myAlert("Number of dead Loons is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numDeadHerringGulls = $("#NUM_HERR_GULLS").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadHerringGulls) === false) {
            myAlert("Number of dead Herring Gulls is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numDeadRingGulls = $("#NUM_RING_GULLS").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadRingGulls) === false) {
            myAlert("Number of dead Ring Gulls is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numDeadCormorants = $("#NUM_CORMORANTS").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadCormorants) === false) {
            myAlert("Number of dead Cormorants is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numDeadLongTailDucks = $("#NUM_LONGTAIL_DUCKS").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadLongTailDucks) === false) {
            myAlert("Number of dead Long-tail Ducks is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numDeadScoter = $("#NUM_SCOTER").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadScoter) === false) {
            myAlert("Number of dead Scoter is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numDeadHornedGrebe = $("#NUM_HORN_GREBE").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadHornedGrebe) === false) {
            myAlert("Number of dead Horned Grebe is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numDeadRedNeckedGrebe = $("#NUM_REDNECKED_GREBE").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadRedNeckedGrebe) === false) {
            myAlert("Number of dead Red-necked Grebe is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numDeadFish = $("#NUM_FISH").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadFish) === false) {
            myAlert("Number of dead Fish is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numDeadBirds = $("#NUM_OTHER").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadBirds) === false) {
            myAlert("Number of other dead birds is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        deadBirdsDescription = $("#NUM_OTHER_DESC").val().trim();
        if ((numDeadBirds !== "" && numDeadBirds !== "0") && deadBirdsDescription === "") {
            myAlert("Number of other dead birds is not a required field. However, if you do choose to provide it, you must also provide a description of them.");
            return false;
        }

    }
    // Debris in Water
    else if (curPage === 3) {

        waterMaterialDescription = $("#FLOAT_OTHER_DESC").val().trim();
        if ($("#FLOAT_OTHER").is(':checked') && waterMaterialDescription === "") {
            myAlert("Other material is not a required field. However, if you do choose to provide it, you must also provide a description of the material.");
            return false;
        }

    }
    // Debris on Beach
    else if (curPage === 4) {

        beachMaterialDescription = $("#DEBRIS_OTHER_DESC").val().trim();
        if ($("#DEBRIS_OTHER").is(':checked') && beachMaterialDescription === "") {
            myAlert("Other debris is not a required field. However, if you do choose to provide it, you must also provide a description of the debris.");
            return false;
        }

    }
    // Bathers
    else if (curPage === 5) {

        numPeopleInWater = $("#NO_IN_WATER").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleInWater) === false) {
            myAlert("Number of people in water is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numPeopleOutOfWater = $("#NUM_OUT_OF_WATER").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleOutOfWater) === false) {
            myAlert("Number of people out of water is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numPeopleBoating = $("#NO_PEOPLE_BOATING").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleBoating) === false) {
            myAlert("Number of people boating is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numPeopleFishing = $("#NO_PEOPLE_FISHING").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleFishing) === false) {
            myAlert("Number of people fishing is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numPeopleSurfing = $("#NO_PEOPLE_SURFING").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleSurfing) === false) {
            myAlert("Number of people surfing is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numPeopleWindSurfing = $("#NO_PEOPLE_WINDSURFING").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleWindSurfing) === false) {
            myAlert("Number of people wind surfing is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numPeopleDiving = $("#NUM_PEOPLE_DIVING").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleDiving) === false) {
            myAlert("Number of people diving is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numPeopleClamming = $("#NO_PEOPLE_CLAMMING").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleClamming) === false) {
            myAlert("Number of people clamming is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        numPeopleOther = $("#NO_PEOPLE_OTHER").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleOther) === false) {
            myAlert("Number of people doing other activities is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        otherPeopleDescription = $("#NO_PEOPLE_OTHER_DESC").val().trim();
        if ((numPeopleOther !== "" && numPeopleOther !== "0") && otherPeopleDescription === "") {
            myAlert("Number of other people is not a required field. However, if you do choose to provide it, you must also provide a description of them.");
            return false;
        }


    }
    // Weather
    else if (curPage === 6) {

        airTemp = $("#AIR_TEMP").val();
        if (isEmptyOrIsInteger(airTemp) === false) {
            myAlert("Air temperature is not a required field. However, if you do choose to provide it, only integers are valid input.");
            return false;
        }

        airTempUnits = $("#AIR_UNITS").find(":selected");
        if (airTemp !== "" && airTempUnits.length === 0) {
            myAlert("Air temperature is not a required field. However, if you do choose to provide it, you must also provide units.");
            return false;
        }

        windSpeed = $("#WIND_SPEED").val();
        if (isEmptyOrIsNonnegativeInteger(windSpeed) === false) {
            myAlert("Wind speed is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        // 0 to 360
        windDirectionDegrees = $("#WIND_DIR_DEGREES").val();
        if (isEmptyOrIsIntegerDegree(windDirectionDegrees) === false) {
            myAlert("Wind direction in degrees is not a required field. However, if you do choose to provide it, only integers in the inclusive range of 0 to 360 are valid input.");
            return false;
        }

        rainfallAmount = $("#RAINFALL").val();
        if (isEmptyOrIsNonnegativeInteger(rainfallAmount) === false) {
            myAlert("Rainfall amount is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        rainfallAmountUnits = $("#RAINFALL_UNITS").find(":selected");
        if (rainfallAmount !== "" && rainfallAmountUnits.length === 0) {
            myAlert("Rainfall amount is not a required field. However, if you do choose to provide it, you must also provide units.");
            return false;
        }
    }
    // Waves
    else if (curPage === 7) {

        waveHeight = $("#WAVE_HEIGHT").val();
        if (isEmptyOrIsNonnegativeInteger(waveHeight) === false) {
            myAlert("Wave height is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        currentSpeed = $("#CURRENT_SPEED").val();
        if (isEmptyOrIsNonnegativeInteger(currentSpeed) === false) {
            myAlert("Longshore current speed is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        currentSpeedUnits = $("#LONGSHORE_CURRENT_UNITS").find(":selected");
        if (currentSpeed !== "" && currentSpeedUnits.length === 0) {
            myAlert("Longshore current speed is not a required field. However, if you do choose to provide it, you must also provide units.");
            return false;
        }

    }
    // Water conditions
    else if (curPage === 8) {

        pH = $("#PH").val();
        if (isEmptyOrIspH(pH) === false) {
            myAlert("pH level is not a required field. However, if you do choose to provide it, only values in the inclusive range of 0 to 14 are valid input.");
            return false;
        }

        waterTemp = $("#AVG_WATER_TEMP").val();
        if (isEmptyOrIsInteger(waterTemp) === false) {
            myAlert("Water temperature is not a required field. However, if you do choose to provide it, only integers are valid input.");
            return false;
        }

        waterTempUnits = $("#AVG_WATER_TEMP_UNITS").find(":selected");
        if (waterTemp !== "" && waterTempUnits.length === 0) {
            myAlert("Water temperature is not a required field. However, if you do choose to provide it, you must also provide units.");
            return false;
        }

        NTU = $("#NTU").val();
        if (isEmptyOrIsNonnegativeInteger(NTU) === false) {
            myAlert("NTU is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

        secchiTube = $("#SECCHI_TUBE_CM").val();
        if (isEmptyOrIsNonnegativeInteger(secchiTube) === false) {
            myAlert("Secchi tube is not a required field. However, if you do choose to provide it, only nonnegative integers are valid input.");
            return false;
        }

    }
    // Algae
    else if (curPage === 9) {

        algaeTypeDescription = $("#ALGAE_TYPE_OTHER_DESC").val().trim();
        if ($("#ALGAE_TYPE_OTHER").is(':checked') && algaeTypeDescription === "") {
            myAlert("Other algae type is not a required field. However, if you do choose to provide it, you must also provide a description of the algae type.");
            return false;
        }

        algaeColorDescription = $("#ALGAE_COLOR_OTHER_DESC").val().trim();
        if ($("#ALGAE_COLOR_OTHER").is(':checked') && algaeColorDescription === "") {
            myAlert("Other algae color is not a required field. However, if you do choose to provide it, you must also provide a description of the algae color.");
            return false;
        }

    }
    // Comments
    else if (curPage === 10) {

    }

    return true;

}

























