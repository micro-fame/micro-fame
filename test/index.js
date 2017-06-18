const { Boot } = require('../src');
Boot({ port: 8080, rootDir: __dirname }).catch(e => console.log('err', e));
