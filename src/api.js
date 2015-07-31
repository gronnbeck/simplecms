const models = require('./models');

const PageDefinition = models.PageDefinition.model;
const PageFactory = models.PageFactory;

const FrontPageDefiniton = new PageDefinition({
  pageName: 'FrontPage',
  attributes: [
    { type: 'textField', attributeName: 'title', isRequired: true }
  ]
});

models.PageDefinition.init(FrontPageDefiniton);

var register = require('./register');
register.register(FrontPageDefiniton);

const NameToPageMap = register.getMap();

const getPageDefinitions = (req, res) => {
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
}

const getPages = (req, res) => {
  const { pageDef: pageDef, pageId: pageId } = req.params;
  const notImplementedMessage = {
    developerMessage: 'Sorry this as not been implemented yet',
    userMessage: 'Sorry, resource not found',
    error: null
  }
  if (pageDef === null || pageDef === undefined || pageId == null || pageId === undefined)
    return res.status(404).send(notImplementedMessage);
  else {
    console.log(NameToPageMap);
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
}


module.exports = {
  getPageDefinitions,
  getPages
}
