var Routest = require('routest')
  , expect = Routest.expect
  ;

getUser = setup({
  route:"/user/:id"
  method: "GET"
  fixtures: "default"
})

getUser
  .run({
    id: "user_1"
  })
  .then(function(response, db){
  });

Setup({
    route:"/user/:id"
    method: "GET"
    conditions: {
      id: "user_2"
    }
  })
  .run()
  .then(function(response, db){
  });

Setup({
    route:"/user"
    method: "GET"
  })
  .run()
  .then(function(response, db){
  });



setup({
  route: "/user"
, method: "POST"
})
  .run({
    body: {
            name: "user name"
          , age: 37
          }
  })
  .then(function(response, db){
    expect(response).toBe("{\"success\": \"true\"}");
    db.query("SELECT * FROM USERS")
      .then(function(result){
        expect(result.length).toBe(6);
      });
  });
