var express    = require('express')
  , bodyParser = require('body-parser')
  , app        = express()
  , userModel  = new model('users')
  , orderModel = new model('orders')
  , migrit     = require('migrit')
  , uuid       = require('node-uuid')
  , _          = require('underscore')
  , env        = (process.argv[2]||'local')
  ;

function model(name){
  this.stash = [];
  this.name  = name;
}


model.prototype.get = function(where){
  var name = this.name;
  if(where && where.id){
    where = " WHERE id = '"+where.id+"'"; 
  }else{
    where = ''
  }
  return migrit.config
    .then(function(conf){
      console.log('env: ', env);
      migrit.sql.connect(conf, env);
      return migrit.sql.query("SELECT * FROM "+name+where)
    })
}

model.prototype.push = function(item){
  var name  = this.name
    , _this = this
    ;
  item.id = uuid.v4();
  return migrit.config
    .then(function(conf){
      migrit.sql.connect(conf, env);
      var sql = "INSERT INTO "+name
        , values = _.values(item)
                    .map(function(i){
                      return("'"+i+"'");
                    }).join(",");
        ;
      sql = sql+"("+_.keys(item).join(",")+")VALUES("+values+")";
      return migrit.sql.query(sql);
    })
    .then(function(){
      return _this.get(item);
    })
    .catch(function(err){
      console.log(err);
    });
}

app.use(bodyParser.json());

app.get('/users', function (req, response) {
  userModel.get()
    .then(function(result){
      response.send(result);
    })
    .catch(function(err){
      console.log(err);
      console.log(err.stack);
    });
})

app.post('/users', function(req, response){
  userModel.push(req.body)
    .then(function(result){
      response.send(result);
    })
})

app.get('/orders', function (req, res) {
  orderModel.get()
    .then(function(result){
      response.send(result);
    })
})

app.post('/orders', function(req, res){
  orderModel.push(req.body)
    .then(function(result){
      response.send(result);
    })
})

var port = env=='local'?3000:3300;
var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
  console.log('Env:', env);

});
