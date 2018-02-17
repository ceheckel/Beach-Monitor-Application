/**
 * List of all methods that modify the survey related fields
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
function newSurvey(){
    // Clears all fields
    clearAllFields();

    // Generate new Global Unique ID and date
    surveyId = guid();
    surveyDate = new Date();
    $('#DATE_ENTERED').val(dateToLocalDate(surveyDate, true));
    submitted = false;
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
 *
 *
 * @param page
 * @param toast
 */
function saveSurvey(page, toast) {
    if (typeof(surveyId) === 'undefined' || curPage == 'home') {
        completePage(page);
        // if on first survey page
        // check required field
        // call it good

        return;
    }

    // set last modified date
    $('#DATE_UPDATED').val(dateToLocalDate(new Date()));
    $('#MISSING_REQUIRED_FLAG').val(('' + !completedSurvey).toUpperCase());
    data = getAllFields();
    data.id = surveyId;
    data.date = surveyDate;
    survey = new Survey(surveyId, data);
    survey.save(function() {
        completePage(page);
    });
    if (toast || toast === undefined) showSaveToast();
}

/**
 *
 * @param id
 */
function loadSurvey(id) {
    surveyId = id;
    Surveys.getById(id, null, function(survey) {
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
            }
        });
        fillCounties();
        fillLakes();
        fillBeaches();
        fillSites();
        updateSeq('#__beach', '#beachList', '#BEACH_SEQ');
        updateSeq('#__site', '#monitorList', '#MONITOR_SITE_SEQ');
        surveyDate = new Date(survey['date']);
        visitedPages = survey['vPages'];
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
 *
 */
