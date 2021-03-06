/**
 * Collection of all methods that modify surveys or survey related fields
 *
 * @author Heckel (edited 02/17/2018)
 * @author Wagner (edited 02/17/2018)
 */

/**
 * Clears all fields and starts a new survey, navigating to the beach selection page.
 * Sets onbeforeunload function to warn user before refreshing page.
 *
 * @author Paris
 */
function newSurvey() {
    // Clears all fields
    clearAllFields();

    // Generate new Global Unique ID and date
    surveyId = guid();
    surveyDate = new Date();
    $('#DATE_ENTERED').val(dateToLocalDate(surveyDate, true));
    selected = false;

    // Navigate to beach selection page
    toPage(0,false);
    $('#page-questions').css('display', 'block');

    // Set page to warn user before reloading
    window.onbeforeunload = function() {
        saveSurvey(curPage);
        return "Are you sure you want to refresh?";
    };
}

/**
 * Saves current survey information to localforage,
 *
 * @author Heckel (edited 02/17/2018)
 */
function saveSurvey() {
    // if survey is invalid, or current page is the home page, do nothing
    if (typeof(surveyId) === 'undefined' || curPage == 'home') { return; }

    // set last modified date
    $('#DATE_UPDATED').val(dateToLocalDate(new Date(), false));

    // save/update all fields
    var data = getAllFields();
    data.id = surveyId;
    data.date = surveyDate;
    data['submitted'] = submitted;

    // create new survey
    var survey = new Survey(data.id, data);
    survey.save(function() {
        // Show toast
        showSaveToast();
    });
}

/**
 * loads a survey from localforage
 *
 * @param id
 *      survey ID of the survey to be loaded
 */
function loadSurvey(id) {
    surveyId = id;

    // get survey from localforage, then run callback
    Surveys.getById(surveyId, null, function(survey) {
        fillCounties();
        submitted = survey['submitted'];
        $('[name]').each(function () {
            $(this).prop('disabled', submitted);
            var nameToString = this.name.toString();
            if ($(this).attr('class') == "mdl-radio__button") {
                $(this.parentElement.parentElement).children().each(function () {
                    forProp = $(this).prop("for");
                    if (forProp === survey[nameToString]) {
                        this.className += " is-checked";
                    }
                });
            }
            else if ($(this).attr('class') == "mdl-checkbox__input") {
                if (survey[nameToString]) {
                    this.parentElement.className += " is-checked";
                    $(this).prop("checked", true);
                }
                else {
                    $(this).prop("checked", false);
                }
            }
            else if (this.name in survey && survey[nameToString])
            {
                this.value = survey[nameToString];
                this.parentElement.className += " is-dirty";
                // If the field being updated is one of the site selection fields, cascade the change downward so that
                // those fields can be updated correctly. Otherwise, they will be blank.
                if (nameToString == "__county"){
                    fillFromCounty();
                }
                else if (nameToString == "__lake"){
                    fillFromLake();
                }
                else if (nameToString == "__beach"){
                    fillFromBeach();
                }
            }
        });

        updateSeq('#__beach', '#BEACH_SEQ');
        updateSeq('#__site', '#MONITOR_SITE_SEQ');
        surveyDate = new Date(survey['date']);
        // visitedPages = survey['vPages'];
        if(submitted)
            window.onbeforeunload = null;
        else
            window.onbeforeunload = function() {
                saveSurvey(curPage);
                return "Are you sure you want to refresh?";
            };
        toPage(0,false);
    });
}

/**
 *  Create html tags for the two sections, local and uploaded
 *  populate the appropriate hmtl lists with surveys
 */
