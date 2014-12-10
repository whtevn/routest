var Routest = require('../../routest')
  , db      = Routest.fixtures()
  , expect  = Routest.expect
  ;


Routest
  .setup('sample-app.json'
  , {
      path: "users"
    , method: "GET"
    }
  )
  .run()
  .then(function(response){
    var body = JSON.parse(response.body);
      ;
    return db.query("SELECT * FROM users")
      .then(function(result){
        expect(body.length).toBe(result.length);
        body.forEach(function(user){
          expect(user).toBeIn(result);
        })
      })
  })
  .then(Routest.end);

