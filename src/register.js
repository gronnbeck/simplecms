const _ = require('lodash');
const models = require('./models');
const PageFactory = models.PageFactory;

class PageRegister {

  constructor() {
      this.pageDefinitions = {};
      this.map = null;
  }

  register(pageDefinition) {
    const name = pageDefinition.pageName.toLowerCase();
    if (this.pageDefinitions[name] == null) {
      this.pageDefinitions[name] = pageDefinition;
      return this;
    }
    else throw new Error('PageDefinitionAlreadyRegistered');
  }

  getMap() {
    if (this.map) return this.map;
    const vals = _.values(this.pageDefinitions);
    const pairs = _.map(vals, (pageDef) => {
      const page = PageFactory(pageDef);
      return { name: pageDef.pageName.toLowerCase(), page }
    });

    this.map =  _.reduce(pairs, (mem, curr) => {
      mem[curr.name] = curr.page
      return mem
    }, {});

    return this.map;
  }

  getDefinition (name) {
    const pageDef = this.pageDefinitions[name];
    if (pageDef == null) {
      throw new Error('PageDefinitionDoesNotExist');
    }
    else return pageDef;
  }

}

var pageRegister = new PageRegister();

module.exports = pageRegister;
