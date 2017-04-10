<!doctype html>
<html lang="en" class="no-js" manifest="static/manifest.appcache">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>
        <g:layoutTitle default="Grails"/>
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=false"/>

    <asset:stylesheet src="application.css"/>
    <asset:stylesheet src="dialog-polyfill.css"/>
    <asset:stylesheet src="icon.css"/>
    <asset:stylesheet src="roboto.css"/>

    <g:layoutHead/>
</head>
<body>
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
            <!-- Title -->
            <span class="mdl-layout-title" id="page-title" style="white-space: pre">WI Beaches</span>
        </div>
    </header>
    <div class="mdl-layout__drawer">
        <span class="mdl-layout-title" id="page-title-drawer">Home</span>
        <nav class="mdl-navigation">
            <a class="mdl-navigation__link" href="javascript:toPage('home');closeDrawer();">Home</a>
            <div id="surveySectionsDrawer" style="display: none">
                <g:set var="pageNum" value="${0}"/>
                <g:each status="i" var="p" in="${survey}">
                    <a class="mdl-navigation__link" href="javascript:toPage(${pageNum});closeDrawer();">
                        ${p.pageName}
                        <i class="tiny material-icons" id="Complete_${pageNum}" style="display: none">done</i>
                    </a>
                    <g:set var="pageNum" value="${pageNum+1}"/>
                </g:each>
                <a class="mdl-navigation__link" href="javascript:toReview();closeDrawer();">Review</a>
            </div>
            <div id="homeSectionDrawer">
                <a class="mdl-navigation__link" href="javascript:newSurvey();closeDrawer();">New Survey</a>
            </div>
        </nav>
    </div>
    <main class="mdl-layout__content">
        <g:layoutBody/>
    </main>
</div>

    <dialog class="mdl-dialog" id="dialog">
        <h4 class="mdl-dialog__title">Incomplete Survey</h4>
        <div class="mdl-dialog__content">
            <p>
                You may still submit the data that you have, but once a survey is submitted, it may not be edited through this application.
            </p>
        </div>
        <div class="mdl-dialog__actions">
            <button type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" id="btn-dialogSub">Submit</button>
            <button type="button" class="mdl-button mdl-js-button mdl-button--raised" id="btn-dialogCan">Not Now</button>
        </div>
    </dialog>
    <asset:javascript src="dialog-polyfill.js"/>
    <script>
        var dialog = document.querySelector('#dialog');
        if(!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        // Now dialog acts like a native <dialog>.
    </script>

    %{--<footer>--}%

    %{--</footer>--}%

    <asset:javascript src="application.js"/>

</body>
</html>
