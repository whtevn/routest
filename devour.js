var fs = require('q-io/fs')
  , _  = require('underscore')
  , colors = require('colors')
  , starting_directory
  ;

function listDirectory(dir){
  starting_directory = dir;
  return fs.listTree(dir)
    .then(function(list){
      list = _.reject(list, function(item){
        return item.match(/(^|\/)\./);
      })
      return eatAndRun(list);
    })
}

function eatAndRun(list){
  var item = list.shift();
  var report = [];
  return item && fs.isFile(item)
    .then(function(is_file){
      if(item && is_file && !item.match(/(\/|^)\./) && item.match(/test.js$/)){
        var cwd = '.'+item.replace(process.cwd(), '');
        console.log('\n', '\t', 'running'.magenta, cwd.yellow);
        return require(item)
      }
    })
    .then(function(item){
      return eatAndRun(list);
    })
    .catch(function(err){
      console.log(err);
    })
}

module.exports = listDirectory;

