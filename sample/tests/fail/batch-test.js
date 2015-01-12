var Routest = require('../../../routest')
  , expect  = require('../../../expect')(Routest.runner)
  , simpleRay = ['a', 'b', 'c']
  , objectRay = [{id: '1', name: 'frank'}, {id:'2', name: 'sally'}]
  ;

expect(simpleRay)
  .n(1).toBe('d')

expect(simpleRay)
  .one().toBe('e')

expect(simpleRay)
  .one().match(/[e]/)

expect(simpleRay)
  .each().match(/[def]/)

expect(simpleRay)
  .n(1).toBe('d')
  .one().toBe('e')
  .one().match(/[e]/)
  .each().match(/[def]/)
  .one().match(/[f]/)
  .none().match(/[a]/)
  .and.not.toBe(simpleRay);

expect(objectRay)
  .each().not.to.haveSet('id')

expect(objectRay)
  .none().like({id: '1'})

expect(objectRay)
  .none().like({id: '2'})

expect(objectRay)
  .one().like({id: '3'})

expect(objectRay)
  .each().haveSet('other_id');

expect(objectRay)
  .n(2).haveSet('other_id');

expect(objectRay)
  .each().haveSet('other_id')
  .n(2).haveSet('other_id')
  .each().not.haveSet('id')

expect(objectRay)
  .each().haveSet('other_id')
  .each().not.haveSet('id')
  .n(2).haveSet('other_id')
  .none().like({id: '1'})
  .none().not.like({id: '1'})
  .none().like({id: '2'})
  .one().like({id: '3'})
