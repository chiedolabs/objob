/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from './src/objob';

describe('Objob', () => {
  let ob1;
  let ob2;
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
      weight: 170,
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

  describe('with', () => {
    it('should return the object only with the given keys', (done) => {
      expect(ob(ob1).with(['name'])).to.deep.equal({name: ob1.name});
      expect(ob(ob2).with(['name', 'age'])).to.deep.equal({name: ob2.name, age: ob2.age});
      done();
    });

    it('should return an array of objects only with the given keys', (done) => {
      expect(ob(obArr1).with(['name'])).to.deep.equal([{name: ob1.name},{name: ob2.name}]);
      done();
    });
  });

  describe('without', () => {
    it('should return the object only without the given keys', (done) => {
      expect(ob(ob1).without(['name'])).to.deep.equal({age: ob1.age, weight: ob1.weight});
      expect(ob(ob2).without(['name', 'age'])).to.deep.equal({weight: ob2.weight, feet: ob2.feet});
      done();
    });

    it('should return an array of objects only without the given keys', (done) => {
      expect(ob(obArr1).without(['name', 'weight', 'feet']))
      .to.deep.equal([{age: ob1.age},{age: ob2.age}]);

      done();
    });
  });
});
