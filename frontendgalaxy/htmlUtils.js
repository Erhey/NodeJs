jsonToTableHtmlWithRowCount = object => {
    // table.table.table-striped ...
    let cpt = 0
    let tableHtml = '<table border="1px black"  class="table">'
    // ... >tr>th*x
    tableHtml += '<tr>'
    tableHtml += '<th>Row#</th>'

    $.each(object[0], (key, value) => {
        tableHtml += '<th>' + key + '</th>'
    })
    tableHtml += '</tr>'
    // ... +td*y
    $.each(object, (index, user) => {
        cpt++
        tableHtml += '<tr>'
        tableHtml += '<th>'+ cpt + '</th>'
        $.each(user, (key, value) => {
            tableHtml += '<td>' + value + '</td>'
        })
        tableHtml += '<tr>'
    })
    tableHtml += '</table>'
    return tableHtml
}
jsonToTableHtml = object => {
    // table.table.table-striped ...
    let tableHtml = '<table border="1px black"  class="table">'
    // ... >tr>th*x
    tableHtml += '<tr>'
    $.each(object[0], (key, value) => {
        tableHtml += '<th>' + key + '</th>'
    })
    tableHtml += '</tr>'
    // ... +td*y
    $.each(object, (index, user) => {
        tableHtml += '<tr>'
        $.each(user, (key, value) => {
            tableHtml += '<td>' + value + '</td>'
        })
        tableHtml += '<tr>'
    })
    tableHtml += '</table>'
    return tableHtml
}