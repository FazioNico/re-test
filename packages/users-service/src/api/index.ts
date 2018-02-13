import * as express from 'express'

export const apiRoutes = async (app:express.Application, options)=> {
  const {repo} = options;

  await app.get('/users', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    await repo.getAll()
      .then(users => {
        res.status(200).json(users)
      })
      .catch(next)
  })

  await app.get('/users/:id', async(req:express.Request, res:express.Response, next:express.NextFunction) => {
    await repo.getById(req.params.id)
      .then(movie => {
        res.status(200).json(movie)
      })
      .catch(next)
  })
}
