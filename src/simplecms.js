const express = require('express');
const mongoose = require('mongoose');
const models = require('./models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/simplecms';
const PORT = process.env.PORT || 8080;

mongoose.connect(MONGODB_URI);

const app = express();

const PageDefinition = models.PageDefinition.model;
const PageFactory = models.PageFactory;

const FrontPageDefiniton = new PageDefinition({
  pageName: 'FrontPage',
  attributes: [
    { type: 'textField', attributeName: 'title', isRequired: true }
  ]
});

const pageDefinition = FrontPageDefiniton;
models.PageDefinition.init(pageDefinition);

const FrontPage = PageFactory(FrontPageDefiniton);
// var frontPage = new FrontPage({
//     title: 'Hello World'
// });
//
// frontPage.save((err) => {
//   if (err) return console.error(err);
//   return console.log('Successfully saved FrontPage');
// });

const NameToPageMap = {
  [FrontPageDefiniton.pageName.toLowerCase()]: FrontPage
}

app.get('/pageDefinitions', (req, res) => {
  PageDefinition
    .find({})
    .exec((err, defs) => {
      if (err) {
        let message = {
            developerMessage: 'An unexpected error occured',
            userMessage: 'Whops that shouldn\'t have happened. Please contact the developer',
            error: err
        }
        console.error(JSON.stringify(message));
        return res.status(500).send(message);
      }

      return res.send(defs);
    })
});

app.get('/pages/:pageDef?/:pageId?', (req, res) => {
  const { pageDef: pageDef, pageId: pageId } = req.params;
  const notImplementedMessage = {
    developerMessage: 'Sorry this as not been implemented yet',
    userMessage: 'Sorry, resource not found',
    error: null
  }
  if (pageDef === null || pageDef === undefined || pageId == null || pageId === undefined)
    return res.status(404).send(notImplementedMessage);
  else {
    var page = NameToPageMap[pageDef.toLowerCase()]
    if (page === null || page === undefined)
      return res.status(404).send(notImplementedMessage);
    return  page
      .find({})
      .exec((err, pages) => {
        if (err) throw Error('What the error is not handled');
        const id = parseInt(pageId);
        if (pages.length < id) return res.status(404).send({ error: 'not found' });
        return res.send(pages[id]);
      });
  }
});

const server = app.listen(PORT, () => {
  console.log('Server is running on ' + PORT);
})
