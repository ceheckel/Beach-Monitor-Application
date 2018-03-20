/**
 * beaches defines the data used for autocompletion on the beach selection page.
 * The data maps counties to lakes to beaches to sites
 */
var beaches = [];
var callback = function (gotten_beaches) {
    beaches = gotten_beaches;
};
beaches_sites_get.run(callback,false);