import * as express from 'express'
import * as morgan from 'morgan';
import { EventEmitter } from 'events';

import * as server  from "./server"
import * as repository from "./repository";
import { CONFIG } from "./config";

const mediator:EventEmitter = new EventEmitter()

// process.setMaxListeners(5)

console.log('--- Users Service ---')
console.log('Connecting to users repository...')

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err)
})

// process.on('uncaughtRejection', (err, promise) => {
//   console.error('Unhandled Rejection', err)
// })

// listen event on db ready
mediator.on('db.ready', (db) => {
  let rep;
  // DI to conect repository with database
  repository.connect(db)
    .then(repo => {
      console.log('--- Repository connected to database ---')
      console.log('--- Starting Server ---')
      rep = repo
      return server.start({
        port: CONFIG.serverSettings.port,
        repo
      })
    })
    .then(config => {
      console.log(`Server started succesfully, running on port: ${CONFIG.serverSettings.port}  🎉`)
      console.log(`Available routes: `,config.routes.map(r =>r.path))
      console.log(`NODE_ENV: ${CONFIG.serverSettings.env_name}`)

      // emite microserviceConfig to the API Getway to remove all routes availables
      config.server.on('close', () => {
        console.log(`Removed routes: `,config.routes.map(r =>r.path))
        rep.disconnect()
        // TODO: request POST to API Gateway with removed routes
        // {
        //   hostName:'',
        //   port: CONFIG.serverSettings.port,
        //   routes:config.routes
        // }
      });
      return {
        hostName:'',
        port: CONFIG.serverSettings.port,
        routes:config.routes
      }
    })
    .then(microserviceConfig => {
      // emite microserviceConfig to the API Getway to register all new availables route 
      // TODO: request POST to API Gateway with new availables routes

    })
    .catch(err => {
      console.log('[ERROR] ', err)
    });
})
// catch db error with events
mediator.on('db.error', (err) => {
  console.error(err)
})

// setting up database configuration.
CONFIG.db.connect(CONFIG.dbSettings, mediator)
// Server body ready... emit event to connect database with repository
mediator.emit('boot.ready')
