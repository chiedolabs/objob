/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from './src/objob';

describe('Objob', () => {
  let ob1, ob2, ob3, ob4, ob5;
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

    ob4 = {
      name: 'Bob',
      feet: 5,
      body: {
        feet: {
          toes: [1,2,10],
          heels: [{number: 1},{number: 7},{number: 8}],
        },
      },
      eyes: [{location: 'left', color: 'blue'}, {location: 'right', color: 'red'}],
    };

    ob5 = {
      name: undefined,
      feet: 5,
      body: {
        feet: {
          toes: [undefined,2,10],
        },
        hair: undefined,
      },
    };

    arr1 = [3, 1];
    arr2 = [ob1, ob2];
    arr3 = [arr2, arr2];
    arr4 = [arr2, arr1];

    done();
  });

  describe('keys', () => {
    it('should return all keys for an object', (done) => {
      expect(ob.keys(ob1)).to.include.members(['name','age', 'weight']);
      done();
    });
    it('should return all keys for an array', (done) => {
      expect(ob.keys(arr2)).to.include.members(['name','age', 'weight','feet']);
      done();
    });
  });

  describe('values', () => {
    it('should return all values for an object', (done) => {
      expect(ob.values(ob1)).to.include.members([ob1.name, ob1.age, ob1.weight]);
      done();
    });
    it('should return all values for an array', (done) => {
      expect(ob.values(arr2)).to.include.members([ob1.name, ob1.age, ob1.weight, ob2.feet]);
      done();
    });
  });

  describe('pick', () => {
    it('should return the object only pick the given keys', (done) => {
      expect(ob.pick(ob1, ['name'])).to.deep.equal({name: ob1.name});
      expect(ob.pick(ob2,['name', 'age'])).to.deep.equal({name: ob2.name, age: ob2.age});
      expect(ob.pick(ob3, ['eyes[].0.location'])).to.deep.equal({
        eyes: [{location: 'left'}],
      });
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

  describe('omit', () => {
    it('should return the object only omit the given keys', (done) => {
      expect(ob.omit(ob1, ['name'])).to.deep.equal({age: ob1.age, weight: ob1.weight});
      expect(ob.omit(ob2, ['name', 'age'])).to.deep.equal({weight: ob2.weight, feet: ob2.feet});

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
      done();
    });

    it('should return an array of objects only omit the given keys', (done) => {
      expect(ob.omit(arr2, ['[]0.name', '[]0.weight', '[]0.feet', '[]1.name', '[]1.weight', '[]1.feet']))
      .to.deep.equal([{age: ob1.age}, {age: ob2.age}]);

      done();
    });
  });

  describe('flatten', () => {
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

  describe('expand', () => {
    it('should return the expanded object', (done) => {
      expect(ob.expand(ob.flatten(ob3))).to.deep.equal(ob3);
      expect(ob.expand(ob.flatten(ob2))).to.deep.equal(ob2);
      expect(ob.expand(ob.flatten(ob4))).to.deep.equal(ob4);
      expect(ob.expand(ob.flatten(arr2))).to.deep.equal(arr2);
      expect(ob.expand(ob.flatten(arr1))).to.deep.equal(arr1);
      expect(ob.expand(ob.flatten(arr3))).to.deep.equal(arr3);
      expect(ob.expand(ob.flatten(arr4))).to.deep.equal(arr4);
      expect(ob.expand(ob.flatten({tmp: arr4}))).to.deep.equal({tmp: arr4});
      done();
    });
  });

  describe('clone', () => {
    it('should return a clone of the object', (done) => {
      expect(ob.clone(ob3)).to.deep.equal(ob3);
      expect(ob.clone(ob3)).to.not.equal(ob3);
      done();
    });
  });

  describe('filter', () => {
    it('should return an object with undefineds filtered out', (done) => {
      expect(ob.filter(ob5, (x) => x !== undefined)).to.deep.equal({
        feet: ob5.feet,
        body: {
          feet: {
            toes: [2,10],
          },
        },
      });

      done();
    });
  });
});
