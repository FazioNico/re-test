import * as mongoose from "mongoose";
import { userSchema, IUserModel } from "./repository.model";

interface IRepository {
  getAll:()=> Promise<any>,
  getById:()=> Promise<any>,
  disconnect:()=> any
}
const repository = (db:mongoose.Mongoose):IRepository => {
  // Define & export Mongoose Model with Interface
  const collection:mongoose.Model<IUserModel> = db.model('users', userSchema);

  const getAll = () => {
    return new Promise((resolve, reject) => {
      collection.find((err, docs:IUserModel[]) => {
  			if(err)  {
          reject(new Error('An error occured fetching all datas, err:' + err))
        };
        // remove password user from datas
        let docsReady = docs.map((user)=>{
          return {
            _id: user._id,
            email: user.email,
            admin: user.admin
          }
        })
        resolve({users:docsReady})
  		});
    })
  }

  const getById = (id) => {
    return new Promise((resolve, reject) => {
      collection.findById(id, (err, doc:IUserModel) => {
        if(err) {
          reject(new Error(`An error occured fetching a data with id: ${id}, err: ${err}`))
        };
        doc.password = null;
        resolve({user:doc});
      })
    })
  }

  const disconnect = () => {
    console.log('--- Mongoose connection close() ---')
    // TODO: close db.connection
    //return db.close()
  }

  return Object.create({
    getAll,
    getById,
    disconnect
  })
}

export const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('connection db not supplied!'))
    }
    resolve(repository(connection))
  })
}
