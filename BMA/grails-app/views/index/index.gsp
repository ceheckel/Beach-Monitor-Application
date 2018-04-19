<%@ page import="beaches.LineQuestion; beaches.CheckQuestion; beaches.TextQuestion; beaches.SelectQuestion; beaches.HiddenQuestion; beaches.ButtonElement; beaches.TimeQuestion; beaches.UnitQuestion" %>
<!doctype html>

<html>
<head>
    <meta name="layout" content="main"/>
    <title>WI Beach Health</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <style>
        #upload-modal {
            margin-top: 40px;
        }

        p{
            color: #ffffff;
        }
        /* Place the navbar at the bottom of the page, and make it stick */
        .bottom-nav {
            background-color: rgb(63,81,181);
            overflow: visible;
            position: fixed;
            z-index: 1; /* prevents checkQuestions from being visible through bottom Navbar */
            bottom: 0;
            width: 100%;
        }

        .mdl-textfield { display: block; }
        .mdl-selectfield { display: block; }

        /* Beginning of highlighting */
        .mdl-textfield__input.required {
            background-color: rgba(255,0,0,0.20);
        }
        .mdl-textfield__input.recommended {
            background-color: rgba(0,255,0,0.20);
        }
        .mdl-selectfield__select.required {
            background-color: rgba(255,0,0,0.20);
        }
        .mdl-selectfield__select.recommended {
            background-color: rgba(0,255,0,0.20);
        }
        /* end of highlighting */

        /* bottom nav-bar styling */
        @media (min-width: 0px) and (max-width: 579px) {
            .bottom-nav-icon {
                display: block;
            }
            .bottom-nav-icon-item {
                display: none;
            }
        }
        @media (min-width: 580px) {
            .bottom-nav-icon {
                display: block;
            }

            .bottom-nav-icon-item {
                display: none;
            }
        }
        /* end bottom nav-bar styling */

        /* Restyled page code */
        /* for highlighting required and recommended fields */
        .mdl-textfield{
            color: #ffffff;
        }

        .mdl-selectfield{
            color: #ffffff;
        }

        .mdl-textfield__label{
            color: #ffffff;
        }

        .mdl-selectfield__label{
            color: #ffffff;
        }

        .mdl-textfield__label:after{
            background-color: #ffffff !important;
        }

        .mdl-selectfield--floating-label.is-focused .mdl-selectfield__label,.mdl-selectfield--floating-label.is-dirty .mdl-selectfield__label{
            color: #ffffff;
        }

        .mdl-textfield--floating-label.is-focused .mdl-textfield__label,.mdl-textfield--floating-label.is-dirty .mdl-textfield__label{
            color: #ffffff;
        }

        .mdl-checkbox__label{
            color: #ffffff;
        }
        .surveyList-checkbox{
            width: 3em;
        }

        .button-question {
            margin: 10px;
        }

        .checkbox-question {
            margin: 10px;
        }

        .mdl-selectfield__label:after{
            background-color: #ffffff !important;
        }

        .mdl-list__item{
            background-color: #a4b0c4;
        }

        .mdl-list__item-primary-content{
            height: 72px;
            padding: 0%;
            margin: 0%;
            border-width: 0px;
        }

        .list-container{
            height: 72px;
            width: 100%;
            margin-left: 0em;
            display: table;
        }

        .list-item{
            display: table-cell;
            width: 100%;
            margin-left: 0em;
        }

        .checkbox{
            width: 3em;
            left: 0px;
            margin: 0%;
        }

        .actionIcon{
            width: 3em;
            right: 0px;
        }

        .survey-data{
            right: 0px;
        }

        /************************************************************************************************************/
        .checkCont {
            display: block;
            position: relative;
            padding-left: 35px;
            margin-bottom: 12px;
            cursor: pointer;
            font-size: 22px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        /* Hide the browser's default checkbox */
        .checkCont input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
        }

        /* Create a custom checkbox */
        .checkmark {
            position: absolute;
            top: 0;
            left: 0;
            height: 25px;
            width: 25px;
            background-color: #a4b0c4;
            border: solid #3f51b5;
        }

        /* On mouse-over, add a grey background color */
        .checkCont:hover input ~ .checkmark {
            background-color: #a4b0c4;
        }

        option{
            color: black;
        }

        .checkCont:hover{
            background-color: #fff;
        }

        /* When the checkbox is checked, add a blue background */
        .checkCont input:checked ~ .checkmark {
            background-color: #3f51b5;
        }

        /* Create the checkmark/indicator (hidden when not checked) */
        .checkmark:after {
            content: "";
            position: absolute;
            display: none;
        }

        /* Show the checkmark when checked */
        .checkCont input:checked ~ .checkmark:after {
            display: block;
        }

        /* Style the checkmark/indicator */
        .checkCont .checkmark:after {
            left: 7px;
            top: 3px;
            width: 5px;
            height: 10px;
            border: solid #a4b0c4;
            border-width: 0 3px 3px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
        }
        /**************************************************************************************************************/


        mdl-list__item--two-line{
            background-color: #a4b0c4;
        }

        #SAMPLE_DATE_TIME_DISPLAYED{
            color: #ffffff;
        }
        body {
            background-color: #a4b0c4;
        }
    </style>
