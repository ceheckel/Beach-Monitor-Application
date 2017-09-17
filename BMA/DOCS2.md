# Beach Monitor Survey - Application Documentation (page 2)

This document serves as a supplement to the HCI group's documentation and is intended to fulfill the requirements of sprint 1’s goal #2: study the current version’s source and create documentation as the deliverable. This file is that documentation/deliverable.

## 1. List Technologies used by the app and what it does
The application is a Grails web application. The application--currently, as we inherited it--provides the ability to fill out a form with beach health information, save the form locally, and optionally download it as a CSV file.
## 2. List JavaScript files and their purposes
The application’s JavaScript files are found in /grains-app/assets/javascripts and are listed and described below.
### 2.1 application.js
This is the global/application-wide javascript file. This file contains javascript that is needed on every page.
### 2.2 beaches.js
This file defines the “beaches” object, which contains a field for each WI county. Each county field is defined as an object containing a field for each lake in that county. Each lake field is defined as an object containing a field for every beach on that lake in that county. Each beach field is defined as an object containing a “_site” field (which acts as a beach’s unique id) and one or more observation points on that beach (e.g., “Center of Beach”) that are defined as the unique id for that observation point.  For example:
```javascript
var beaches = {
	‘Ashland’: {
		‘Lake Superior’: {
			‘6th Ave W Beach’: { _site: 459, ‘Center of beach’: 491},
			…
		…
	…
};
```
### 2.3 dialog-polyfill.js
This file serves as a support for html rendering.
### 2.4 faves.js
The application allows for setting favorites for certain inputs in the form. These favorites are stored in the user’s local storage using the localforage library. This file serves as the implementation of favorites using localforage.
### 2.5 jquery.min.js
The minified jquery library.
### 2.6 jquery-ui.min.js
The minified jquery ui library.
### 2.7 localforage.js
Mozilla’s localforage offline storage library.
### 2.8 material.min.js
The material styling library javascript support.
### 2.9 mdl-selectfield.min.js
The selectfield styling library javascript support.
### 2.10 survey.js
This file serves to define the Survey object which is used in other javascript used by the web app.
## 3. Explain IndexController (i.e. how are survey questions specified?)
### 3.1 Figure out how Beach Selection works including favorites
When selecting a beach, the user can first provide the county in which the beach is found, from there the next field is dynamically populated based on the selection (example: if *Ashland* is selected, then the “Lake” list will contain *Lake Superior* and *Loon Lake* because those are the only two lakes in the county). The same applies to “Beach” and “Site”.
Favorites are saved in localforage when all four required fields are provided, and the button *Add to Favorites* is selected.  The favorite sites can then be quickly referenced and auto-filled from the first field’s drop-down menu.
### 3.2 Explain beaches.js (where it's used/ how it used).
Beaches.js is located in \grails-app\assets\javascript and contains the format for all site locations.  *See Section 2.2 for more information.*
This file is used by the \grails-app\controllers\beaches\IndexController.groovy to evaluate the data types defined by the “Question” class.   This will in turn provide the application to fill in drop-down menus for each of the pages and their respective fields.
### 3.3 Find all use of localforage and what they do.
Localforage is used for two purposes in the application. First, it is used to save surveys locally. Second, it is used to save favorites locally.
### 3.4 Identify the structure of JSON stored in localforage
Localforage allows the user to store data in a conventional JSON key-value pair structure.
### 3.5 Explain how to download CSV files and their contents
Once the user has specified all the required data (or at the time of this writing: as much data as they want), the user can then select the “Review” page from the sidebar.  At the bottom of this page there are currently three buttons: “Previous”, “Delete”, and “Download”.  If the user has completed all required input fields, then selecting the “Download” option will immediately prompt the user for a save location.  Else, the application with warn the user that there are unfinished fields and tell the user where to look to complete them.  The user has the option to abort the download or download the unfinished survey regardless.  The survey will download as a .csv file which can be opened with any spreadsheet viewer (Google Spreadsheet, OpenOffice Calc, MS Excel).  From here the user will see a column for each of the fields they filled out (a few have default values and will be included regardless of user input) along with the value given to that column.
