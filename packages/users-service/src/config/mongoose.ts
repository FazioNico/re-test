
import * as mongoose from "mongoose";

const db = mongoose;

const getMongoURL = (options) => {
  const url = options.servers
  .reduce((prev, cur) => prev + cur + ',', 'mongodb://');
  return `${url.substr(0, url.length - 1)}/${options.db}`
}

export const connect = (options, mediator) => {
  // server body ready... let's try to connect to database.
  mediator.once('boot.ready', () => {

    db.connect(getMongoURL(options), {poolSize: 3 });
    db.connection.on('connected', ()=>{
      console.log("Mongoose default connection is open to ", getMongoURL(options));
      // database is connected and ready. Emit an event to notifier server app.
      mediator.emit('db.ready', db)
    });
    db.connection.on('error', (err)=>{
      console.log("Mongoose default connection has occured "+err+" error");
      mediator.emit('db.error', err)
    });
    db.connection.on('disconnected', ()=>{
      console.log("Mongoose default connection is disconnected");
    });
    process.on('SIGINT', ()=>{
      db.connection.close(()=>{
        console.log("Mongoose default connection is disconnected due to application termination");
        process.exit(0);
      });
    });
  })
}
