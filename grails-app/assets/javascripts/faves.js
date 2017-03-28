function loadFavorites() {
    var ret = [];
    localforage.getItem('favorites').then(function(v) {
        ret = v;
    }).catch(function(e) {
        console.log(e);
    });
    return ret;
}

function saveFavorites() {
    localforage.setItem('favorites', favorites).then(function(v) {
        console.log(v);
    }).catch(function(e) {
        console.log(e);
    });
}

function applyFavorites() {
    var f = $('#__favorites');
    favorites.forEach(function (cval, i) {
        f.append('<option value="' + i + '">' + cval.county + ' &raquo; ' + cval.lake + ' &raquo; ' + cval.beach + ' &raquo; ' + cval.site + '</option>')
    });
}

function addFavorite() {
    var c = $('#__county').val();
    var l = $('#__lake').val();
    var b = $('#BEACH_SEQ').val();
    var s = $('#MONITOR_SITE_SEQ').val();
    favorites.push({
        county: c,
        lake: l,
        beach: b,
        site: s
    });
    var f = $('#__favorites');
    f.append('<option value="' + c + '::' + l + '::' + b + '::' + s + '">' + c + ' &raquo; ' + l + ' &raquo; ' + b + ' &raquo; ' + s + '</option>')
    f.selectedIndex = f.children.length - 1;
    f.parent().addClass('is-dirty');

    saveFavorites()
}

