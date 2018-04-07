/**
 * Loads stored favorites from localforage
 */
function loadFavorites() {
    localforage.getItem('favorites').then(function(v) {

        console.log(v);

        window.favorites = v === null ? [] : v;
        if(typeof(window.favorites) === 'undefined')
            window.favorites = [];
        applyFavorites();
    }).catch(function(e) {
        window.favorites = [];
        console.log(e);
    });
}

/**
 * Saves changes made to favorites
 */
function saveFavorites() {
    localforage.setItem('favorites', favorites).then(function(v) {
        console.log(v);
    }).catch(function(e) {
        console.log(e);
    });
}

/**
 * Applies favorites and populates dropdown
 */
function applyFavorites() {
    var f = $('#__favorites');
    f.empty();
    f.append('<option value=""></option>');
    if (favorites) {
        favorites.forEach(function (cval, i) {
            f.append('<option value="' + i + '">' + cval.beach + ' &raquo; ' + cval.site + '</option>')
        });
    }
}

/**
 * Adds selected beach to the list of favorites in localforage
 */
function addFavorite() {
    var c = $('#__county').val();
    var l = $('#__lake').val();
    var b = $('#__beach').val();
    var s = $('#__site').val();

    favorites.push({
        county: c,
        lake: l,
        beach: b,
        site: s
    });

    saveFavorites();
    applyFavorites();

    var f2 = document.getElementById('__favorites');
    f2.selectedIndex = f2.options.length - 1;
    $('#__addFavorite').prop('disabled',true); // changes the disabled property to true
}

/**
 * Applies values after selecting a favorite
 */
function fillFavorite() {
    var c = $('#__county');
    var l = $('#__lake');
    var b = $('#__beach');
    var s = $('#__site');
    var f = $('#__favorites');

    if(typeof(favorites[f.val()]) === 'undefined')
        return;

    c.val(favorites[f.val()].county).parent().addClass('is-dirty');
    fillFromCounty();
    l.val(favorites[f.val()].lake).parent().addClass('is-dirty');
    fillFromLake();
    b.val(favorites[f.val()].beach).parent().addClass('is-dirty');
    fillFromBeach();
    s.val(favorites[f.val()].site).parent().addClass('is-dirty');
}

/**
 * Removes the selected favorite from localforage
 */
function remFavorite() {
    // get favorites from localforage
    localforage.getItem('favorites').then(function(faves) {
        // if faves exists, manipulate it
        if(faves) {
            console.log("favorites: " + faves);
            var c = $('#__county').val();
            var l = $('#__lake').val();
            var b = $('#__beach').val();
            var s = $('#__site').val();

            // for each index of the favorites list ...
            faves.forEach(function(f) {
                // if it matches the currently selected location, remove it
                if(f.county == c && f.lake == l && f.beach == b && f.site == s) {
                    faves.splice(faves.indexOf(f),1);
                }
            });

            // update the global and save the new list
            favorites = faves;
            saveFavorites();
            applyFavorites();
            $('#__addFavorite').prop('disabled',false); // changes the disabled property to true
        }
    });
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
        $('#__county').val() === '' ||
        $('#__lake').val() === '' ||
        $('#__beach').val() === '' ||
        $('#__site').val() === '' ||
        submitted
    )
}