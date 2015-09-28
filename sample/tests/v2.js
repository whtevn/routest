var Routest = require('../../routest');
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
    }
  })

var all_users = UserApi
                  .query({
                    query: {}
                  , headers: {}
                  , body: ("" || {})
                  })

all_users.response()
all_users.code();
all_users.duration();
all_users.result(); // { response: ..., code: ..., duration: ... }

console.log(all_users.refresh());


/*
describe("A suite", function(next) {
  var User = new UserApi('sample-app.json');
   beforeAll(function(next) {
     var all_users = User.query.execute({
         query: {}
       , headers: {}
       , body: ("" || {})
       })
       .then(next)

      var user_added = all_users.then(function(){
        return User.create({ })
      })
   });

  it("contains spec with an expectation", function() {
    expect(all_users.result).toBe({});
  })

  it("should respond with a new user", function(){
    expect(user_added.error_code).toBe(200);
  });

  describe("after user has been added", function(){
     beforeEach(function(next) {
       var updated_users = all_users.recall();
     });
    it("should be able to re-execute a call", function(){
      expect(new_users_added.result).count().toBe("one more")
    });
  })
});
*/
