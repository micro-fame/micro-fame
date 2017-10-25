const { RestService, Remote } = require('../../src');

@RestService()
class Upload {
  @Remote({
    path: '/item',
    method: 'post',
    args: {
      files: ({ files }) => files,
      fields: ({ fields }) => fields
    },
    ignoreJSONParsing: true
  })
  async uploadItem(files, fields) {
    return { files, fields };
  }
}

module.exports = Upload;
