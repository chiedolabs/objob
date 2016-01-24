/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from '../src/objob';

describe('omit', () => {
  let ob1, ob2, ob3, ob4, ob5;
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
      'id': { description: 'The id', example: '5634d4760066be016bf10c09'},
      'name': { description: 'The name', example: 'Jane Doe'},
      'email':{
        description:'Email address',
        example: () => {
          return faker.internet.email();
        },
      },
      'username': { description: 'The username', example: 'janedoe'},
      'password': { description: 'The password', example: 'testtest'},
      'date_created': { description: 'Date created', example: '2015-10-31T14:47:18.000Z'},
      'date_modified': { description: 'Date modified', example: '2015-10-31T14:47:18.000Z'},
    };

    ob5 = {
      'my_key': 'foo',
      'keeper': 'bar',
      'my_key_keeper': 'baz',
    };

    arr2 = [ob1, ob2];

    done();
  });

  it('should return the object only omit the given keys', (done) => {
    expect(ob.omit(ob1, ['name'])).to.deep.equal({age: ob1.age, weight: ob1.weight});
    expect(ob.omit(ob2, ['name', 'age'])).to.deep.equal({weight: ob2.weight, feet: ob2.feet});
    expect(Object.keys(ob.omit(ob4, ['date_modified', 'date_created'])))
    .to.deep.equal(['id','name','email','username','password']);

    expect(ob.omit(ob3, ['eyes[].0.location'])).to.deep.equal({
      name: ob3.name,
      feet: ob3.feet,
      body: {
        feet: {
          toes: ob3.body.feet.toes,
        },
      },
      eyes: [{color: 'blue'}, ob3.eyes[1]],
    });

    expect(ob.omit(ob5, ['my_key'])).to.deep.equal({my_key_keeper: ob5.my_key_keeper, keeper: ob5.keeper});
    done();
  });

  it('should return an array of objects only omit the given keys', (done) => {
    expect(ob.omit(arr2, ['[]0.name', '[]0.weight', '[]0.feet', '[]1.name', '[]1.weight', '[]1.feet']))
    .to.deep.equal([{age: ob1.age}, {age: ob2.age}]);

    done();
  });
});
