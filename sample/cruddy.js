var migrit     = require('migrit')
  , uuid       = require('node-uuid')
  , _          = require('underscore')
  ;

function model(name, env){
  this.name  = name;
  this.env   = env;
}


model.prototype.get = function(where){
  var name = this.name
    , env  = this.env
    ;
  if(where && where.id){
    where = " WHERE id = '"+where.id+"'"; 
  }else{
    where = ''
  }
  return migrit.config
    .then(function(conf){
      migrit.sql.connect(conf, env);
      return migrit.sql.query("SELECT * FROM "+name+where)
    })
}

model.prototype.push = function(item){
  var name  = this.name
    , env   = this.env
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

model.prototype.put = function(id, item){
  var name  = this.name
    , env   = this.env
    , _this = this
    ;
  delete item.id
  return migrit.config
    .then(function(conf){
      migrit.sql.connect(conf, env);
      var sql = "UPDATE "+name+" SET "
        , values = _.map(item, function(val, key){
                    return(key+" = '"+val+"'");
                  }).join(",");
        ;
      sql = sql+values+" WHERE id = '"+id+"'";
      return migrit.sql.query(sql);
    })
    .then(function(){
      return _this.get({id: id});
    })
}

model.prototype.delete = function(id){
  var name  = this.name
    , env   = this.env
    ;
  return migrit.config
    .then(function(conf){
      var sql = "DELETE FROM "+name+" WHERE id = '"+id+"'"
      migrit.sql.connect(conf, env);
      return migrit.sql.query(sql);
    })
}

module.exports = model;
