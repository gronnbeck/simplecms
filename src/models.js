const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PageDefinition = require('./page-definition');

const pascalCase = (s) => s.replace(/(\w)(\w*)/g,
        function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});

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
