var Routest = require('../../routest')
  , db      = Routest.fixtures()
  , expect  = Routest.expect
  ;


Routest
  .setup('sample-app.json'
  , {
      path: "users"
    , method: "POST"
    }
  )
  .run({
    body: {
      first: "new"
    , last: "user"
    }
  })
  .then(function(response){
    return db.query("SELECT * FROM users")
      .then(function(result){
        console.log(result);
        //expect(result.length).toBe(6);
      });
  })
  .then(Routest.end);

