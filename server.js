const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; // heroku will set port. if app running locally use port 3000 instead

var app = express();

//Register another middleware to log requests to the server

app.use((req, res, next) => {
    //can do anything here
    //next is used to tell express that we're done. Express wont go forward unless next() is called

    var now = new Date().toString();

    //reqest object contains info about the requesting client. re.url contains the url of the page that was requested
    
    var log = `${now}: ${req.method} ${req.url}`;
    
    console.log(log);

    fs.appendFile('mhd3v_server_log.log', log + '\n', (err) => {
        if(err)
            console.log('Unable to append to server log');
    });

    next();

});

// app.use((req, res, next) => {
//     //this middleware will stop all handlers from running since we haven't called next. 
//     res.render('maintenance.hbs');

// });

//Middleware (teach express to do something it isn't able to). app.use is how we register a middleware. It takes a function: 
app.use(express.static(__dirname + '/public')); // __dirname -> path to project directory

app.set('view engine', 'hbs'); //app.set is used to set express server configurations. Takes key value pairs.

hbs.registerPartials(__dirname + '/views/partials'); // this allows us to resuse handlebars partial code across views

hbs.registerHelper('getCurrentYearHelper', () => { //use function in views
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => { //register get handler on root route 

    // res.send('<b>Hello Express!</b>');

   res.render('home.hbs', {

        welcomeMessage: 'Hello mahad!',
        pageTitle: 'Home',

   });

});

app.get('/about', (req, res) => {   //register about handler on about route

    res.render('about.hbs', {       //second argument is the data to inject into the hbs template
        pageTitle: 'About Page',
    }); //render about page from views

});

app.get("/projects", (req, res) => {
    res.render('projects.hbs', {
        pageTitle: "My Portfolio"
    });
});

// /bad -> json with error msg property

app.get('/bad', (req, res) => {

    res.send({
       
        errorMessage: 'Your request failed!'
        
    });

});

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
}); //second argument optional, runs when server is up. 