<!-- AUTHOR: Heckel -->
<!DOCTYPE html>
<html>
	<head>
		<!-- inline css -->
		<style>
		body {
			max-width: 900px;
			text-align: justify;
			margin: auto;
			font-family:"Roboto","Helvetica","Arial",sans-serif;
		}
		h1 {
			background-color: rgb(63,81,181); 
			padding: 15px;
			text-align: center;
			color: rgb(255,255,255);
			box-shadow:0 0 5px gray;
		}
		li {
			color: rgb(63,81,181);
			font-size: 18pt;
		}
		p {
			color: rgb(33,33,33);
		}
		</style>
		
		<title>WiBH Help Page</title>
	</head>

	<body>
		<!-- Home Page Navigations -->
		<h1>Home Page</h1>
		<p>
			The home page is broken down into five major sections:
		</p>
		<ol>
			<li><a name="Navigation Bar">Navigation Bar</a></li>
			<p>
				On the top left-hand side of the home page, there is a 'hamburger' button, displayed as three equal length horizontal bars.  This button can be clicked on to display two additional options: the "Home Page" (which is currently displayed) and the "<a href="#Survey Creation">New Survey</a>" option which will initiate the creation of a new survey.
			</p>
			<li><a name="UnRep">Unsubmitted Reports</a></li>
			<p>
				This section contains all surveys that have not yet been downloaded.  These surveys may be incomplete or ready to download.  Surveys in this section are editable by clicking on the name of an existing survey. 
			</p>
			<li><a name="PastRep">Past Reports</a></li>
			<p>
				Surveys within this section have been previously downloaded.  This may include both incomplete and completed surveys.  Surveys within this section are not editable, but may be opened and viewed in the same manner as unsubmitted surveys.  You can determine if the currently viewed survey is editable by referring to the navigation bar at the top of the screen.  On the right side of the page name within this bar, there will be "(read-only)".  If this is not visible, the survey is unsubmitted and you may still edit it. 
			</p>
			<li><a name="Other Buttons">Other Buttons</li>
			<p>
				In the bottom right-hand corner of the home page, you should see a circle with a plus sign in it.  This button is an alternate way to start a new survey.
			</p>
			<li>Deleting Surveys</li>
			<p>
				To delete a survey, open the survey for editing or viewing, navigate to the 'review' page (the last page), and scroll to the bottom.  At the bottom of the page, in the center, there will be a 'Delete' button, upon the first press, you will be prompted to confirm the deletion.  Press the button again to confirm.  If confirmation is not received within five seconds of the first press, the survey will not be removed.  If confirmation is received in the allocated time, a pop-up with cover the button that reads, "Deleting Survey... ".  On this pop-up, there is an undo option, but will vanish quickly.  When the pop-up vanishes, the application will return to the home page and the survey will be removed. 
			</p>
		</ol>
		
		<!-- Upon new survey creation -->
		<h1><a name="Survey Creation">Survey Creation</a></h1>
		<p>
			For "<i>how to create a new survey</i>" refer to above sections, '<a href="#Other Buttons">Other Buttons</a>' or '<a href="#Navigation Bar">Navigation Bar</a>'.<br/>
			Note that the survey is saved after each page opens.
		</p>
		<ol type="I">
			<!-- Section I -->
			<li>Menu and Navigation</li>
			<p>
				Please note that the 'hamburger' button now has new features.  After a new survey has been initiated, the menu will now contain not only the home page, but also links to each page of the survey.  Each page will be described below.  Please note that when all the required fields for a given portion of the survey have been filled, the page selection from the hamburger menu will receive a check mark denoting its completion.<br/>
				Also note that two buttons can now be found after the last field on each page (except to the first page 'Beach Selection' and the last page 'Review').  These are page buttons for easy transitions between the next portion of the survey and the previous.
			</p>
			<!-- Section II -->
			<li>Beach Selection</li>
			<p>
				After creating a new survey, you will be brought to the first page of the survey creation, "Beach Selection".  On this page, you will be able to input the county name from a drop-down menu, lake name based on the county you selected, beach name based on the lake selected, and monitoring site.  <b>These are all required fields.</b>  If the county has only one option, the other fields will be automatically filled in.  After specifying a site, you can denote it as a "Composite sample", and/or mark the site as a favorite.  Once you have a site marked as favorite, you can select it in future surveys from the 'Favorites' drop-down menu (first field on Beach Selection page) and the data will be auto-filled.  A surveyor name can also be supplied, and <b>a user id is required.</b>
			</p>
			<!-- Section III -->
			<li>Animals</li>
			<p>
				This page refers to the number of <i>living</i> animals on the beach at the time of the survey.  Fields are specified for seagulls, geese, dogs, and other wildlife.  <b>All of these fields are required.</b>  For dead animals, see next heading (Section IV).<br/>
				If addtitional comments are desired for this section, see the "<a href="#Comments">Comments</a>" section (Section XIII) below.
			</p>
			<!-- Section IV -->
			<li>Deceased Animals</li>
			<p>
				This page refers to the number of <i>dead</i> animals on the beach or within the vicinity, specific fields are provided for Loons, Herring Gulls, Ring Gulls, Cormorants, Longtail Ducks, Scoters, Horned Grebes, Rednecked Grebes, Fish, and other birds.  <b>All of these fields are required.</b><br/>
				If addtitional comments are desired for this section, see the "<a href="#Comments">Comments</a>" section (Section XIII) below.
			</p>
			<!-- Section V -->
			<li><a name="DinW">Debris in Water</a></li>
			<p>
				The debris page contains a list of possible foreign objects that can be <b>found in the water</b>, <i>not on the beach</i>.  To mark an objects' presence, simply click the box(es) to the left of each debris type.  If the 'other' box is checked, a field will appear that will allow you to input the type of debris found.  If 'other' is selected, <b>the description is required.</b><br/>
				Please note that any number of boxes may be checked.<br/>
				If addtitional comments are desired for this section, see the "<a href="#Comments">Comments</a>" section (Section XIII) below.
			</p>
			<!-- Section VI -->
			<li>Debris on Beach</li>
			<p>
				This page refers to the possible debris <b>found on the beach</b>, <i>not in the water.</i>  See <a href="#DinW">previous section</a> (Section V) for functionality.  Also on this page is a field that allows you to input a rough percentage of beach covered in debris. The drop-down menu has options for "0%", "1-20%", "21-50%", and ">50%".  <b>Percentage is required.</b><br/>
				If addtitional comments are desired for this section, see the "<a href="#Comments">Comments</a>" section (Section XIII) below.
			</p>
			<!-- Section VII -->
			<li>Bathers</li>
			<p>
				The bathers page provides input fields for people in water, out of the water, boating, fishing, surfing, diving, clamming, and other activities.  <b>All of these fields are required.</b><br/>
				If addtitional comments are desired for this section, see the "<a href="#Comments">Comments</a>" section (Section XIII) below.
			</p>
			<!-- Section VIII -->
			<li>Weather</li>
			<p>
				On this page, fields are provided for air temperature (<sup>o</sup>F), Wind speed (MPH), wind direction (degrees), wind direction description (cardinal directions: N, NE, E, SE, etc.) weather conditions (sunny, cloudy, etc.), hours since last rain, and rainfall amount (in inches).  Drop-down menus are provided for 'wind direction' 'description', 'weather conditions', and 'hours since last rain event'.  <b>All but 'hours since last rain event' are required fields.</b><br/>
				If addtitional comments are desired for this section, see the "<a href="#Comments">Comments</a>" section (Section XIII) below.
			</p>
			<!-- Section IX -->
			<li>Waves</li>
			<p>
				On this page, Wave height can be described, and includes a checkbox to represent an estimated measurement.  'Wave direction' (cardinal directions: N, NE, E, SE, etc.), and 'wave conditions' have drop-down menus, as well as 'longshore current direction' (also measured with cardinal directions).  Included on this page is a field for Longshore current speed (measured in ft/sec).  <b>All of these fields are required for survey completion.</b><br/>
				If addtitional comments are desired for this section, see the "<a href="#Comments">Comments</a>" section (Section XIII) below.
			</p>
			<!-- Section X -->
			<li>Sample Collection</li>
			<p>
				This page allows you to input a time of collection (either automatically or manually).  An example time is provided for format if a manual input is made.  Information can be adjusted after insertion by selecting a portion of the date/time and typing new data, or using the provided up/down arrows on the right side of the field.  Also on the right side of the field is a drop-down button that displays a calendar.  The calendar can be used to fill in the required information.  This portion of the survey is not required for completion.  
			</p>
			<!-- Section XI -->
			<li>Water Conditions</li>
			<p>
				This page is used to input information about the pH levels of the water and provides a checkbox to indicate the color has changed.  Odor can be described, and a drop-down menu is provided for this field.  'Water temperature' is input in terms of '<sup>o</sup>F'.  The Haziness of water can be defined as one of the drop-down options from the 'Turbidity' field.  Alternatively, Nephelometric Turbidity Units, or NTUs, can be supplied in the proceeding field.  Common measurements are 5, 50, or 500 NTUs.  A final field is provided for a secchi tube reading.  <b>All fields, except either Turbidity or NTUs, are required for completion.</b><br/>
				If addtitional comments are desired for this section, see the "<a href="#Comments">Comments</a>" section (Section XIII) below.
			</p>
			<!-- Section XII -->
			<li>Algae</li>
			<p>
				On this page, there are two fields for percentage of algae present (on beach, and near shore).  Both of these fields have drop-down menus with values for 0%, 1-20%, 21-50% and >50%.  Also found of this page are checkboxes for type of algae, and color of algae.<br/>
				Note that both sets of checkboxes have an 'other' option that, when selected, display an description field.  <b>If the 'other' box is checked, the description is required for completion.</b><br/>
				If addtitional comments are desired for this section, see the "<a href="#Comments">Comments</a>" section (Section XIII) below.
			</p>
			<!-- Section XIII -->
			<li><a name="Comments">Comments</a></li>
			<p>
				This page provides fields for additional comments.  Four fields are provided, one for each of the following: 'Waves and Weather', 'Color and odor of water', 'Human bathers', 'Debris, Algae, and Wildlife'.
			</p>
			<!-- Section XIV -->
			<li>Review</li>
			<p>
				When creating a new survey, this page allows you to review and adjust any of the previously mentioned data fields as well as the comments sections described above.<br/>
				At the bottom of this page, you will be able to see three buttons.  The leftmost, "previous", will take you back to the comments page of the survey form.  The middle button is the delete function (see delete from above), and the rightmost button will allow you to download this survey as a .CSV file.  If the user has not filled out all of the required information fields, then clicking the download button will prompt the user with a warning.  The warning states that submitting the survey will prevent them from further editing.  At this point the user can download the incomplete survey, or return to the review page and use the hamburger menu to view which sections have not met requirements.  After the Survey is downloaded, it will move from the "<a href="#UnRep">Unsubmitted Reports</a>" section of the home page to the "<a href="#PastRep">Past Reports</a>" section.  See Sections 2 and 3 for more on unsubmitted reports or past reports.
			</p>
		</ol>
	</body>
</html>