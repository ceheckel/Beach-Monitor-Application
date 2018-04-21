/**
 *   Michigan Tech CS4791
 *   Nov 2017
 *   Jacob Striebel
 *   Zac Paris (Edited)
 */

// TODO: NOTE FROM ZAC: Not all numeric fields are integers. Need to add checks for certain floating-point fields (these fields can be identified in the schema domain docs)

/**
 * The method of displaying this information to the user can be altered to be made prettier if we want.
 *
 * @param msg   feedback message given by system.  Usually an error stacktrace
 */
function myAlert (msg) {
    BootstrapDialog.alert("The following form validation error occurred:\n" + msg);
}

// Test if the pre-decimal part of the input number is too large for the database column
function isShorterThan(candidate, value){

    var num = Math.ceil(Number(candidate));

    if (value < num.toString().length){
        return false;
    }

    return true;
}

// Value used for isLongerThan call
function isEmptyOrIsNonnegativeInteger (candidate, value) {

    if (candidate === "") {
        return true;
    }

    var num = Math.floor(Number(candidate));

    // if (num >= 0 && num == parseInt(Number(candidate), 10)){
    if (Number.isInteger(Number(candidate))){
        if(isShorterThan(candidate, value)){
            return true;
        }
    }

    return false;

}

function isEmptyOrIsInteger (candidate) {

    if (candidate === "") {
        return true;
    }

    var num = Math.floor(Number(candidate));

    // if (num == parseInt(Number(candidate), 10)){
    if(Number.isInteger(Number(candidate))){
        return true;
    }

    return false;

}

function isEmptyOrIsIntegerDegree (candidate) {

    if (candidate === "") {
        return true;
    }

    var num = Math.floor(Number(candidate));

    if (num >= 0 && num <= 360 && Number.isInteger(Number(candidate))){
        return true;
    }

    return false;

}

// maxlen used for isShorterThan
// neg: true if number can be negative
function isNumeric(val, maxlen, neg) {

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
            if (!isShorterThan(val, maxlen)){
                return false;
            }
        } else if (ch === "-") {
            if (neg == false || i != 0){
                return false;
            }
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
    if(!decimalPoint && !isShorterThan(val, maxlen)){
        return false;
    }

    return  true;

}

function isEmptyOrIspH (candidate) {

    if (candidate === "") {
        return true;
    }

    var num = parseFloat("" + candidate);
    if (isNumeric(candidate, 2, false) === true && num >= 0 && num <= 14) {
        return true;
    }

    return false;

}

/**
 * Checks fields based on what page number is supplied.
 * Warns is invalid input is present
 *
 * @param curPage   int
 * @returns {boolean}
 */
