
import {dbSettings, serverSettings}  from './config'
import * as db from './mongoose'

export const CONFIG = Object.assign({}, {dbSettings, serverSettings, db})
