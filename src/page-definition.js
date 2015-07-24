const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ENVIRONMENT = process.env.NODE_ENV;

const enu = {
  values: 'textarea textField'.split(' '),
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
}

const PageAttributeSchema = new Schema({
  type: { type: String, enum: enu },
  attributeName: { type: String, required: true }
});

const PageDefinitonSchema = new Schema({
  pageName: { type: String, required: true },
  attributes: [PageAttributeSchema],
  isRequired: { type: Boolean, default: false }
});

const PageDefinitionModel = mongoose.model('PageDefinition', PageDefinitonSchema);

const createPageDefiniton = (pageDefinition) => {
  pageDefinition.save((err) => {
    if (err) return console.error('Could not create pageDefinition');
    console.log('Successfully saved PageDefinition')
  });
}

const updatePageDefinition = (pageDefinitionModel, pageDefinition) => {
  const message = 'updatePageDefinition is not implemented';
  if (ENVIRONMENT !== 'development') throw new Error(message);
  else console.error(message);
}

const init = (pageDefinition) => {
  console.log('Initializing PageDef ' + pageDefinition.pageName);
  PageDefinitionModel
  .find({pageName: pageDefinition.pageName})
  .exec((err, defs) => {
    if (err)
      return console.error('Could not create PageDefinition ' + pageDefinition.pageName);
    else if (defs.length == 0)
      return createPageDefiniton(pageDefinition)
    else if (defs.length == 1)
      return updatePageDefinition(defs[0], pageDefinition);
    throw new Error('Could not save or update PageDefinition');
  });
}


module.exports = {
  init: init,
  model: PageDefinitionModel
};
