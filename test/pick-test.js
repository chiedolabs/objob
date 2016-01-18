/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from '../src/objob';

describe('pick', () => {
  let ob1, ob2, ob3, ob4;
  let arr2;

  before((done) => {
    ob1 = {
      name: 'Bob',
      age: 22,
      weight: 170,
    };

    ob2 = {
      name: 'Bob',
      feet: 5,
      age: 100,
      weight: 170,
    };

    ob3 = {
      name: 'Bob',
      feet: 5,
      body: {
        feet: {
          toes: 2,
        },
      },
      eyes: [{location: 'left', color: 'blue'}, {location: 'right', color: 'red'}],
    };

    ob4 = {
      id: 'Bob',
      sub_id: 5,
      sub_id_id: 100,
    };

    arr2 = [ob1, ob2];

    done();
  });

  it('should return the object only pick the given keys', (done) => {
    expect(ob.pick(ob1, ['name'])).to.deep.equal({name: ob1.name});
    expect(ob.pick(ob2,['name', 'age'])).to.deep.equal({name: ob2.name, age: ob2.age});
    expect(ob.pick(ob3, ['eyes[].0.location'])).to.deep.equal({
      eyes: [{location: 'left'}],
    });
    expect(ob.pick(ob4,['id'])).to.deep.equal({id: ob4.id});
    expect(ob.pick(ob4,['sub_id'])).to.deep.equal({sub_id: ob4.sub_id});
    done();
  });

  it('should return the object only pick the given keys using nested object', (done) => {
    expect(ob.pick(ob3, ['body.feet'])).to.deep.equal({body: {feet: ob3.body.feet}});
    done();
  });

  it('should return the array only pick the given keys using nested object', (done) => {
    expect(ob.pick([ob3, ob3], ['[]0.body.feet', '[]1.body.feet']))
    .to.deep.equal([{body: {feet: ob3.body.feet}}, {body: {feet: ob3.body.feet}}]);
    done();
  });

  it('should return an array of objects with the given keys', (done) => {
    expect(ob.pick(arr2, ['[]0.name', '[]1.name'])).to.deep.equal([{name: ob1.name},{name: ob2.name}]);
    done();
  });
});
