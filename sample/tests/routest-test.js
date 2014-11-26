var Routest = require('../../routest')
  , test
  ;

Routest
  .setup('pinwheel-galaxy.json'
  , {
      path: "user"
    , method: "POST"
    }
  )
  .run({
    body: {
      name: "user name"
    , age: 37
    }
  })
  .then(function(response, db){
    console.log(response);
    console.log(db);
    expect(response).toBe("{\"success\": \"true\"}");
    db.query("SELECT * FROM USERS")
      .then(function(result){
        expect(result.length).toBe(6);
      });
  })
  // setup is what runs the database reset
  // if rolling tests are desired, store the result of 
  // `setup` and then `run` that variable several times
  // with whatever inputs you like

      
