const fs = require('fs');
const qs = require('querystring');
const template = require('./lib/template.js');
const express = require('express');
const app = express();

app.get('/', function(request, response) {
    fs.readdir('./data', function(error, fileList) {
        const title = 'Welcome';
        const description = 'Hello, Node.js';
        const list = template.list(fileList);
        const control = '<a href="/create">create</a>';
        const body = `
            <h2>${title}</h2>
            <p>${description}</p>
        `;
        const html = template.HTML(title, list, control, body);

        response.send(html);
    });
});

app.get('/page/:pageId', function(request, response) {
    fs.readdir('./data', function(error, fileList) {
        fs.readFile(`./data/${request.params.pageId}`, 'utf-8', function(err, description) {
            const title = request.params.pageId;
            const list = template.list(fileList);
            const control = '<a href="/create">create</a>';
            const body = `
                <h2>${title}</h2>
                <p>${description}</p>
            `;
            const html = template.HTML(title, list, control, body);

            response.send(html);
        });
    });
});

app.get('/create', function(request, response) {
    fs.readdir('./data', function(error, fileList) {
        const title = 'Create';
        const list = template.list(fileList);
        const control = '';
        const body = `
            <form action="/create_process" method="POST">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description" cols="30" rows="10"></textarea></p>
                <p><input type="submit"></p>
            </form>
        `;
        const html = template.HTML(title, list, control, body);

        response.send(html);
    });
});

app.post('/create_process', function(request, response) {
    let body = '';
    request.on('data', function(data) {
        body = body + data;
    });
    request.on('end', function() {
        const post = qs.parse(body);
        const title = post.title;
        const description = post.description;

        fs.writeFile(`./data/${title}`, description, 'utf-8', function(error) {
            /*
            response.writeHead(302, {Location: `/page/${title}`});
            response.end();
            */
            response.redirect(`/page/${title}`);
        });
    });
});

app.listen(3000, function() {
    console.log('Running...');
});