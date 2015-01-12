var Routest = require('../../routest')
  , expect  = require('../../expect')(Routest.runner)
  , simpleRay = ['a', 'b', 'c']
  , objectRay = [{id: '1', name: 'frank'}, {id:'2', name: 'sally'}]
  ;

expect(simpleRay)
  .n(1).toBe('a')

expect(simpleRay)
  .one().toBe('b')

expect(simpleRay)
  .one().match(/[b]/)

expect(simpleRay)
  .each().match(/[abc]/)

expect(simpleRay)
  .n(1).toBe('a')
  .one().toBe('b')
  .one().match(/[b]/)
  .each().match(/[abc]/)
  .one().match(/[c]/)
  .none().match(/[z]/)
  .and.toBe(simpleRay);

expect(objectRay)
  .each().haveSet('id')

expect(objectRay)
  .one().like({id: '1'})

expect(objectRay)
  .one().like({id: '2'})

expect(objectRay)
  .none().like({id: '3'})

expect(objectRay)
  .each().not.haveSet('other_id');

expect(objectRay)
  .n(2).not.haveSet('other_id');

expect(objectRay)
  .each().not.haveSet('other_id')
  .n(2).not.haveSet('other_id')
  .each().haveSet('id')

expect(objectRay)
  .each().not.haveSet('other_id')
  .each().haveSet('id')
  .n(2).not.haveSet('other_id')
  .one().like({id: '1'})
  .one().not.like({id: '1'})
  .one().like({id: '2'})
  .none().like({id: '3'})
