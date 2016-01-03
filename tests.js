/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from './src/objob';

describe('Objob', () => {
  let ob1, ob2, ob3, ob4;
  let obArr1;

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

    obArr1 = [ob1, ob2];

    done();
  });

  describe('keys', () => {
    it('should return all keys for an object', (done) => {
      expect(ob.keys(ob1)).to.include.members(['name','age', 'weight']);
      done();
    });
    it('should return all keys for an array', (done) => {
      expect(ob.keys(obArr1)).to.include.members(['name','age', 'weight','feet']);
      done();
    });
  });

  describe('values', () => {
    it('should return all values for an object', (done) => {
      expect(ob.values(ob1)).to.include.members([ob1.name, ob1.age, ob1.weight]);
      done();
    });
    it('should return all values for an array', (done) => {
      expect(ob.values(obArr1)).to.include.members([ob1.name, ob1.age, ob1.weight, ob2.feet]);
      done();
    });
  });

  describe('select', () => {
    it('should return the object only select the given keys', (done) => {
      expect(ob.select(ob1, ['name'])).to.deep.equal({name: ob1.name});
      expect(ob.select(ob2,['name', 'age'])).to.deep.equal({name: ob2.name, age: ob2.age});
      expect(ob.select(ob3, ['eyes[].0.location'])).to.deep.equal({
        eyes: [{location: 'left'}],
      });
      done();
    });

    it('should return the object only select the given keys using nested object', (done) => {
      expect(ob.select(ob3, ['body.feet'])).to.deep.equal({body: {feet: ob3.body.feet}});
      done();
    });

    it('should return the array only select the given keys using nested object', (done) => {
      expect(ob.select([ob3, ob3], ['body.feet']))
      .to.deep.equal([{body: {feet: ob3.body.feet}}, {body: {feet: ob3.body.feet}}]);
      done();
    });

    it('should return an array of objects only select the given keys', (done) => {
      expect(ob.select(obArr1, ['name'])).to.deep.equal([{name: ob1.name},{name: ob2.name}]);
      done();
    });
  });

  describe('deselect', () => {
    it('should return the object only deselect the given keys', (done) => {
      expect(ob.deselect(ob1, ['name'])).to.deep.equal({age: ob1.age, weight: ob1.weight});
      expect(ob.deselect(ob2, ['name', 'age'])).to.deep.equal({weight: ob2.weight, feet: ob2.feet});
      done();

      expect(ob.deselect(ob3, ['eyes[].0.location'])).to.deep.equal({
        name: ob3.name,
        feet: ob3.feet,
        body: {
          feet: {
            toes: ob3.body.feet.toes,
          },
        },
        eyes: [{color: 'blue'}, ob3.eyes[1]],
      });
    });

    it('should return an array of objects only deselect the given keys', (done) => {
      expect(ob.deselect(obArr1, ['name', 'weight', 'feet']))
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
      done();
    });
  });

  describe('expand', () => {
    it('should return the expanded object', (done) => {
      expect(ob.expand(ob.flatten(ob3))).to.deep.equal(ob3);
      expect(ob.expand(ob.flatten(ob2))).to.deep.equal(ob2);
      expect(ob.expand(ob.flatten(ob4))).to.deep.equal(ob4);
      expect(ob.expand(ob.flatten(obArr1))).to.deep.equal(obArr1);
      done();
    });
  });

  describe('clone deep', () => {
    it('should return a clone of the object', (done) => {
      expect(ob.cloneDeep(ob3)).to.deep.equal(ob3);
      expect(ob.cloneDeep(ob3)).to.not.equal(ob3);
      done();
    });
  });
});
