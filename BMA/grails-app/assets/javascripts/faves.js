/**
 * Loads stored favorites from localforage
 */
function loadFavorites() {
    localforage.getItem('favorites').then(function(v) {
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
    var f = $('#__favorites');
    console.log(f.children().length - 1);
    f.append('<option value="' + (f.children().length - 1) + '">' + b + ' &raquo; ' + s + '</option>');
    f.parent().addClass('is-dirty');

    var f2 = document.getElementById('__favorites');
    f2.selectedIndex = f2.options.length - 1;
    $('#__addFavorite').prop('disabled',true); // changes the disabled property to true
    saveFavorites();
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
 * Removes the selected favorite from memory
 */
function remFavorite() {
    if (favorites) {
        console.log(favorites);
        favorites.forEach(function() {
            if (favorites.county == $('#__county')
                && favorites.lake == $('#__lake')
                && favorites.beach == $('#__beach')
                && favorites.site == $('#__site')) {
                favorites.pop();
                console.log("popped");
            }
        });
        console.log(favorites);
    }
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