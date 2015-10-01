var Routest = require('../../../index');
var UserApi = Routest("sample-app.json"
  , "user"
  , {
    query: {
      path: "users"
    , method: "GET"
    },
    create: {
      path: "users"
    , method: "POST"
    },
    update: {
      path: "user/:id"
    , method: "PUT"
    },
    delete: {
      path: "user/:id"
    , method: "DELETE"
    }
  })

module.exports = UserApi