</head>

<body>
<!-- Home page -->
<div class="page-content" data-page="home" data-page-title="WI Beaches">

    <!-- Local Reports Section -->
    <ul class="mdl-list" id="local-reports">
        <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
                <span class="mdl-typography--font-bold">Unsubmitted Reports</span>
            </span>
        </li>
    </ul>

    <!-- Uploaded Reports Section -->
    <ul class="mdl-list" id="uploaded-reports">
        <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
                <span class="mdl-typography--font-bold">Uploaded Reports</span>
            </span>
        </li>
    </ul>

    <!-- Bottom Navbar for Home page -->
    <div class="bottom-nav">

        <!-- Upload Surveys Button -->
        <button id="post-surveys-btn" class="mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect bottom-nav-button" data-toggle="modal" data-target="#upload-modal" style="background-color: rgb(68,138,255); color: rgb(255,255,255); margin-right: 15px;">
            <div class="bottom-nav-icon"><i class="material-icons">file_upload</i></div>
            <div class="bottom-nav-icon-item"><i class="material-icons">file_upload</i>&nbsp;Upload</div>
        </button>

        <!-- Download Surveys Button -->
        <button id="dl-surveys-btn" class="mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect bottom-nav-button" onclick="downloadSelected()" style="background-color: rgb(68,138,255); color: rgb(255,255,255);">
            <div class="bottom-nav-icon"><i class="material-icons">file_download</i></div>
            <div class="bottom-nav-icon-item"><i class="material-icons">file_download</i>&nbsp;Download</div>
        </button>

        <!-- Delete Surveys Button -->
        <button id="del-surveys-btn" class="mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect bottom-nav-button" onclick="deleteSelected()" style="background-color: rgb(68,138,255); color: rgb(255,255,255);">
            <div class="bottom-nav-icon"><i class="material-icons">delete</i></div>
            <div class="bottom-nav-icon-item"><i class="material-icons">delete</i>&nbsp;Delete</div>
        </button>

        <!-- Used as Spacing -->
        <div class="bottom-nav-flex" style="flex:1"></div>

        <!-- Create new Survey Button -->
        <button id="btn-new-survey" class="mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect bottom-nav-button" onclick="newSurvey()" style="background-color: rgb(68,138,255); color: rgb(255,255,255);">
            <div class="bottom-nav-icon"><i class="material-icons">create</i></div>
            <div class="bottom-nav-icon-item"><i class="material-icons">create</i>&nbsp;New Survey</div>
        </button>
    </div>
</div>

