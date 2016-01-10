/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import { makeFlattenedShallow } from '../src/functions';

describe('make flattened shallow', () => {
  let ob1;

  before((done) => {
    ob1 = {
      'paths': { 'posts': {content: 'Hello', random: 4}, 'posts/:id': {}},
      'paths.posts': { content: 'Hello', random: 4},
      'paths.posts.random': 4,
      'paths.posts.content': 'Hello',
      'paths.posts/:id': {},
    };
    done();
  });

  it('should return the shallow version of the flattened object', (done) => {
    expect(makeFlattenedShallow(ob1)).to.deep.equal({
      'paths.posts.random': 4,
      'paths.posts.content': 'Hello',
      'paths.posts/:id': {},
    });
    done();
  });
});
