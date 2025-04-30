import { config } from "../config/config";
import express, { Request, Response } from 'express'
const app = express()
const port = config.app.appExposedPort || 8000

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello, world!',
  })
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})