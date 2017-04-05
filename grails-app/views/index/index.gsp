<%@ page import="beaches.CheckQuestion; beaches.TextQuestion; beaches.SelectQuestion; beaches.HiddenQuestion; beaches.ButtonElement" %>
<!doctype html>
<html>
<head>
    <meta name="layout" content="main"/>
    <title>WI Beach Health</title>

    %{--<asset:link rel="icon" href="favicon.ico" type="image/x-ico" />--}%
</head>
<body>
%{--<section id="page-home">--}%
    %{--<h1 class="mega">Wisconsin Beaches</h1>--}%
    %{--<div class="split-container report-list">--}%
        %{--<h2>Unsubmitted Reports</h2>--}%
        %{--<div class="btns">--}%
            %{--<i id="btn-new" class="icon-plus btn"></i>--}%
        %{--</div>--}%
    %{--</div>--}%

    %{--<div class="split-container report-list">--}%
        %{--<h2>Past Reports</h2>--}%
        %{--<div class="btns">--}%
            %{--<i id="btn-past-reps" class="icon-right-open btn"></i>--}%
        %{--</div>--}%
    %{--</div>--}%
%{--</section>--}%
<div class="page-content" data-page="home" data-page-title="WI Beaches">
    <button id="btn-new-survey" class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored mdl-js-ripple-effect" onclick="newSurvey()">
        <i class="material-icons">add</i>
    </button>
    <ul class="mdl-list" id="unsubmitted-reports">
        <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
                <span class="mdl-typography--font-bold">Unsubmitted Reports</span>
            </span>
        </li>
    </ul>
    <ul class="mdl-list">
        <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
                <span class="mdl-typography--font-bold">Past Reports</span>
            </span>
        </li>
    </ul>
</div>

<div class="page-content" id="page-questions" style="display: none">
<g:each status="i" var="p" in="${survey}">
    <div data-page-title="${p.pageName}" data-page="${i}">
        <g:each var="q" in="${p.questions}">
            <g:if test="${q instanceof TextQuestion}">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input list="${q.list}" class="mdl-textfield__input ${q.extraClasses}" type="${q.type}" pattern="${q.pattern}" step="${q.step}" name="${q.columnId}" id="${q.columnId}">
                    <label class="mdl-textfield__label" for="${q.columnId}">${q.prompt}</label>
                </div>
                <g:if test="${q.list != ''}">
                    <datalist id="${q.list}"></datalist>
                </g:if>
            </g:if>
            <g:if test="${q instanceof CheckQuestion}">
                <g:if test="${q.hasTitle}">
                    <h6>${q.title}</h6>
                </g:if>
                <g:if test="${q.radio}">
                    <g:if test="${q.inline}">
                        <div>
                    </g:if>
                    <g:each status="n" var="c" in="${q.prompts}">
                        <g:if test="${!q.inline}">
                            <div>
                        </g:if>
                            <label id="${q.columnId + '-' + n}Label" ${q.inline ? 'style="padding-left:8px;"' : ''} class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="${q.columnId + '-' + n}">
                                <input type="radio" id="${q.columnId + '-' + n}" class="mdl-radio__button" name="${q.columnId}" value="n" ${c.second ? ' checked' : ''}>
                                <span class="mdl-radio__label">${c.first}</span>

                            </label>
                        <g:if test="${!q.inline}">
                            </div>
                        </g:if>
                    </g:each>
                    <g:if test="${q.inline}">
                        </div>
                    </g:if>
                </g:if>
                <g:else>
                    <g:each var="c" in="${q.prompts}">
                        <label id="${q.columnId}Label" class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="${q.columnId}">
                            <input type="checkbox" name="${q.columnId}" id="${q.columnId}" class="mdl-checkbox__input"${c.second ? ' checked' : ''}>
                            <span class="mdl-checkbox__label">${c.first}</span>
                        </label>
                        <g:if test="${!q.inline}">
                            <br>
                        </g:if>
                    </g:each>
                </g:else>
            </g:if>
            <g:if test="${q instanceof SelectQuestion}">
                %{-- not using g:select because it's easier to create mdl components by hand --}%
                <div class="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label">
                    <select name="${q.columnId}" id="${q.columnId}" class="mdl-selectfield__select">
                        <g:each var="o" in="${q.options}">
                            <option value="${o}">${o}</option>
                        </g:each>
                    </select>
                    <div class="mdl-selectfield__icon"><i class="material-icons">arrow_drop_down</i></div>
                    <label class="mdl-selectfield__label" for="${q.columnId}">Favorites</label>
                </div>
            </g:if>
            <g:if test ="${q instanceof HiddenQuestion}">
                <input class="mdl-textfield__input" type="hidden" value="${q.value}" name="${q.columnId}" id="${q.columnId}">
            </g:if>
            <g:if test="${q instanceof ButtonElement}">
                <button class="mdl-button mdl-js-button mdl-button--raised ${q.accent ? 'mdl-button--accent' : ''}" id="${q.columnId}" onclick="${q.onclick}">${q.value}</button><br>
            </g:if>
            <g:else><br></g:else>
        </g:each>
    </div>
</g:each>
<div class="bottom-nav" id="bottom-nav">
  <button class="mdl-button mdl-js-button mdl-button--raised" id="btn-prev" onclick="btnPrev()" style="display: none">Previous</button>
  <div style="flex-grow: 1"></div>
  <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" id="btn-next" onclick="btnNext()">Next</button>
</div>
</div>
<script type="text/javascript">
  var totalQuestionPages = ${survey.size()};
</script>
</body>
</html>
