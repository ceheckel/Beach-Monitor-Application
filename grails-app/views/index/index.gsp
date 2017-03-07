<%@ page import="beaches.CheckQuestion; beaches.TextQuestion; beaches.SelectQuestion" %>
<!doctype html>
<html>
<head>
    <meta name="layout" content="main"/>
    <title>WI Beach Health</title>

    %{--<asset:link rel="icon" href="favicon.ico" type="image/x-ico" />--}%
</head>
<body>
<section id="page-home">
    <h1 class="mega">Wisconsin Beaches</h1>
    <div class="split-container report-list">
        <h2>Unsubmitted Reports</h2>
        <div class="btns">
            <i id="btn-new" class="icon-plus btn"></i>
        </div>
    </div>

    <div class="split-container report-list">
        <h2>Past Reports</h2>
        <div class="btns">
            <i id="btn-past-reps" class="icon-right-open btn"></i>
        </div>
    </div>
</section>

<g:each status="i" var="p" in="${survey}">
    <section id="page-survey-${i}">
        <h1>${p.pageName}</h1>
        <g:each var="q" in="${p.questions}">
            <g:if test="${q instanceof TextQuestion}">
                <g:textField name="${q.columnId}" placeholder="${q.prompt}"/>
            </g:if>
            <g:if test="${q instanceof CheckQuestion}">
                <g:if test="${q.radio}">
                    <g:radioGroup name="${q.columnId}" values="${(1..q.prompts.size())}" labels="${q.prompts.collect {e -> e.first}}" value="${q.prompts.findIndexOf({e -> e.second})+1}">
                        <p>${it.radio} ${it.label}</p>
                    </g:radioGroup>
                </g:if>
                <g:else>
                    <g:each var="c" in="${q.prompts}">
                        <g:checkBox name="${q.columnId}" checked="${c.second}" id="${q.columnId + '-' + c.first}"/>
                        <label for="${q.columnId + '-' + c.first}">${c.first}</label>
                        <br>
                    </g:each>
                </g:else>
            </g:if>
            <g:if test="${q instanceof SelectQuestion}">
                <g:select name="${q.columnId}" from="${q.options}" id="${q.columnId}"/>
            </g:if>
            <br>
        </g:each>
        <div class="page-nav split-container">
            <g:if test="${i>0}">
                <button id="btn-prev-${i}" onclick="toPageNum(${i-1})">Previous</button>
            </g:if>
            <g:else>
                <div class="btn-page-fake"></div>
            </g:else>
            <span class="progress-text">${i+1}/${survey.size()}</span>
            <g:if test="${i<survey.size()-1}">
                <button class="btn-primary" id="btn-next-${i}" onclick="toPageNum(${i+1})">Next</button>
            </g:if>
            <g:else>
                <div class="btn-page-fake"></div>
            </g:else>
        </div>
    </section>
</g:each>
</body>
</html>
