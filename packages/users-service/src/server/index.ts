import * as express from 'express'
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as path from 'path';
import { apiRoutes } from "../api";

interface IRoute {
  path:string,methods:string[]
}

export const start = (options):Promise<{server:any,routes:IRoute[]}> => {
  return new Promise((resolve, reject) => {
    if (!options.repo) {
      reject(new Error('The server must be started with a connected repository'))
    }
    if (!options.port) {
      reject(new Error('The server must be started with an available port'))
    }

    const app:express.Application = express()
      .disable('x-powered-by')
      .use((!!process.env.NODE_ENV && process.env.NODE_ENV === 'test')
          ? (req,res,next)=> next()
          : morgan('dev')
      )
      .use(helmet())

      .use(express.static(path.join(__dirname, '../api')))
      .get( '/', (req, res) => {
        //res.status(200).send('Welcome!')
        res.json({code:200,message: `---Welcome to Users Microservice REST API 🎉`});
      })
      .use((err, req, res, next) =>{
        reject(new Error('Something went wrong!, err:' + err))
        console.log(new Error('Something went wrong!, err:' + err))
        res.status(500).send('Something went wrong!')
        //res.status(500).json({code:500, data:err, message:'Error Server'});
      });
    apiRoutes(app, options);

    const routes:IRoute[] = app._router.stack
        .filter((middleware) => middleware.route)
        .map((middleware) =>
          Object.assign({}, {methods:Object.keys(middleware.route.methods), path:middleware.route.path})
        )
    const server = app.listen(options.port, () => resolve({server, routes}))
  })
}
