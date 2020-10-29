const fs = require('fs');
const qs = require('querystring');
const template = require('./lib/template.js');
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());

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
            const control = `
                <a href="/create">create</a>
                <a href="/update/${request.params.pageId}">update</a>
                <form action="/delete_process" method="POST">
                    <input type="hidden" name="id" value="${request.params.pageId}">
                    <input type="submit" value="delete">
                </form>
            `;
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
            <h2>${title}</h2>
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
    const post = request.body;
    const title = post.title;
    const description = post.description;

    fs.writeFile(`./data/${title}`, description, 'utf-8', function(error) {
        if(error) throw error;
        response.redirect(`/page/${title}`);
    });

    /*
    let body = '';
    request.on('data', function(data) {
        body = body + data;
    });
    request.on('end', function() {
        const post = qs.parse(body);
        const title = post.title;
        const description = post.description;

        fs.writeFile(`./data/${title}`, description, 'utf-8', function(error) {
            if(error) throw error;
            response.redirect(`/page/${title}`);
        });
    });
    */
});

app.get('/update/:pageId', function(request, response) {
    fs.readdir('./data', function(error, fileList) {
        fs.readFile(`./data/${request.params.pageId}`, 'utf-8', function(err, description) {
            const title = request.params.pageId;
            const list = template.list(fileList);
            const control = '';
            const body = `
                <form action="/update_process" method="POST">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p><textarea name="description" placeholder="description" cols="30" rows="10">${description}</textarea></p>
                    <p><input type="submit"></p>
                </form>
            `;
            const html = template.HTML(title, list, control, body);

            response.send(html);
        });
    });
});

app.post('/update_process', function(request, response) {
    const post = request.body;
    const id = post.id;
    const title = post.title;
    const description = post.description;

    fs.rename(`./date/${id}`, `./data/${title}`, function(error) {
        // if(error) throw error;
        // 에러처리에 대해 공부하기
        fs.writeFile(`./data/${title}`, description, 'utf-8', function(err) {
            // if(err) throw err;
            response.redirect(`/page/${title}`);
        });
    });


    /*
    let body = '';
    request.on('data', function(data) {
        body = body + data;
    });
    request.on('end', function() {
        const post = qs.parse(body);
        const id = post.id;
        const title = post.title;
        const description = post.description;

        fs.rename(`./date/${id}`, `./data/${title}`, function(error) {
            // if(error) throw error;
            // 에러처리에 대해 공부하기
            fs.writeFile(`./data/${title}`, description, 'utf-8', function(err) {
                // if(err) throw err;
                response.redirect(`/page/${title}`);
            });
        });
    });
    */
});

app.post('/delete_process', function(request, response) {
    let body = '';
    request.on('data', function(data) {
        body = body + data;
    });
    request.on('end', function() {
        const post = qs.parse(body);
        const id = post.id;

        fs.unlink(`./data/${id}`, function(error) {
            response.redirect('/');
        });
    });
});

app.listen(3000, function() {
    console.log('Running...');
});