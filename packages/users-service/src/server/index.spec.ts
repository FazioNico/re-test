
import {} from 'mocha';
import * as chai from 'chai'
const expect = chai.expect;

import { start }from "./";

describe("[Server] Express Start", () => {

  it("Should require a port to start", () => {
    return start({
      repo:{}
    })
    .catch((err:Error)=> {
      expect(err.message).to.eql('The server must be started with an available port')
    })
  });

  it("Should require a repo to start", () => {
    return start({
      port:3000
    })
    .catch((err:Error)=> {
      expect(err.message).to.eql('The server must be started with a connected repository')
    })
  });

});
