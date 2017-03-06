<%@ page import="beaches.CheckQuestion; beaches.TextQuestion; beaches.SelectQuestion" %>
<!doctype html>
<html>
<head>
    <meta name="layout" content="main"/>
    <title>WI Beach Health</title>

    %{--<asset:link rel="icon" href="favicon.ico" type="image/x-ico" />--}%
</head>
<body>
<g:each var="p" in="${survey}">
    <section>
        <h1>${p.pageName}</h1>
        <g:each var="q" in="${p.questions}">
            <g:if test="${q instanceof TextQuestion}">
                <g:textField name="${q.columnId}" placeholder="${q.prompt}"/>
            </g:if>
            <g:if test="${q instanceof CheckQuestion}">
                <g:if test="${q.radio}">
                    <g:radioGroup name="${q.columnId}" values="${(1..q.prompts.size())}" labels="${q.prompts.collect {e -> e.first}}" value="${q.prompts.findIndexOf({e -> e.second})+1}">
                        <p>${it.label} ${it.radio}</p>
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
    </section>
</g:each>
</body>
</html>
