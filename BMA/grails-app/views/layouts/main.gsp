<!doctype html>
<!--<html lang="en" class="no-js" manifest="static/appcache.manifest">-->
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>
        <g:layoutTitle default="Grails"/>
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=false"/>

    <!-- Important!!
        To build correctly for the production/deployment server, all references to '/assets' should
        be changed to '/beaches/assets' - a find and replace with Ctrl+R will expedite this process.
    -->
    <asset:stylesheet src="application.css"/>

    <style>

    /* Replaces material-icons.css */
    @font-face {
        font-family: 'Material Icons';
        font-style: normal;
        font-weight: 400;
        src: url(assets/MaterialIcons-Regular.eot); /* For IE6-8 */
        src: local('Material Icons'),
        local('MaterialIcons-Regular'),
        url(assets/MaterialIcons-Regular.woff2) format('woff2'),
        url(assets/MaterialIcons-Regular.woff) format('woff'),
        url(assets/MaterialIcons-Regular.ttf) format('truetype');
    }

    .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;  /* Preferred icon size */
        display: inline-block;
        line-height: 1;
        text-transform: none;
        letter-spacing: normal;
        word-wrap: normal;
        white-space: nowrap;
        direction: ltr;

        /* Support for all WebKit browsers. */
        -webkit-font-smoothing: antialiased;
        /* Support for Safari and Chrome. */
        text-rendering: optimizeLegibility;

        /* Support for Firefox. */
        -moz-osx-font-smoothing: grayscale;

        /* Support for IE. */
        font-feature-settings: 'liga';
    }

    /* Replaces roboto.css */
    /* latin */
    @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        src: local('Roboto'), local('Roboto-Regular'), url(assets/Roboto-Regular.ttf?compile=false) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
    }
    /* latin */
    @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 500;
        src: local('Roboto Medium'), local('Roboto-Medium'), url(assets/Roboto-Medium.ttf?compile=false) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
    }
    /* latin */
    @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 700;
        src: local('Roboto Bold'), local('Roboto-Bold'), url(assets/Roboto-Bold.ttf?compile=false) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
    }
    </style>

    <g:layoutHead/>
</head>
<body>
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
            <!-- Title -->
            <span class="mdl-layout-title" id="page-title" style="white-space: pre">WI Beaches</span>

            <!-- Help Button on Upper Navbar -->
            <button id="btn-help" class="mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect bottom-nav-button" data-toggle="modal" data-target="#help-modal" style="background-color: rgb(68,138,255); color: rgb(255,255,255); position: absolute; right: 15px; top: 15px;" data-upgraded=",MaterialButton,MaterialRipple">
                <div class="help-icon"><i class="material-icons">help</i></div>
                <div class="help-icon-item"><i class="material-icons">help</i>&nbsp;Help</div>
                <span class="mdl-button__ripple-container">
                    <span class="mdl-ripple"></span>
                </span>
            </button>
        </div>

    </header>

    <div class="mdl-layout__drawer">
        <span class="mdl-layout-title" id="page-title-drawer">Home</span>
        <span class="mdl-layout-title" id="page-beach-drawer" style="font-size: small; font-weight: lighter; line-height: 1.2">Unknown Beach</span>
        <!-- sidebar -->
        <nav class="mdl-navigation">
            <!-- Home Page (in sidebar) -->
            <a class="mdl-navigation__link" href="javascript:toPage('home',false);closeDrawer();">Home <span class="mdl-color-text--grey">(saves survey)</span></a>

            <!-- each page in new survey creation (in sidebar) -->
            <div id="surveySectionsDrawer" style="display: none">
                <g:set var="pageNum" value="${0}"/>
                <g:each status="i" var="p" in="${survey}">
                    <a class="mdl-navigation__link" href="javascript:toPage(${pageNum});closeDrawer();">
                        ${p.pageName}
                    </a>
                    <g:set var="pageNum" value="${pageNum+1}"/>
                </g:each>

                <!-- Review Page (in sidebar) -->
                <a class="mdl-navigation__link" href="javascript:toReview();closeDrawer();">Review</a>
            </div>

            <!-- New Survey (in sidebar) -->
            <div id="homeSectionDrawer">
                <a class="mdl-navigation__link" href="javascript:newSurvey();closeDrawer();">New Survey</a>
            </div>

            <!-- Help Button (in sidebar) -->
            <div id="helpSectionDrawer">
                <a class="mdl-navigation__link" href="javascript:toHelp();closeDrawer();">Need Help?</a>
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
                Check 'Beach Selection' for valid beach name and monitoring site.<br/>
                Also, review "if other, describe *" fields.
            </p>
        </div>
        <div class="mdl-dialog__actions">
            <button type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" id="btn-dialogSub">Submit</button>
            <button type="button" class="mdl-button mdl-js-button mdl-button--raised" id="btn-dialogCan">Not Now</button>
        </div>
    </dialog>
    <script>
        var dialog = document.querySelector('#dialog');
        if(!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        // Now dialog acts like a native <dialog>.
    </script>

    <asset:javascript src="application.js"/>
</body>
</html>
