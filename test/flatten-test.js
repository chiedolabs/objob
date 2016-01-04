/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from '../src/objob';

describe('flatten', () => {
  let ob1, ob2, ob3;
  let arr2, arr1, arr3, arr4;

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

    arr1 = [3, 1];
    arr2 = [ob1, ob2];
    arr3 = [arr2, arr2];
    arr4 = [arr2, arr1];

    done();
  });

  it('should return the flattened object', (done) => {
    expect(ob.flatten(ob3)).to.deep.equal({
      name: 'Bob',
      feet: 5,
      body: {
        feet: {
          toes: 2,
        },
      },
      'body.feet': {toes: 2},
      'body.feet.toes': 2,
      'eyes[]': [{location: 'left', color: 'blue'}, {location: 'right', color: 'red'}],
      'eyes[].0': {location: 'left', color: 'blue'},
      'eyes[].1': {location: 'right', color: 'red'},
      'eyes[].0.location': 'left',
      'eyes[].1.location': 'right',
      'eyes[].0.color': 'blue',
      'eyes[].1.color': 'red',
    });
    expect(ob.flatten(ob1)).to.deep.equal(ob1);

    expect(ob.flatten(arr3)).to.deep.equal({
      '[]0[]': [ { name: 'Bob', age: 22, weight: 170 },{ name: 'Bob', feet: 5, age: 100, weight: 170 } ],
      '[]0[].0': { name: 'Bob', age: 22, weight: 170 },
      '[]0[].0.name': 'Bob',
      '[]0[].0.age': 22,
      '[]0[].0.weight': 170,
      '[]0[].1': { name: 'Bob', feet: 5, age: 100, weight: 170 },
      '[]0[].1.name': 'Bob',
      '[]0[].1.feet': 5,
      '[]0[].1.age': 100,
      '[]0[].1.weight': 170,
      '[]1[]':[ { name: 'Bob', age: 22, weight: 170 }, { name: 'Bob', feet: 5, age: 100, weight: 170 } ],
      '[]1[].0': { name: 'Bob', age: 22, weight: 170 },
      '[]1[].0.name': 'Bob',
      '[]1[].0.age': 22,
      '[]1[].0.weight': 170,
      '[]1[].1': { name: 'Bob', feet: 5, age: 100, weight: 170 },
      '[]1[].1.name': 'Bob',
      '[]1[].1.feet': 5,
      '[]1[].1.age': 100,
      '[]1[].1.weight': 170,
    });
    expect(ob.flatten(arr4)).to.deep.equal({
      '[]0[]': [ { name: 'Bob', age: 22, weight: 170 }, { name: 'Bob', feet: 5, age: 100, weight: 170 } ],
      '[]0[].0': { name: 'Bob', age: 22, weight: 170 },
      '[]0[].0.name': 'Bob',
      '[]0[].0.age': 22,
      '[]0[].0.weight': 170,
      '[]0[].1': { name: 'Bob', feet: 5, age: 100, weight: 170 },
      '[]0[].1.name': 'Bob',
      '[]0[].1.feet': 5,
      '[]0[].1.age': 100,
      '[]0[].1.weight': 170,
      '[]1[]': [ 3, 1 ],
      '[]1[].0': 3,
      '[]1[].1': 1,
    });
    done();
  });
});
