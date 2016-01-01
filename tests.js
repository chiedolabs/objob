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
      expect(ob(ob1).keys()).to.include.members(['name','age', 'weight']);
      done();
    });
    it('should return all keys for an array', (done) => {
      expect(ob(obArr1).keys()).to.include.members(['name','age', 'weight','feet']);
      done();
    });
  });

  describe('values', () => {
    it('should return all values for an object', (done) => {
      expect(ob(ob1).values()).to.include.members([ob1.name, ob1.age, ob1.weight]);
      done();
    });
    it('should return all values for an array', (done) => {
      expect(ob(obArr1).values()).to.include.members([ob1.name, ob1.age, ob1.weight, ob2.feet]);
      done();
    });
  });

  describe('many', () => {
    it('should return the correct number of objects', (done) => {
      expect(ob(ob1).many()).to.deep.equal([ob1,ob1]);
      expect(ob(ob1).many(5)).to.deep.equal([ob1,ob1,ob1,ob1,ob1]);
      done();
    });

    it('should return the array if an array', (done) => {
      expect(ob(obArr1).many()).to.equal(obArr1);
      done();
    });
  });

  describe('select', () => {
    it('should return the object only select the given keys', (done) => {
      expect(ob(ob1).select(['name'])).to.deep.equal({name: ob1.name});
      expect(ob(ob2).select(['name', 'age'])).to.deep.equal({name: ob2.name, age: ob2.age});
      expect(ob(ob3).select(['eyes[].0.location'])).to.deep.equal({
        eyes: [{location: 'left'}],
      });
      done();
    });

    it('should return the object only select the given keys using nested object', (done) => {
      expect(ob(ob3).select(['body.feet'])).to.deep.equal({body: {feet: ob3.body.feet}});
      done();
    });

    it('should return the array only select the given keys using nested object', (done) => {
      expect(ob([ob3, ob3]).select(['body.feet']))
      .to.deep.equal([{body: {feet: ob3.body.feet}}, {body: {feet: ob3.body.feet}}]);
      done();
    });

    it('should return an array of objects only select the given keys', (done) => {
      expect(ob(obArr1).select(['name'])).to.deep.equal([{name: ob1.name},{name: ob2.name}]);
      done();
    });
  });

  describe('deselect', () => {
    it('should return the object only deselect the given keys', (done) => {
      expect(ob(ob1).deselect(['name'])).to.deep.equal({age: ob1.age, weight: ob1.weight});
      expect(ob(ob2).deselect(['name', 'age'])).to.deep.equal({weight: ob2.weight, feet: ob2.feet});
      done();

      expect(ob(ob3).deselect(['eyes[].0.location'])).to.deep.equal({
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
      expect(ob(obArr1).deselect(['name', 'weight', 'feet']))
      .to.deep.equal([{age: ob1.age}, {age: ob2.age}]);

      done();
    });
  });

  describe('flatten', () => {
    it('should return the flattened object', (done) => {
      expect(ob(ob3).flatten()).to.deep.equal({
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
      expect(ob(ob1).flatten()).to.deep.equal(ob1);
      done();
    });
  });

  describe('expand', () => {
    it('should return the expanded object', (done) => {
      expect(ob(ob(ob3).flatten()).expand()).to.deep.equal(ob3);
      expect(ob(ob(ob2).flatten()).expand()).to.deep.equal(ob2);
      expect(ob(ob(ob4).flatten()).expand()).to.deep.equal(ob4);
      expect(ob(ob(obArr1).flatten()).expand()).to.deep.equal(obArr1);
      done();
    });
  });

  describe('Chaining', () => {
    it('should return many of an object after filtering select select', (done) => {
      expect(ob(ob(ob1).select(['name', 'age'])).many(3))
      .to.deep.equal([
        {age: ob1.age, name: ob1.name},
        {age: ob1.age, name: ob1.name},
        {age: ob1.age, name: ob1.name},
      ]);
      done();
    });
  });
});