function validatePage (curPage) {

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
    if (curPage === 0 || curPage === totalQuestionPages) {
        if ($('#__county').val() === ''){
            myAlert("County is a required field and must be selected from the dropdown list.");
            return false;
        }
        if ($("#__lake").val() === '') {
            myAlert("Lake is a required field and must be selected from the dropdown list.");
            return false;
        }
        if ($("#__beach").val() === '') {
            myAlert("Beach is a required field and must be selected from the dropdown list.");
            return false;
        }
        if ($("#__site").val() === '') {
            myAlert("Monitoring Site is a required field and must be selected from the dropdown list.");
            return false;
        }

        date = $("#SAMPLE_DATE_TIME").val();
        if (date === "-1") {
            myAlert("Sample Date is a required field. Please use the current datetime by clicking \"COLLECT SAMPLE NOW\" or use the date picker to choose a custom datetime.");
            return false;
        }
    }

    // Animals
    if (curPage === 1 || curPage === totalQuestionPages) {

        numLivingGulls = $("#NO_GULLS").val();
        if (isEmptyOrIsNonnegativeInteger(numLivingGulls, 8) === false) {
            myAlert("Number of living Gulls is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numLivingGeese = $("#NO_GEESE").val();
        if (isEmptyOrIsNonnegativeInteger(numLivingGeese, 8) === false) {
            myAlert("Number of living Geese is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numLivingDogs = $("#NO_DOGS").val();
        if (isEmptyOrIsNonnegativeInteger(numLivingDogs, 8) === false) {
            myAlert("Number of living Dogs is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numOtherLiving = $("#NO_ANIMALS_OTHER").val();
        if (isEmptyOrIsNonnegativeInteger(numOtherLiving, 8) === false) {
            myAlert("Number of other living wildlife is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        otherLivingDescription = $("#ANIMALS_OTHER_DESC").val().trim();
        if ((numOtherLiving !== "" && numOtherLiving !== "0") && otherLivingDescription === "") {
            myAlert("Number of other living wildlife is not a required field. However, if you do choose to provide it, you must also provide a description of that wildlife.");
            return false;
        }
    }

    // Deceased Animals
    if (curPage === 2 || curPage === totalQuestionPages) {

        numDeadLoons = $("#NUM_LOONS").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadLoons, 8) === false) {
            myAlert("Number of dead Loons is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numDeadHerringGulls = $("#NUM_HERR_GULLS").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadHerringGulls, 8) === false) {
            myAlert("Number of dead Herring Gulls is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numDeadRingGulls = $("#NUM_RING_GULLS").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadRingGulls, 8) === false) {
            myAlert("Number of dead Ring Gulls is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numDeadCormorants = $("#NUM_CORMORANTS").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadCormorants, 8) === false) {
            myAlert("Number of dead Cormorants is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numDeadLongTailDucks = $("#NUM_LONGTAIL_DUCKS").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadLongTailDucks, 8) === false) {
            myAlert("Number of dead Long-tail Ducks is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numDeadScoter = $("#NUM_SCOTER").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadScoter, 8) === false) {
            myAlert("Number of dead Scoter is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numDeadHornedGrebe = $("#NUM_HORN_GREBE").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadHornedGrebe, 8) === false) {
            myAlert("Number of dead Horned Grebe is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numDeadRedNeckedGrebe = $("#NUM_REDNECKED_GREBE").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadRedNeckedGrebe, 8) === false) {
            myAlert("Number of dead Red-necked Grebe is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numDeadFish = $("#NUM_DEAD_FISH").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadFish, 8) === false) {
            myAlert("Number of dead Fish is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numDeadBirds = $("#NUM_OTHER").val();
        if (isEmptyOrIsNonnegativeInteger(numDeadBirds, 8) === false) {
            myAlert("Number of other dead birds is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        deadBirdsDescription = $("#NUM_OTHER_DESC").val().trim();
        if ((numDeadBirds !== "" && numDeadBirds !== "0") && deadBirdsDescription === "") {
            myAlert("Number of other dead birds is not a required field. However, if you do choose to provide it, you must also provide a description of them.");
            return false;
        }
    }

    // Debris in Water
    if (curPage === 3 || curPage === totalQuestionPages) {

        waterMaterialDescription = $("#FLOAT_OTHER_DESC").val().trim();
        if ($("#FLOAT_OTHER").is(':checked') && waterMaterialDescription === "") {
            myAlert("Other material is not a required field. However, if you do choose to provide it, you must also provide a description of the material.");
            return false;
        }
    }

    // Debris on Beach
    if (curPage === 4 || curPage === totalQuestionPages) {

        beachMaterialDescription = $("#DEBRIS_OTHER_DESC").val().trim();
        if ($("#DEBRIS_OTHER").is(':checked') && beachMaterialDescription === "") {
            myAlert("Other debris is not a required field. However, if you do choose to provide it, you must also provide a description of the debris.");
            return false;
        }
    }

    // Bathers
    if (curPage === 5 || curPage === totalQuestionPages) {

        numPeopleInWater = $("#NO_IN_WATER").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleInWater, 8) === false) {
            myAlert("Number of people in water is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numPeopleOutOfWater = $("#NUM_OUT_OF_WATER").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleOutOfWater, 8) === false) {
            myAlert("Number of people out of water is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numPeopleBoating = $("#NO_PEOPLE_BOATING").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleBoating, 8) === false) {
            myAlert("Number of people boating is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numPeopleFishing = $("#NO_PEOPLE_FISHING").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleFishing, 8) === false) {
            myAlert("Number of people fishing is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numPeopleSurfing = $("#NO_PEOPLE_SURFING").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleSurfing, 8) === false) {
            myAlert("Number of people surfing is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numPeopleWindSurfing = $("#NO_PEOPLE_WINDSURFING").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleWindSurfing, 8) === false) {
            myAlert("Number of people wind surfing is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numPeopleDiving = $("#NUM_PEOPLE_DIVING").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleDiving, 8) === false) {
            myAlert("Number of people diving is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numPeopleClamming = $("#NO_PEOPLE_CLAMMING").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleClamming, 8) === false) {
            myAlert("Number of people clamming is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        numPeopleOther = $("#NO_PEOPLE_OTHER").val();
        if (isEmptyOrIsNonnegativeInteger(numPeopleOther, 8) === false) {
            myAlert("Number of people doing other activities is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 digits or fewer are valid input.");
            return false;
        }

        otherPeopleDescription = $("#NO_PEOPLE_OTHER_DESC").val().trim();
        if ((numPeopleOther !== "" && numPeopleOther !== "0") && otherPeopleDescription === "") {
            myAlert("Number of other people is not a required field. However, if you do choose to provide it, you must also provide a description of them.");
            return false;
        }
    }

    // Weather
    if (curPage === 6 || curPage === totalQuestionPages) {

        airTemp = $("#AIR_TEMP").val();
        if (isNumeric(airTemp, 4, true) === false) {
            myAlert("Air temperature is not a required field. However, if you do choose to provide it, only values with 4 or fewer digits left of the decimal place are valid input.");
            return false;
        }

        airTempUnits = $("#AIR_UNITS").find(":selected");
        if (airTemp !== "" && airTempUnits.length === 0) {
            myAlert("Air temperature is not a required field. However, if you do choose to provide it, you must also provide units.");
            return false;
        }

        windSpeed = $("#WIND_SPEED").val();
        if (isNumeric(windSpeed, 4, false) === false) {
            myAlert("Wind speed is not a required field. However, if you do choose to provide it, only nonnegative values with 4 or fewer digits left of the decimal place are valid input.");
            return false;
        }

        // 0 to 360
        windDirectionDegrees = $("#WIND_DIR_DEGREES").val();
        if (isEmptyOrIsIntegerDegree(windDirectionDegrees, 3) === false) {
            myAlert("Wind direction in degrees is not a required field. However, if you do choose to provide it, only integers in the inclusive range of 0 to 360 are valid input.");
            return false;
        }

        rainfallAmount = $("#RAINFALL").val();
        if (isNumeric(rainfallAmount, 4, false) === false) {
            myAlert("Rainfall amount is not a required field. However, if you do choose to provide it, only nonnegative values with 4 or fewer digits left of the decimal place are valid input.");
            return false;
        }

        rainfallAmountUnits = $("#RAINFALL_UNITS").find(":selected");
        if (rainfallAmount !== "" && rainfallAmountUnits.length === 0) {
            myAlert("Rainfall amount is not a required field. However, if you do choose to provide it, you must also provide units.");
            return false;
        }
    }

    // Waves
    if (curPage === 7 || curPage === totalQuestionPages) {

        waveHeight = $("#WAVE_HEIGHT").val();
        if (isNumeric(waveHeight, 4, false) === false) {
            myAlert("Wave height is not a required field. However, if you do choose to provide it, only nonnegative values with 4 or fewer digits left of the decimal place are valid input.");
            return false;
        }

        currentSpeed = $("#CURRENT_SPEED").val();
        if (isEmptyOrIsNonnegativeInteger(currentSpeed, 8) === false) {
            myAlert("Longshore current speed is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 or fewer digits are valid input.");
            return false;
        }

        currentSpeedUnits = $("#LONGSHORE_CURRENT_UNITS").find(":selected");
        if (currentSpeed !== "" && currentSpeedUnits.length === 0) {
            myAlert("Longshore current speed is not a required field. However, if you do choose to provide it, you must also provide units.");
            return false;
        }
    }

    // Water conditions
    if (curPage === 8 || curPage === totalQuestionPages) {

        pH = $("#PH").val();
        if (isEmptyOrIspH(pH) === false) {
            myAlert("pH level is not a required field. However, if you do choose to provide it, only values in the inclusive range of 0 to 14 are valid input.");
            return false;
        }

        waterTemp = $("#AVG_WATER_TEMP").val();
        if (isNumeric(waterTemp, 5, true) === false) {
            myAlert("Water temperature is not a required field. However, if you do choose to provide it, only values with 5 or fewer digits left of the decimal place are valid input.");
            return false;
        }

        waterTempUnits = $("#AVG_WATER_TEMP_UNITS").find(":selected");
        if (waterTemp !== "" && waterTempUnits.length === 0) {
            myAlert("Water temperature is not a required field. However, if you do choose to provide it, you must also provide units.");
            return false;
        }

        NTU = $("#NTU").val();
        if (isNumeric(NTU, 8, false) === false) {
            myAlert("NTU is not a required field. However, if you do choose to provide it, only nonnegative values with 8 or fewer digits left of the decimal place are valid input.");
            return false;
        }

        secchiTube = $("#SECCHI_TUBE_CM").val();
        if (isEmptyOrIsNonnegativeInteger(secchiTube, 8) === false) {
            myAlert("Secchi tube is not a required field. However, if you do choose to provide it, only nonnegative integers with 8 or fewer digits are valid input.");
            return false;
        }
    }

    // Algae
    if (curPage === 9 || curPage === totalQuestionPages) {

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

    return true;
}

























