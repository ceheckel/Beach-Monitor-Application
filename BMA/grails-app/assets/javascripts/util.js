/**
 * All Utility functions (or functions without a better home
 * that shouldn't be in application.js live here
 *
 * @author Daniel Wagner (edited 02/24/2017)
 *
 */

/**
 * Generates a random "global unique identifier"
 * @returns {string} The guid generated
 */
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

/**
 * Takes a date and returns a formatted string for surveys in home page
 * @param date
 * @returns {number|*|string}
 */
function getDateFormatted(date) {
    formattedString = "";
    switch (date.getMonth()) {
        case 0:
            formattedString += "Jan. ";
            break;
        case 1:
            formattedString += "Feb. ";
            break;
        case 2:
            formattedString += "Mar. ";
            break;
        case 3:
            formattedString += "Apr. ";
            break;
        case 4:
            formattedString += "May. ";
            break;
        case 5:
            formattedString += "Jun. ";
            break;
        case 6:
            formattedString += "Jul. ";
            break;
        case 7:
            formattedString += "Aug. ";
            break;
        case 8:
            formattedString += "Sep. ";
            break;
        case 9:
            formattedString += "Oct. ";
            break;
        case 10:
            formattedString += "Nov. ";
            break;
        case 11:
            formattedString += "Dec. ";
            break;
    }
    formattedString += date.getDate();
    return formattedString;
}

/**
 * Changes date to localized date
 * @param d
 * @param isDisplay boolean to determine if format is for button or for server
 * @returns {string}
 *
 * @author Heckel (edited)
 */
function dateToLocalDate(d, isDisplay) {
    if(isDisplay == true) { // The display's version
        return ('000'+d.getFullYear()).slice(-4) + '-' +
            ('0'+(d.getMonth()+1)).slice(-2) + '-' +
            ('0'+d.getDate()).slice(-2) + 'T' +
            ('0'+d.getHours()).slice(-2) + ':' +
            ('0'+d.getMinutes()).slice(-2);
    } else { // The server's version includes seconds and milliseconds
        return ('000'+d.getFullYear()).slice(-4) + '-' +
            ('0'+(d.getMonth()+1)).slice(-2) + '-' +
            ('0'+d.getDate()).slice(-2) + 'T' +
            ('0'+d.getHours()).slice(-2) + ':' +
            ('0'+d.getMinutes()).slice(-2) + ':' +
            ('0'+d.getSeconds()).slice(-2) + '.' +
            ('0'+d.getMilliseconds()).slice(-3) + 'Z';
    }
}

/**
 * Check to see if a number is dirty?
 * NEED MORE DOCUMENTATION ON THIS
 * @param e window event
 */
function checkDirtyNumber(e) {
    e = e || window.event;
    var targ = e.target || e.srcElement;
    if (targ.nodeType == 3) targ = targ.parentNode; // defeat Safari bug
    if(targ.parentNode.classList.contains("is-invalid"))
        targ.parentNode.classList.add("is-dirty");
    else if(targ.value == "")
        targ.parentNode.classList.remove("is-dirty");
}

/**
 * Determines if the page is completed or not and marks it as such
 * @param nextPage Next page to jump to
 */
function completePage(nextPage) {
    completedSurvey = true;
    var complete = true;

    // ensure that the required fields have values
    if (curPage == 0) {
        if ($(this).attr("id") == '__beach' && $(this).val() == "")
            complete = false;
        if ($(this).attr("id") == '__site' && $(this).val() == "")
            complete = false;
        if ($(this).attr("id") == 'SAMPLE_DATE_TIME' && $(this).val() == "")
            complete = false;
    }
    if (!visitedPages)
        visitedPages = [];
    if (visitedPages.indexOf(page) < 0 && visitedPages.indexOf(totalQuestionPages) < 0)
        complete = false;

    if (nextPage != 'home' && page >= 0 && page < totalQuestionPages) {
        if (complete) {
            /*
             * inclusion of the next line provides check marks next to page names on drawer.
             * With new set of requirements (beach id, site id, and time), most pages are 'complete' by default.
             * Removed by Heckel
             */
            // document.getElementById('Complete_' + page).style.display = 'inline';
            incompletePages.delete(page);
        }
        else {
            document.getElementById('Complete_' + page).style.display = 'none';
            completedSurvey = false;
            incompletePages.add(page);
        }
    }

    if (nextPage == 'home') {
        for (var i = 0; i < totalQuestionPages; i++) {
            document.getElementById('Complete_' + i).style.display = 'none';
        }
        getSurveys();
    }
}

/**
 * Gets all of the fields in the current survey and returns them as a map
 * @returns {{}|*}
 *      Maps the name of each field to its value, including undefined fields
 */
