module.exports = {
    HTML: function(title, list, control, body) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>WEB | ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                ${list}
                ${control}
                ${body}
            </body>
            </html>
        `;
    }, list: function(fileList) {
        let list = '<ul>';
        for(let i=0; i<fileList.length; i++) {
            list = list + `<li><a href="/page/${fileList[i]}">${fileList[i]}</a></li>`;
        }
        list = list + '</ul>';

        return list;
    }
}