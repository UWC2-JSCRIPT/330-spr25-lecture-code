const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

const serverStartDate = new Date();

app.get('/', (req, res) => {
    const searchTerm = req.query.q;
    // return res.send('Hello world!');
    const blogPosts = [
        {title: '5/13/25', content: 'Thought 3'},
        {title: '5/10/25', content: 'Thought 2'},
        {title: '5/03/25', content: 'Thought 1'},
    ];

    return res.render('index', {
        date: serverStartDate,
        searchTerm,
        blogPosts,
    });
});

app.listen(3000, () => {
    console.log('Listening on localhost:3000');
});