function getAllFields() {
    data = {};
    $('[name]').each(function () {
        if ($(this).attr('class') == "mdl-radio__button") {
            if (this.parentElement.className.includes('is-checked')) {
                data[this.name] = $(this).attr("id");
            }
        }
        else if ($(this).attr('class') == "mdl-checkbox__input") {
            if (this.parentElement.className.includes('is-checked'))
                data[this.name] = true;
            else
                data[this.name] = false;
        }
        else /*if (this.value)*/ {
            data[this.name] = this.value;
        }
    });
    data['vPages'] = visitedPages;
    data['submitted'] = submitted;
    OtherChange("#NO_ANIMALS_OTHER","#ANIMALS_OTHER_DESC");
    OtherChange("#NO_PEOPLE_OTHER","#NO_PEOPLE_OTHER_DESC");
    OtherChange("#NUM_OTHER","#NUM_OTHER_DESC");
    OtherCheckbox("#FLOAT_OTHER","#FLOAT_OTHER_DESC");
    OtherCheckbox("#DEBRIS_OTHER","#DEBRIS_OTHER_DESC");
    OtherCheckbox("#COLOR_CHANGE","#COLOR_DESCRIPTION");
    OtherCheckbox("#ALGAE_TYPE_OTHER","#ALGAE_TYPE_OTHER_DESC");
    OtherCheckbox("#ALGAE_COLOR_OTHER","#ALGAE_COLOR_OTHER_DESC");
    RainfallChange(false);
    OdorChange();
    TurbidityOrNTUChange();
    return data;
}

/**
 * Sets the value of each field in the survey to be the default values
 */
function clearAllFields() {
    $('[name]').each(function () {
        $(this).prop('disabled', false);
        if (this.value && !this.dataset.keep) {
            this.parentElement.className = this.parentElement.className.replace("is-dirty", "");
            this.value = '';
        }
        if(this.parentElement.classList.contains("is-invalid")){
            this.parentElement.className = this.parentElement.className.replace("is-dirty", "");
            this.parentElement.className = this.parentElement.className.replace("is-invalid", "");
            this.value = '';
        }
        if ($(this).attr('class') == "mdl-radio__button") {
            $(this.parentElement.parentElement).children().each(function () {
                this.className = this.className.replace("is-checked", "");
            });
        }
        if ($(this).attr('class') == "mdl-checkbox__input") {
            this.parentElement.className = this.parentElement.className.replace("is-checked", "");
        }
    });
    OtherChange("#NO_ANIMALS_OTHER","#ANIMALS_OTHER_DESC");
    OtherChange("#NO_PEOPLE_OTHER","#NO_PEOPLE_OTHER_DESC");
    OtherChange("#NUM_OTHER","#NUM_OTHER_DESC");
    OtherCheckbox("#FLOAT_OTHER","#FLOAT_OTHER_DESC");
    OtherCheckbox("#DEBRIS_OTHER","#DEBRIS_OTHER_DESC");
    OtherCheckbox("#COLOR_CHANGE","#COLOR_DESCRIPTION");
    OtherCheckbox("#ALGAE_TYPE_OTHER","#ALGAE_TYPE_OTHER_DESC");
    OtherCheckbox("#ALGAE_COLOR_OTHER","#ALGAE_COLOR_OTHER_DESC");
    RainfallChange(false);
    OdorChange();
    TurbidityOrNTUChange();
}

/**
 * Enables save favorite button if valid beach information is entered
 */
function saveFavoriteEnabled() {
    var unique = true;
    if(favorites) {
        favorites.forEach(function (f, i) {
            if (f.county == $('#__county').val() && f.lake == $('#__lake').val() && f.beach == $('#__beach').val() && f.site == $('#__site').val()) {
                unique = false;
            }
        });
    }
    $('#__addFavorite').prop('disabled',
        !unique ||
        $('#__county').val() == '' ||
        $('#__lake').val() == '' ||
        $('#__beach').val() == '' ||
        $('#__site').val() == '' ||
        submitted
    )
}

/**
 * Used to populate selectfield boxes with
 * the correct suggestions
 * @param input
 * @param list
 * @param stored
 */
function updateSeq(input, list, stored) {
    var val = $(input).val();
    var opt = undefined;

    $(list).find('> option').each(function () {
        if ($(this).val() === val) opt = this;
    });

    if (opt) {
        var county = $('#__county').val();
        var lake = $('#__lake').val();
        var beach = $('#__beach').val();
        if (input === '#__beach')
            $(stored).val(beaches[county][lake][beach]._site);
        else
            $(stored).val(beaches[county][lake][beach][$('#__site').val()])
    }
}

/**
 * Creates and sets two versions of a new Date instance.
 * Version 1 is for the browser to display
 * Version 2 is for the server to store
 */
function collectSampleNow() {
    var d = new Date(); // get full date/time
    $('#SAMPLE_DATE_TIME_DISPLAYED').val(dateToLocalDate(d, true)); // parse for field display
    $('#SAMPLE_DATE_TIME').val(dateToLocalDate(d, false)); // parse for server info
}

/**
 * removes all data related to the beach selection on first page of form
 */
function clearBeachFields() {
    $('#__county').val("");
    $('#__lake').val("");
    $('#__beach').val("");
    $('#__site').val("");
}

/**
 * Creates and sets two versions of a new Date instance.
 * Version 1 is for the browser to display
 * Version 2 is for the server to store
 */
function collectSampleNow() {
    var d = new Date(); // get full date/time
    $('#SAMPLE_DATE_TIME_DISPLAYED').val(dateToLocalDate(d, true)); // parse for field display
    $('#SAMPLE_DATE_TIME').val(dateToLocalDate(d, false)); // parse for server info
}

function clearBeachFields() {
    $('#__county').val("");
    $('#__lake').val("");
    $('#__beach').val("");
    $('#__site').val("");
}