<!-- help page link -->
<div class="help-page" id="help-page" data-page="help" style="display: none">
    <a name="HomePageNav"><h1 style="color:rgb(63,81,181);padding:0px 0px 0px 10px;">Home Page</h1></a>
	<p style="padding:0px 0px 0px 10px;">The home page is broken down into four major sections:</p>
	<ol>
		<a name="UpNavBar" style="color:rgb(63,81,181);"><li> Upper Navigation Bar</li></a>
		<p>On the top left-hand side of the home page, there is a 'hamburger' button, displayed as three equal length<br/>horizontal bars.  This button can be clicked on to open a sidebar navigation menu that displays three additional<br/>options: the "Home Page" (which is currently displayed), the "<a href="#Survey Creation">New Survey</a>" (which will initiate the creation of <br/>a new survey), and the "Need Help?" option (which brings you to the help page).</p><a name="LocalRep" style="color:rgb(63,81,181);"><li>Local Reports</li></a>
        <p>This section contains all surveys that have not yet been uploaded.  These surveys may be incomplete, ready to <br/>download, or previously downloaded.  Surveys in this section are editable by clicking on the name of an existing <br/>survey.</p>
		<a name="UploadedRep" style="color:rgb(63,81,181);"><li>Uploaded Reports</li></a>
		<p>Surveys within this section have been previously uploaded.  Surveys within this section are not editable, but may<br/>be opened and viewed in the same manner as 'local surveys'.  You can determine if the currently viewed survey is <br/>editable by referring to the navigation bar at the top of the screen.  On the right side of the page name within <br/>this bar, there will be "(read-only)".  If this is not visible, the survey has not been uploaded and you may still <br/>edit it.</p>
		<a name="LowNavBar" style="color:rgb(63,81,181);"><li>Lower Navigation Bar</li></a>
		<p>Across the bottom of the home page, you should see another navigation bar, this bar contains a button on the <br/>right, "New Survey", and several buttons on the left: "Upload Report(s)", "Download Survey(s)", and <br/>"Delete Survey(s)". The right-hand button is an alternate way to start a new survey. The "Upload Report(s)" <br/>button allows the user to post their surveys to the database.</p>
		<p>The three buttons on the left of the bar are known as "Mass Interaction" buttons.  In order to use these buttons,<br/>you must first select one or more surveys from the list above by clicking the box to the left of the survey name.</p>
	</ol>

    <!-- Upon new survey creation -->
    <a name="Survey Creation" style="color:rgb(63,81,181);"><h1 style="padding:0px 0px 0px 10px;">Survey Creation</h1></a>
    <p style="padding:0px 0px 0px 10px;">For "<i>how to create a new survey</i>" refer to above sections, '<a href="#LowNavBar">Lower Navigation Bar</a>' or '<a href="#UpNavBar">Upper Navigation Bar</a>'.<br/>Note that the survey is saved before each page opens.</p>
	
    <ol type="I">
        <!-- Section I -->
        <li style="color:rgb(63,81,181);">Menu and Navigation</li>
        <p>Please note that the navigation bar's drawer now has new features.  After a new survey has been initiated, the<br/>menu will now contain not only the home page, but also links to each page of the survey.  Each page will be<br/>described below.  Please note that two to three buttons can now be found on the bottom navigation bar <br/>(depending on which page you are currently viewing) in place of the mass interaction buttons.  These are page<br/>buttons for easy transitions between the next portion of the survey and the previous.  The third button, located in<br/>the center of the bottom navigation bar is for deleting the current survey.  For more information on deleting see<br/><a href="#Survey Deletion">Survey Deletion</a> below.</p>
        <!-- Section II -->
		<li style="color:rgb(63,81,181);">Beach Selection</li>
		<p>After creating a new survey, you will be brought to the first page of the survey creation, "Beach Selection".<br/>On this page, you will first be prompted to input your name and user id. <b>Although these are not required and<br/>may be omitted, it is recommended that a user id be provided if applicable.</b> Next the user will be able to <br/>input the county name from a drop-down menu, lake name based on the county you selected, beach name based <br/>on the lake selected, and monitoring site.  <b>The beach name and monitoring site are required fields.</b><br/>After specifying a site, you can denote it as a "Composite sample", and/or mark the site as a favorite.  <br/>Once you have a site marked as favorite, you can select it in future surveys from the 'Favorites' drop-down menu <br/>(first field on Beach Selection page) and the data will be auto-filled.  The last field on this page allows you to<br/>input a time of collection (either automatically or manually).  An example time is provided for format if a manual<br/>input is made.  Information can be adjusted after insertion by selecting a portion of the date/time and typing new<br/>data, or using the provided up/down arrows on the right side of the field.  <b>The time-of-survey is required for<br/>completion.</b>  Please note that from this point on, there are no <b><i>required</i></b> field, but some fields are still<br/>recommended and will be denoted with an asterisk * and highlighted for easy visibility.</p>
        <!-- Section III -->
		<li style="color:rgb(63,81,181);">Animals</li>
		<p>This page refers to the number of <i>living</i> animals on the beach at the time of the survey.  Fields are specified for<br/>seagulls, geese, dogs, and other wildlife, as well as a field for additional comments.  For dead animals, see next <br/>heading (Section IV).</p>
        <!-- Section IV -->
        <li style="color:rgb(63,81,181);">Deceased Animals</li>
        <p>This page refers to the number of <i>dead</i> animals on the beach or within the vicinity, specific fields are provided<br/>for Loons, Herring Gulls, Ring Gulls, Cormorants, Long-tail Ducks, Scoters, Horned Grebes, Rednecked <br/>Grebes, Fish, and other birds, as well as a field for additional comments.</p>
        <!-- Section V -->
        <a name="DinW" style="color:rgb(63,81,181);"><li>Debris in Water</li></a>
        <p>The debris page contains a list of possible foreign objects that can be <b>found in the water</b>, <i>not on the beach</i>.<br/>To mark an objects' presence, simply click the box(es) to the left of each debris type.  If the 'other' box is<br/>checked, a field will appear that will allow you to input the type of debris found.  If 'other' is selected, <b>the<br/>description is required.</b><br/>Please note that any number of boxes may be checked.<br/></p>
        <!-- Section VI -->
        <li style="color:rgb(63,81,181);">Debris on Beach</li>
        <p>This page refers to the possible debris <b>found on the beach</b>, <i>not in the water.</i>  See <a href="#DinW">previous section</a> (Section V)<br/>for functionality.  Also on this page is a field that allows you to input a rough percentage of beach covered in<br/>debris. The drop-down menu has options for "0%", "1-20%", "21-50%", and ">50%".<br/></p>
        <!-- Section VII -->
        <li style="color:rgb(63,81,181);">Bathers</li>
        <p>The bathers page provides input fields for people in water, out of the water, boating, fishing, surfing, diving,<br/>clamming, and other activities, as well as a field for additional comments.</p>
        <!-- Section VIII -->
        <li style="color:rgb(63,81,181);">Weather</li>
        <p>On this page, fields are provided for air temperature (<sup>o</sup>F or <sup>o</sup>C), Wind speed (MPH), wind direction (degrees),<br/>wind direction description (cardinal directions: N, NE, E, SE, etc.) weather conditions (sunny, cloudy, etc.),<br/>hours since last rain, and rainfall amount (rainfall can be measured in either inches, or centimeters).<br/>Drop-down menus are provided for both unit selections, 'wind direction description', 'weather conditions', and<br/>'hours since last rain event'.  'Weather condition' is a recommended field.</p>
        <!-- Section IX -->
        <li style="color:rgb(63,81,181);">Waves</li>
        <p>On this page, Wave height can be described, and includes a check-box to represent an estimated measurement.<br/>'Wave direction' (cardinal directions: N, NE, E, SE, etc.), and 'wave conditions' have drop-down menus, as well<br/>as 'long-shore current direction' (also measured with cardinal directions).  Included on this page is a field for<br/>Long-shore current speed (measured in ft/sec or cm/sec), as well as a field for additional comments.<br/>Wave height is a recommended field.<br/></p>
        <!-- Section X -->
        <li style="color:rgb(63,81,181);">Water Conditions</li>
        <p>This page is used to input information about the pH levels of the water and provides a check-box to indicate the<br/>color has changed.  Odor can be described, and a drop-down menu is provided for this field.  'Water temperature'<br/>can be input in terms of '<sup>o</sup>F' or '<sup>o</sup>C'.  The Haziness of water can be defined as one of the drop-down options from<br/>the 'Turbidity' field.  Alternatively, Nephelometric Turbidity Units, or NTUs, can be supplied in the proceeding<br/>field.  Common measurements are 5, 50, or 500 NTUs.  The final fields provided are for secchi tube readings and<br/>additional comments.<br/>Recommended fields include 'Water Temperature' and either 'Turbidity' or 'NTU'.<br/></p>
        <!-- Section XI -->
        <li style="color:rgb(63,81,181);">Algae</li>
        <p>On this page, there are two fields for percentage of algae present (on beach, and near shore).  Both of these fields<br/>are recommended and have drop-down menus with values for 0%, 1-20%, 21-50% and >50%.  Also found on <br/>this page are check-boxes for type of algae, and color of algae, as well as a field for additional comments.<br/>Note that both sets of check-boxes have an 'other' option that, when selected, display an description field.  <b>If the<br/>'other' box is checked, the description is required for completion.</b><br/></p>		<!-- Section XII -->
        <li style="color:rgb(63,81,181);">Review</li>
        <p>When creating a new survey, this page allows you to review and adjust any of the previously mentioned data<br/> fields.  If the user has not filled out all of the required information fields, then clicking the "complete" button will<br/>prompt the user with a warning.  After the Survey is completed, it will remain in the "<a href="#LocalRep">Local Reports</a>" section of<br/>the home page.  See Sections II and III for more on local reports or uploaded reports.</p>
    </ol>
	
	<!-- Survey Deletion -->
	<a name="Survey Deletion" style="color:rgb(63,81,181);"><h1 style="padding:0px 0px 0px 10px;">Survey Deletion</h1></a>
	<p style="padding:0px 0px 0px 10px;">At the bottom of the page, in the center, there will be a 'Delete' button, upon the first press, you will be prompted to<br/>confirm the deletion.  Press the button again to confirm.  If confirmation is not received within five seconds of the<br/>first press, the survey will not be removed.  If confirmation <b>is</b> received in the allocated time, a pop-up with cover the<br/>button that reads, "Deleting Survey... ".  On this pop-up, there is an undo option, but will vanish quickly.  When the<br/>pop-up vanishes, the application will return to the home page and the survey will be removed.</p>
