<!doctype html>
<html lang="en" class="no-js">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>
        <g:layoutTitle default="Grails"/>
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>

    <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:300,400,500,700" type="text/css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

    <asset:stylesheet src="application.css"/>

    <g:layoutHead/>
</head>
<body>
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
            <!-- Title -->
            <span class="mdl-layout-title" id="page-title">Wisconsin Beach Health</span>
        </div>
    </header>
    <div class="mdl-layout__drawer">
        <span class="mdl-layout-title" id="page-title-drawer">Home</span>
        <nav class="mdl-navigation">
            <a class="mdl-navigation__link" href="#">Link</a>
            <a class="mdl-navigation__link" href="#">Link</a>
            <a class="mdl-navigation__link" href="#">Link</a>
            <a class="mdl-navigation__link" href="#">Link</a>
        </nav>
    </div>
    <main class="mdl-layout__content">
        <g:layoutBody/>
    </main>
</div>

    %{--<footer>--}%

    %{--</footer>--}%

    <asset:javascript src="application.js"/>

</body>
</html>
