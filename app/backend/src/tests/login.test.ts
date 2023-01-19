import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/user';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Tests for router /login', () => {


  let chaiHttpResponse: Response;
  let tokenSample: string;

  beforeEach(async () => {
    sinon
      .stub(User, "findOne")
      .resolves({
        id: 1,
        username: 'Fake User',
        role: 'admin',
        email: 'fakeuser@gmail.com',
        password: '$2a$12$iZpK6X8meZ.PY6gDT5JzJe1YJhqYPb16XU47aXYfYHVhY1FbdNPS2',
      } as User);
  });

  afterEach(()=>{
    (User.findOne as sinon.SinonStub).restore();
  })

  it('Test if /login route is working', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send({ email: 'fakeuser@gmail.com', password: 'senhafake' })
       
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.have.property('user');
    expect(chaiHttpResponse.body).to.not.have.property('password');
    expect(chaiHttpResponse.body).to.have.property('token');
    // expect(chaiHttpResponse.body.username).to.be.equal('Fake User');
    tokenSample = chaiHttpResponse.body.token;
  });

  it('Test if doesnt login with empty email', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send({ email: '', password: 'senhafake' })

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.have.property('message');
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
  });

  it('Test if route /login/validade works fine', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/login/validate')
       .set('authorization', tokenSample)

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.text).to.be.equal('"admin"');
  });

});