</div>

<!-- Questions -->
<div class="page-content" id="page-questions" style="display: none">
    <g:each status="i" var="p" in="${survey}">
        <div data-page-title="${p.pageName}" data-page="${i}" class="page">
            <g:each var="q" in="${p.questions}">
                <g:if test="${q instanceof LineQuestion}">
                    <br>
                    <hr>
                </g:if>

                <!-- For Questions with Flexible Units -->
                <g:if test="${q instanceof UnitQuestion}">
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width:218px;display:inline-block;">
                        <input list="${q.list}" class="mdl-textfield__input ${q.extraClasses}" type="${q.type}" pattern="${q.pattern}" step="${q.step}" name="${q.columnId}" id="${q.columnId}" onblur="checkDirtyNumber()" onchange="${q.onchange}" oninput="${q.oninput}" style="display:inline-block;" maxlength="${q.maxlength}">
                        <label class="mdl-textfield__label" for="${q.columnId}" style="display:inline-block;">${q.prompt}</label>
                        <span class = "mdl-textfield__error" style="display:inline-block;">${q.errorm}</span>
                    </div>
                    <div class="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label" style="width:80px;display:inline-block;">
                        <select name="${q.columnId2}" id="${q.columnId2}" class="mdl-selectfield__select ${q.extraClasses}" onchange="${q.onchange}" style="display:inline-block;">
                            <g:each var="o" in="${q.options}">
                                <option value="${o}">${o}</option>
                            </g:each>
                        </select>
                        <div class="mdl-selectfield__icon"><i class="material-icons" style="display:inline-block;">arrow_drop_down</i></div>
                        <label class="mdl-selectfield__label" for="${q.columnId}" style="display:inline-block;">${q.title}</label>
                    </div>
                </g:if>

                <!-- For Text Questions -->
                <g:if test="${q instanceof TextQuestion}">
                    <!-- "number" case no longer affects any fields; possibly safe to remove -->
                    <g:if test="${q.type == "number"}">
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input list="${q.list}" class="mdl-textfield__input ${q.extraClasses}" type="${q.type}" pattern="${q.pattern}" step="${q.step}" name="${q.columnId}" id="${q.columnId}" onblur="checkDirtyNumber()" onchange="${q.onchange}" oninput="${q.oninput}" maxlength="${q.maxlength}">
                            <label class="mdl-textfield__label" for="${q.columnId}">${q.prompt}</label>
                        </div>
                    </g:if>

                    <g:else>
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input list="${q.list}" class="mdl-textfield__input ${q.extraClasses}" type="${q.type}" pattern="${q.pattern}" step="${q.step}" name="${q.columnId}" id="${q.columnId}" onchange="${q.onchange}" oninput="${q.oninput}" maxlength="${q.maxlength}">
                            <label class="mdl-textfield__label" for="${q.columnId}">${q.prompt}</label>
                            <span class = "mdl-textfield__error">${q.errorm}</span>
                        </div>
                    </g:else>
                    <g:if test="${q.list != ''}">
                        <datalist id="${q.list}"></datalist>
                    </g:if>
                </g:if>

                <!-- For Checkbox Questions -->
                <g:if test="${q instanceof CheckQuestion}">
                    <g:if test="${q.hasTitle}">
                    </g:if>
                    <g:if test="${q.radio}">
                        <g:if test="${q.inline}">
                            <div>
                        </g:if>
                        <g:each status="n" var="c" in="${q.prompts}">
                            <g:if test="${!q.inline}">
                                <div>
                            </g:if>
                            <label ${q.inline ? 'style="padding-left:8px;"' : ''} class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="${q.columnId + '-' + n}">
                                <input type="radio" id="${q.columnId + '-' + n}" class="mdl-radio__button" name="${q.columnId}" value="n"${c.second ? ' checked' : ''}>
                                <span class="mdl-radio__label">${c.first}</span>
                            </label>
                            <g:if test="${!q.inline}">
                                </div>
                            </g:if>
                        </g:each>
                        <g:if test="${q.inline}">
                            </div>
                        </g:if>
                    </g:if>
                    <g:else>
                        <g:each var="c" in="${q.prompts}">
                            <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect checkbox-question" for="${q.columnId}">
                                <input type="checkbox" name="${q.columnId}" id="${q.columnId}" class="mdl-checkbox__input"${c.second ? ' checked' : ''} onclick="${q.onclick}">
                                <span class="mdl-checkbox__label">${c.first}</span>
                            </label>
                            <g:if test="${!q.inline}">

                            </g:if>
                        </g:each>
                    </g:else>
                </g:if>

                <!-- For Select Questions -->
                <g:if test="${q instanceof SelectQuestion}">
                %{-- not using g:select because it's easier to create mdl components by hand --}%
                    <div class="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label">
                        <select name="${q.columnId}" id="${q.columnId}" class="mdl-selectfield__select ${q.extraClasses}" onchange="${q.onchange}">
                            <g:each var="o" in="${q.options}">
                                <option value="${o}">${o}</option>
                            </g:each>
                        </select>
                        <div class="mdl-selectfield__icon"><i class="material-icons">arrow_drop_down</i></div>
                            <label class="mdl-selectfield__label" for="${q.columnId}">${q.title}</label>
                    </div>
                </g:if>

                <!-- For Hidden Questions -->
                <g:if test ="${q instanceof HiddenQuestion}">
                    <input class="mdl-textfield__input" type="hidden" value="${q.value}" name="${q.columnId}" id="${q.columnId}" data-keep="${q.keep}">
                </g:if>

                <!-- For Button Questions -->
                <g:if test="${q instanceof ButtonElement}">
                    <button class="mdl-button mdl-js-button mdl-button--raised button-question ${q.accent ? 'mdl-button--accent' : ''}" id="${q.columnId}" onclick="${q.onclick}" ${q.disabled ? 'disabled=""' : ''}>${q.value}</button>
                    <g:if test="${q.columnId == "__remFavorite"}"><br/><br/></g:if>
                </g:if>

                <!-- For Time Questions -->
                <g:if test="${q instanceof TimeQuestion}">
                    <!-- if-then tags for highlighting, Can most definitely be cleaned up.  Scripting? CSS? -->
                    <g:if test="${q.extraClasses == "required"}">
                        <input type="datetime-local" name="${q.columnId}" id="${q.columnId}" style="background-color: rgba(255,0,0,0.20)">
                    </g:if>
                    <g:elseif test="${q.extraClasses == "recommended"}">
                        <input type="datetime-local" name="${q.columnId}" id="${q.columnId}" style="background-color: rgba(0,255,0,0.20)">
                    </g:elseif>
                    <g:else>
                        <input type="datetime-local" name="${q.columnId}" id="${q.columnId}">
                    </g:else>
                </g:if>
            </g:each>
        </div>
    </g:each>

    <!-- Bottom Navbar -->
    <div class="bottom-nav" id="bottom-nav">
        <button class="mdl-button mdl-js-button mdl-button--raised" id="btn-prev" onclick="btnPrev()" style="color:white; background-color:rgba(68,138,255,1); display:none">Previous</button>
        <div style="flex-grow: 1"></div>
        <button id="btn-delete" class="mdl-button mdl-js-button mdl-button--raised" onclick="deleteSurvey()" style="color:white; background-color:rgba(68,138,255,1);">Delete</button>
        <div style="flex-grow:1"></div>
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" id="btn-next" onclick="btnNext()">Next</button>
    </div>
</div>

<!-- Toast pop-up -->
<div id="toast-container" class="mdl-js-snackbar mdl-snackbar">
    <div class="mdl-snackbar__text"></div>
    <button class="mdl-snackbar__action" type="button"></button>
</div>

<!-- Upload Surveys Login Modal -->
<div class="modal fade" id="upload-modal" data-backdrop="false">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Please enter username and password</h5>
            </div>
            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <label for="username-field">Username</label>
                        <input type="email" class="form-control" id="username-field" placeholder="Please enter username">
                    </div>
                    <div class="form-group">
                        <label for="password-field">Password</label>
                        <input type="password" class="form-control" id="password-field" placeholder="Please enter password">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="cancel" class="btn" data-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary" onclick="uploadSelected()" data-dismiss="modal">Submit</button>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
    var totalQuestionPages = ${survey.size()};
</script>
</body>
</html>