function getSurveys() {
    // create two lists for surveys
    var localList = document.getElementById("local-reports");
    var uploadedList = document.getElementById("uploaded-reports");

    // Remove all elements from unsubmitted reports list
    while (localList.firstChild)
        localList.removeChild(localList.firstChild);

    // Create element tags for unsubmitted reports
    var header = document.createElement("li");
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
    header.className = "mdl-list__item";
    span1.className = "mdl-list__item-primary-content";
    span2.className = "mdl-typography--font-bold";
    span2.appendChild(document.createTextNode("Local Reports"));
    header.appendChild(span1);
    span1.appendChild(span2);
    localList.appendChild(header);

    // Remove all elements from submitted reports list
    while (uploadedList.firstChild)
        uploadedList.removeChild(uploadedList.firstChild);

    // Create element tags for submitted reports
    header = document.createElement("li");
    span1 = document.createElement("span");
    span2 = document.createElement("span");
    header.className = "mdl-list__item";
    span1.className = "mdl-list__item-primary-content";
    span2.className = "mdl-typography--font-bold";
    span2.appendChild(document.createTextNode("Uploaded Reports"));
    header.appendChild(span1);
    span1.appendChild(span2);
    uploadedList.appendChild(header);

    // Populate list
    Surveys.getAll(function(surveys) {
        surveys.sort(function(a, b){return new Date(b.date) - new Date(a.date)});

        for (var i = 0; i < surveys.length; i++) {
            // create list item
            var li = document.createElement("li");
            li.className= "list-container";
            li.className = "mdl-list__item mdl-list__item--two-line";

            //Create Divs to put in List item
            var checkBoxCont = document.createElement("div");
            checkBoxCont.className = "mdl-list__item mdl-list__item--two-line checkbox list-item";
            li.appendChild(checkBoxCont);

            var dataCont = document.createElement("div");
            dataCont.className = "mdl-list__item mdl-list__item--two-line survey-data list-item " +
                "mdl-list__item-primary-content";
            li.appendChild(dataCont);

            var checkbox = document.createElement("label");
            checkbox.className = "checkCont surveyList-checkbox";//"checkCont mdl-checkbox mdl-js-checkbox surveyList-checkbox"; Safe to delete?
            checkbox.id = surveys[i].id;

            var input = document.createElement("input");
            input.className = "mdl-checkbox__input";
            input.setAttribute("type", "checkbox");
            input.id = surveys[i].id;

            var checkmark = document.createElement("span");
            checkmark.className = "checkmark";

            checkbox.appendChild(input);
            checkbox.appendChild(checkmark);
            checkBoxCont.appendChild(checkbox);

            //Make Data Portion
            var name = document.createElement("span");
            name.appendChild(document.createTextNode((surveys[i].__beach ? surveys[i].__beach : 'Unknown Beach')));
            dataCont.appendChild(name);

            var info = document.createElement("span");
            info.className = "mdl-list__item-sub-title";
            info.appendChild(document.createTextNode(getDateFormatted(new Date(surveys[i].date)) + " - Site: " +
                                                                    (surveys[i].__site ? surveys[i].__site : 'Unknown')));
            dataCont.appendChild(info);

            //Make Anchor/Link
            var anchor = document.createElement("a");
            anchor.id = surveys[i].id;
            anchor.className = "mdl-list__item-secondary-action";
            dataCont.appendChild(anchor);

            //when survey is selected, open first page of form
            dataCont.onclick = (function () {
                var id = surveys[i].id;
                return function () {
                    setTimeout(function () {
                        clearAllFields();
                        loadSurvey(id);
                        toPage(0,false);
                        $('#page-questions').css('display', 'block');
                    }, 10);
                }
            })();

            //Hover Effect
            $(dataCont).hover(function () {
                $(this).css("background-color", "#e4e4e4");
            }, function () {
                $(this).css("background-color", "transparent");
            });

            //Ternary Op? Thanks Obama...
            surveys[i].submitted ? uploadedList.appendChild(li) : localList.appendChild(li);
        }
    });
}

/**
 * Uploads all selected submitted surveys from the home page
 *
 * @author Heckel
 * @author Baldwin
 */
function uploadSelected() {
    var selected = $(".mdl-checkbox__input:checked"); // Determines if survey is marked for upload
    var surveys = []; // collection of all surveys to be uploaded
    var promises = []; // each callback is going to promise to return, used to prevent async uploading

    // check if any surveys selected
    if (selected.length == 0) {
        alert("No Surveys Selected");
        return;
    }

    // for each survey marked for upload ...
    for (var i = 0; i < selected.length; i++) {
        var deferred = new $.Deferred();

        promises.push(deferred); // Add this to the list of pending callbacks

        // Retrieve survey from localforage and add it to surveys to be uploaded
        Surveys.getById(selected[i].parentElement.id, deferred, function(survey) {
            surveys.push(survey);
        });
    }

    // Once all promises have resolved, upload the surveys to the server
    Promise.all(promises).then(function() {
        window.survey_post.upload(surveys)
    });
}

/**
 *  Builds a CSV for an individual survey
 *
 *  @author Heckel (edited 02/17/2018)
 */
function downloadCSV() {
    // Gets current survey from localforage
    Surveys.getById(surveyId, null, function() {
        var data = getAllFields();  // get survey information
        var colDelim = '","';       // delimiter for csv format
        var rowDelim = '"\r\n"';    // delimiter for csv format

        // generates rows and columns of csv from survey data
        var csv = '"';
        for (var key in data) {
            // setup first row (field names)
            if (data.hasOwnProperty(key)) {
                csv += key;
                csv += colDelim;
            }
        }
        csv += rowDelim;

        // setup second row (field values)
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                csv += data[key];
                csv += colDelim;
            }
        }
        csv += '"';

        // generates file data for csv
        var csvData = 'data:application/csv;charset=utf-8,' + encodeURI(csv);
        nameOfFile = data["__beach"] + "," + data["__site"] + ',' + data['date'] + '.csv';
        var link = document.createElement("a");
        link.setAttribute("href", csvData);
        link.setAttribute("download", nameOfFile);
        document.body.appendChild(link);
        link.click();
    });
}

/**
 * Builds a CSV for a collection of surveys
 *
 * @author Heckel (created 02/17/2018)
 */