function getSurveys() {
    // create two lists for surveys
    var unsubmittedList = document.getElementById("unsubmitted-reports");
    var submittedList = document.getElementById("submitted-reports");


    // Remove all elements from unsubmitted reports list
    while (unsubmittedList.firstChild)
        unsubmittedList.removeChild(unsubmittedList.firstChild);

    // Create header for unsubmitted reports
    var header = document.createElement("li");
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
    header.className = "mdl-list__item";
    span1.className = "mdl-list__item-primary-content";
    span2.className = "mdl-typography--font-bold";
    span2.appendChild(document.createTextNode("Unsubmitted Reports"));
    header.appendChild(span1);
    span1.appendChild(span2);
    unsubmittedList.appendChild(header);


    // Remove all elements from submitted reports list
    while (submittedList.firstChild)
        submittedList.removeChild(submittedList.firstChild);

    // Create header for submitted reports
    header = document.createElement("li");
    span1 = document.createElement("span");
    span2 = document.createElement("span");
    header.className = "mdl-list__item";
    span1.className = "mdl-list__item-primary-content";
    span2.className = "mdl-typography--font-bold";
    span2.appendChild(document.createTextNode("Past Reports"));
    header.appendChild(span1);
    span1.appendChild(span2);
    submittedList.appendChild(header);


    // Populate list
    Surveys.getAll(function(surveys) {
        surveys.sort(function(a, b){return new Date(b.date) - new Date(a.date)});

        for (var i = 0; i < surveys.length; i++) {
            // create list item
            var li = document.createElement("li");
            li.className = "mdl-list__item mdl-list__item--two-line";


            // create span for data, item name, item info, and action
            var dataSpan = document.createElement("span");
            dataSpan.className = "mdl-list__item-primary-content";

            var nameSpan = document.createElement("span");

            var infoSpan = document.createElement("span");
            infoSpan.className = "mdl-list__item-sub-title";

            var actionSpan = document.createElement("span");
            actionSpan.className = "mdl-list__item-secondary-content";

            // create checkbox for mass interactions
            var selectionSpan = document.createElement("label");
            selectionSpan.className = "mdl-checkbox mdl-js-checkbox";
            var checkbox = document.createElement("input");
            checkbox.className = "mdl-checkbox__input";
            checkbox.setAttribute("type", "checkbox");
            selectionSpan.id = surveys[i].id;
            selectionSpan.appendChild(checkbox);

            // create link to survey for edit/view
            var action = document.createElement("a");
            action.id = surveys[i].id;
            action.className = "mdl-list__item-secondary-action";

            li.onclick = (function () {
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

            $(li).hover(function () {
                $(this).css("background-color", "#e4e4e4");
            }, function () {
                $(this).css("background-color", "white");
            });
            $(li).css('cursor', 'pointer');
            var icon = document.createElement("i");
            icon.className = "material-icons";

            nameSpan.appendChild(document.createTextNode((surveys[i].__beach ? surveys[i].__beach : 'Unknown Beach')));
            infoSpan.appendChild(document.createTextNode(getDateFormatted(new Date(surveys[i].date)) + " - Site: " + (surveys[i].__site ? surveys[i].__site : 'Unknown')));
            if (!surveys[i].submitted)
                icon.appendChild(document.createTextNode("edit"));
            else
                icon.appendChild(document.createTextNode("visibility"));

            dataSpan.appendChild(nameSpan);
            dataSpan.appendChild(infoSpan);
            action.appendChild(icon);
            actionSpan.appendChild(action);
            //actionSpan.appendChild(selectionSpan);
            li.appendChild(dataSpan);
            li.appendChild(actionSpan);
            if (!surveys[i].submitted) {
                unsubmittedList.appendChild(li);
                unsubmittedList.appendChild(selectionSpan);
            }
            else {
                submittedList.appendChild(li);
                submittedList.appendChild(selectionSpan);
            }
        }
    });
}

/**
 *
 */
function uploadSurveys() {
    var selected = $(".mdl-checkbox__input:checked"); // Determines if survey is marked for upload
    var surveys = []; // collection of all surveys to be uploaded
    var promises = []; // each callback is going to promise to return, used to prevent asynch uploading

    // check if any surveys selected
    if (selected.length == 0) {
        alert("No Surveys Selected");
        return;
    }

    for (var i = 0; i < selected.length; i++) {
        if (selected[i].parentElement.parentElement.id == "unsubmitted-reports") {
            alert("Unsubmitted reports cannot be uploaded to the server.");
            return;
        }
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
 *
 */
function deleteSurvey() {
    console.log("in deleteSurvey()");
    var btn = $('#btn-delete');
    if (deleteTimer == 0) {
        btn.addClass('mdl-color--red-A700').addClass('mdl-color-text--white');
        deleteTimer = 5;
        btn.html('Really? (' + deleteTimer + ')');
        window.cancelDelete = false;
        setTimeout(deleteCountdown, 1000);
    } else {
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
                toPage('home',true);
                Surveys.remove(sId, function () {
                    toPage('home',true);
                });
                btn.html('Delete');
                btn.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
                deleteTimer = 0;
            }
        }, 3000);
        btn.html('Delete');
        btn.removeClass('mdl-color--red-A700').removeClass('mdl-color-text--white');
    }
}

/**
 *
 */
function downloadCSV(){
    // Gets current survey from localforage
    Surveys.getById(surveyId, null, function(myData) {

        // var myData = getAllFields();
        console.log(myData);

        var stuff = myData.toString();
        console.log(stuff.toString());

        //delimeters for csv format
        var colDelim = '","';
        var rowDelim = '"\r\n"';

        // generates rows and columns of csv from survey data
        var csv = '"';
        for (var key in myData) {
            if (myData.hasOwnProperty(key)) {
                csv += key;
                csv += colDelim;
            }
        }
        csv += rowDelim;

        for (var key in myData) {
            if (myData.hasOwnProperty(key)) {
                csv += myData[key];
                csv += colDelim;
            }
        }
        csv += '"';

        // generates file data for csv
        var csvData = 'data:application/csv;charset=utf-8,' + encodeURI(csv);
        nameOfFile = myData["__beach"] + "," + myData["__site"] + ',' + myData['date'] + '.csv';
        var link = document.createElement("a");
        link.setAttribute("href", csvData);
        link.setAttribute("download", nameOfFile);
        document.body.appendChild(link);
        link.click();
    });
}

/**
 *
 */
function downloadSelected() {
    var selected = $(".mdl-checkbox__input:checked"); // Determines if survey is marked for deletion
    var surveys = []; // collection of all surveys to be deleted

    // check if any surveys selected
    if(selected.length == 0) {
        alert("No Surveys Selected");
        return;
    }

    var btn = $('#dl-surveys-btn');
    // Gets current survey from localforage
    for (var i = 0; i < selected.length; i++) {

        // Retrieve survey from localforage and add it to surveys to be uploaded
        Surveys.getById(selected[i].parentElement.id, null, function (myData) {

            // delimiters for csv format
            var colDelim = '","';
            var rowDelim = '"\r\n"';

            // generates rows and columns of csv from survey data
            var csv = '"';
            for (var key in myData) {
                if (myData.hasOwnProperty(key)) {
                    csv += key;
                    csv += colDelim;
                }
            }
            csv += rowDelim;

            for (var key in myData) {
                if (myData.hasOwnProperty(key)) {
                    csv += myData[key];
                    csv += colDelim;
                }
            }
            csv += '"';

            // generates file data for csv
            var csvData = 'data:application/csv;charset=utf-8,' + encodeURI(csv);
            nameOfFile = myData["__beach"] + "," + myData["__site"] + ',' + myData['date'] + '.csv';
            var link = document.createElement("a");
            link.setAttribute("href", csvData);
            link.setAttribute("download", nameOfFile);
            document.body.appendChild(link);
            link.click();
        });
    }
}

/**
 *
 */
function submit(){
    saveSurvey(totalQuestionPages, false);
    console.log("Survey submitted!");//  <-- DOWNLOAD CSV HERE
    downloadCSV();
    submitted = true;
    toPage('home',false);
}

/**
 *
 */
function completionCheck() {
    completePage(curPage);
    if(completedSurvey){
        submit();
    }
    else {
        //var dialog = document.querySelector('dialog');
        //dialog.showModal();

        validatePage(undefined, true);
    }
}