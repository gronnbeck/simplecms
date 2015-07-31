const express = require('express');
const mongoose = require('mongoose');
const models = require('./models');
const api = require('./api');

const PageDefinition = models.PageDefinition;
const PageFactory = models.PageFactory;

const FrontPageDefiniton = new PageDefinition({
  pageName: 'FrontPage',
  attributes: [
    { type: 'textField', attributeName: 'title', isRequired: true }
  ]
});

var register = require('./register');
register.register(FrontPageDefiniton);


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/simplecms';
const PORT = process.env.PORT || 8080;

mongoose.connect(MONGODB_URI);

const app = express();


// var frontPage = new FrontPage({
//     title: 'Hello World'
// });
//
// frontPage.save((err) => {
//   if (err) return console.error(err);
//   return console.log('Successfully saved FrontPage');
// });

app.get('/pageDefinitions', api.getPageDefinitions);
app.get('/pages/:pageDef?/:pageId?', api.getPages);

const server = app.listen(PORT, () => {
  console.log('Server is running on ' + PORT);
})