function downloadSelected() {
    var selected = $(".mdl-checkbox__input:checked"); // Determines if survey is marked for upload
    var surveys = []; // collection of all surveys to be compiled on CSV
    var promises = []; // each callback is going to promise to return, used to prevent async CSV building

    // check if any surveys selected
    if (selected.length == 0) {
        alert("No Surveys Selected");
        return;
    }

    // for each survey marked for download ...
    for (var i = 0; i < selected.length; i += 1) {
        var deferred = new $.Deferred();

        promises.push(deferred); // Add this to the list of pending callbacks

        // Retrieve survey from localforage and add it to surveys to be downloaded
        Surveys.getById(selected[i].parentElement.id, deferred, function(survey) {
            surveys.push(survey);
        });
    }

    // Once all promises have resolved, construct CSV of all marked surveys
    Promise.all(promises).then(function() {
        // build CSV
        var csv = "";
        var colDelim = '","';       // delimiter for csv format
        var rowDelim = '"\r\n"';    // delimiter for csv format
        var data = null;

        for (var i = 0; i < surveys.length; i += 1) {
            data = (surveys[i]); // get survey information

            // setup first row (field names)
            if(i == 0) {
                // generate columns for csv from survey fields
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        csv += key;
                        csv += colDelim;
                    }
                }
            }
            csv += rowDelim;

            // setup second row (field values)
            for (var key in data) {
                // generate rows for csv from survey data
                if (data.hasOwnProperty(key)) {
                    csv += data[key];
                    csv += colDelim;
                }
            }
        }
        csv += '"';

        // generates file data for csv
        var csvData = 'data:application/csv;charset=utf-8,' + encodeURI(csv);
        var nameOfFile = (new Date()) + '.csv';
        var link = document.createElement("a");
        link.setAttribute("href", csvData);
        link.setAttribute("download", nameOfFile);
        document.body.appendChild(link);
        link.click();
    });
}

/**
 *  Removes survey from webapp and localforage
 */
function deleteSurvey() {
    var btn = $('#btn-delete');

    // change delete button in response to click
    if (deleteTimer == 0) {
        // on first click: make red and start countdown timer
        btn.addClass('mdl-color--red-A700').addClass('mdl-color-text--white');
        deleteTimer = 5;
        btn.html('Really? (' + deleteTimer + ')');
        window.cancelDelete = false;
        setTimeout(deleteCountdown, 1000);
    } else {
        // on second click: delete survey and reset delete button to default
        var snackbarContainer = document.querySelector('#toast-container');
        var data = {
            message: 'Deleting survey...',
            actionHandler: function() { window.cancelDelete = true; },
            actionText: 'Undo'
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
        setTimeout(function() {
            if (!window.cancelDelete) {
                sId = surveyId;
                surveyId = undefined;

                // remove survey from localforage
                toPage('home',true); // This prevents Survey.remove() from failing on blank surveys
                Surveys.remove(sId, function () {
                    toPage('home',true); // go to homepage
                });

                // reset delete button
                btn.html('Delete');
                btn.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
                deleteTimer = 0;
            }
        }, 3000);

        // reset delete button after countdown expires
        btn.html('Delete');
        btn.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
    }
}

/**
 * Deletes multiple surveys from localforage by calling 'deleteSurvey()'
 *
 * @author Heckel
 */
function deleteSelected() {
    var selected = $(".mdl-checkbox__input:checked"); // Determines if survey is marked for deletion
    var surveys = []; // collection of all surveys to be deleted
    var promises = []; // each callback is going to promise to return, used to prevent asynch deleting

    // check if any surveys selected
    if (selected.length == 0) {
        alert("No Surveys Selected");
        return;
    }

    var btn = $('#del-surveys-btn');
    if (deleteTimer == 0) { // on first button press
        // change button style
        btn.addClass('mdl-color--red-A700').addClass('mdl-color-text--white');
        deleteTimer = 5;
        btn.html('Really? (' + deleteTimer + ')');
        window.cancelDelete = false;

        // start countdown
        setTimeout(deleteCountdown, 1000);
    } else { // on second button press
        // ready toast
        var snackbarContainer = document.querySelector('#toast-container');
        var data = {
            message: 'Deleting survey...',
            actionHandler: function() { window.cancelDelete = true; },
            actionText: 'Undo'
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);

        // start deletion
        setTimeout(function() {
            if (!window.cancelDelete) {

                // Due to the asynchronous nature of the localforage functions, removing the surveys must be done sequentially
                // As such, we have opted to use a recursive loop as opposed to a normal for-loop so that we can control the
                // pace of its execution
                var i = 0;
                var loopArray = function() {
                    Surveys.remove(selected[i].parentElement.id, function() {
                        i += 1;

                        // If there are more surveys to remove, continuing removing them
                        if (i < selected.length) {
                            loopArray();
                        }
                        // Otherwise (i.e. last survey removed) navigate back to the home page
                        else {
                            toPage('home', false);
                        }
                    });
                };

                loopArray();
            }
        }, 3000);

        // change button back to normal
        btn.html('Delete');
        btn.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
        deleteTimer = 0;
    }
}

/**
 * Completes the survey by compiling comments sections
 * returns to homepage
 */
function submit(){
    saveSurvey(totalQuestionPages);
    // concatComments();
    toPage('home',false);
}