/**
 * beaches defines the data used for autocompletion on the beach selection page.
 * The data maps counties to lakes to beaches to sites
 * @author Streibel
 * @author Kriz (edited)
 * @author Wilson (edited)
 */

var beaches = [];
var callback = function (gotten_beaches) {
    beaches = gotten_beaches;
};

// Make the GET call from other file
beaches_sites_get.run(callback,false);