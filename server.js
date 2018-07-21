const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs')


// No next, we execute this lines and then never go to next instructions
// app.use((req, res, next) => {
//     res.render('maintenance.hbs', {
//         pageTitle: 'Maintenance Page',
//         currentYear: new Date().getFullYear(),  
//         welcomeMessage: 'Updating website..'
//     })
// });

app.use(express.static(__dirname + '/public'));

// Next is specified, it goes back to normal context
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now} : ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err){
            console.log('Unable to append log');
        }
    });
    next();
});

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        currentYear: new Date().getFullYear(),  
        welcomeMessage: 'Welcome !'
    })
});

app.get('/about', (req, res) => {
   res.render('about.hbs', {
       pageTitle: 'About Page',
   })
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    })
});

app.listen(3000, () => {
    console.log('Server is up on 3000.')
});