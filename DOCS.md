# WI Beach Health - Application Documentation

This document outlines the use and maintenance of the WI Beach Health web survey.
If you discover any problems with the application or this document, please ___INSERT BUG HANDLING INFORMATION HERE___. 

## Using the App

### Caveats

There are known issues in a few browsers that make the app difficult or impossible to use.
To avoid such issues, only the following browsers are supported:

* Google Chrome on Android
* Safari on iOS
* Google Chrome on Windows, Max OSX and Linux

Additionally, Firefox on Android has been tested, but not as thoroughly as Google Chrome.

## Maintenance

___ADD INSTRUCTIONS ABOUT REBUILDING EVERYTHING___

### Beach and Site Maintenance

At the time of writing, the list of beaches available in the application must be updated by hand when changes are necessary.
To add, update or remove a beach or site from the list, modify the `beaches` object in `grails-app/assets/javascripts/beaches.js`.

This map is structured like so:

```javascript
var beaches = {
    'County 1': {
        'Lake 1': { _site: 0, 'Site 1': 0, 'Site 2': 1 },
        'Lake 2': { _site: 1, 'Site 1': 2, 'Site 2': 3 }
    },
    'County 2': { /* ... */ }
};
```

Top level members are counties, which each contain a set of lakes.
Each lake contains a member named `_site`, which must be the `BEACH_SEQ` value from the database.
Additionally, each lake contains a mapping from site names to site IDs; the ID used here must correspond to the `MONITOR_SITE_SEQ` value in the database.

### Survey Maintenance

Survey questions are all defined in the `index()` method of `IndexController.groovy`, found in`grails-app/controllers/beaches/`.
From here, most questions can be created.
The app currently supports questions being posed using the following mechanisms:

* Basic text input - these can be restricted to numeric entries or arbitrary regular expressions as needed
* Check boxes
* Radio buttons
* Single-selection dropdowns
* Timestamps
* Hidden fields (e.g. units that the user cannot modify)

Buttons can also be added from `IndexController`, though their actions must be specified elsewhere (usually in `application.js`).

#### Pages

Survey pages can be added by creating a map with elements `pageName` and `questions`, then adding them to the `survey` map at the end of the function.
For example, a page titled "User Information" would start like this:

```groovy
def userInfo = [
    pageName: 'User Information',
    questions: []
]
```

This would then be included in the `survey` map like so:

```groovy
[survey: [/* ... */, userInfo]]
```

The order of pages in the `survey` map is the same order the pages show up in the app.

#### Questions

Constructor parameter:

* columnId (String): the `id` of the element; for questions with no special processing, this should correspond to a database column

##### Text Input

Additional constructor parameters:

* prompt (String): the prompt to show the user
* type (String): the `type` attribute of the generated `<input>` element
* pattern (String): a regular expression; if the input does not match the expression, it will be highlighted as invalid
* step (String): a decimal value indicating the level of precision the field will allow (only for numeric entries)
* extraClasses (String): a string that will be added to the list of classes on the generated `<input>` element
* list (String): the HTML `id` of a datalist (`<input>` and `<datalist>` elements will be generated); this can be used for autocompletion while still allowing free-form input

##### Check Boxes and Radio Buttons

Additional constructor parameters:

* prompts (List<Tuple2<String, Boolean>>): the list of labels and default values for this set of check boxes or radio buttons
* radio (boolean): whether this is a set of check boxes (false) or radio buttons (true); default to false
* hasTitle (boolean): whether to generate a title for this set; defaults to false
* title (String): the title to show for this set; ignored if hasTitle is false
* inline (boolean): if this is true, check boxes or radio buttons will all appear on the same line; defaults to false

##### Dropdowns

Additional constructor parameters:

* options (List<String>): the list of options for this dropdown to present
* title (String): the prompt for this dropdown

##### Timestamps

Timestamps do not take any additional parameters in their constructors.

##### Hidden Fields

Additional constructor parameters:

* value (String): the initial value for this element (the `value` attribute on the generated `<input>` element)
* keep (boolean): whether to replace this value when a survey is loaded with a different value; defaults to false

##### Buttons

Additional constructor parameters:

* value (String): the text to show on the button
* onclick (String): contents of the `onclick` attribute in the generated `<button>` element; this is normally a JavaScript function call (e.g. `addFavorite()`)
* accent (boolean): whether the button background should be the accent color; defaults to false
* disabled (boolean): whether to start the button disabled; defaults to false
