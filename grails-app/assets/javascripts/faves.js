function loadFavorites() {
    localforage.getItem('favorites').then(function(v) {
        favorites = v;
        applyFavorites();
    }).catch(function(e) {
        console.log(e);
    });
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
    f.empty();
    f.append('<option value=""></option>');
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
    console.log(f.children().length - 1);
    f.append('<option value="' + (f.children().length - 1) + '">' + c + ' &raquo; ' + l + ' &raquo; ' + b + ' &raquo; ' + s + '</option>')
    f.parent().addClass('is-dirty');

    var f2 = document.getElementById('__favorites');
    f2.selectedIndex = f2.options.length - 1;

    saveFavorites()
}

function fillFavorite() {
    var c = $('#__county');
    var l = $('#__lake');
    var b = $('#BEACH_SEQ');
    var s = $('#MONITOR_SITE_SEQ');
    var f = $('#__favorites');

    c.val(favorites[f.val()].county).parent().addClass('is-dirty');
    l.val(favorites[f.val()].lake).parent().addClass('is-dirty');
    b.val(favorites[f.val()].beach).parent().addClass('is-dirty');
    s.val(favorites[f.val()].site).parent().addClass('is-dirty');
}

