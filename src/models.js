const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PageDefinition = require('./page-definition');
const pascalCase = require('./pascal-case');

/*
TODO:
The types are impl. two places. In pageDefintion.enu and here.
Don't want that...

*/
const typeMatching = (attributeType) => {
  switch (attributeType) {
    case 'textArea': return String;
    case 'textField': return String;
    default:
      throw new Error('Invalid type');
  }
}

const PageFactory = (pageDefinition) => {
  var schema = { };
  for (let attribute of pageDefinition.attributes) {
      let attrName = attribute.attributeName;
      let type = attribute.type;
      let isRequired = attribute.isRequired;
      schema[attrName] = { type: typeMatching(type), required: isRequired }
  }
  const PageSchema = new Schema(schema);
  const modelName = 'Page' + pascalCase(pageDefinition.pageName);
  return mongoose.model(modelName, PageSchema);
}

module.exports = {
  PageDefinition: PageDefinition,
  PageFactory: PageFactory
}
