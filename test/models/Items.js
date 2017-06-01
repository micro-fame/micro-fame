const { RestModel, Remote } = require('../../src');

@RestModel()
class Items {

  @Remote({
    path: '/total'
  })
  async getTotalItems() {
    return 100;
  }
};

module.exports = Items;
