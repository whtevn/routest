var UserApi = require('./api/user');

describe("when adding a user", function() {
  var User = new UserApi();
  var all_users_query;
  var all_users;
  var user_added;
  var num_users;

  beforeEach(function(next) {
    all_users_query = User.query();

    all_users_query
      .finished
      .then(function(result){
        result.response = JSON.parse(result.response);
        all_users = result
      })
      .then(next)
  })

  beforeEach(function(next) {
    User.create({
        body: {
          first: 'new'
        , last: 'user'
        }
      })
      .finished
      .then(function(result){
        result.response = JSON.parse(result.response);
        user_added = result;
      })
      .then(next)
  })

  it("should set the user's id in the response", function(){
    expect(user_added.response.id).not.toBeFalsy();
  });

  it("should have the user's first name", function(){
    expect(user_added.response.first).toBe("new");
  })

  it("should have the user's last name", function(){
    expect(user_added.response.last).toBe("user");
  })

  describe("after user has been added", function(){
    var updated_users;
     beforeEach(function(next) {
       all_users_query.refresh()
        .then(function(result){
          result.response = JSON.parse(result.response);
          updated_users = result;
        })
        .then(next);
     });
    it("should return one more result when querying all users", function(){
      expect(updated_users.response.length).toBe(all_users.response.length+1);
    });
  })
});
