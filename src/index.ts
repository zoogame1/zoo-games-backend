import 'express-async-errors'
import express from 'express'
import { AppDataSource } from './data-source'
import { errorMiddleware } from './middlewares/error'
import routes from './routes'
import cors from 'cors'
import { runTaskBlackList } from './util/taskBlackList'
import { runTaskFinancialReports } from './util/taskFinancial'


AppDataSource.initialize().then(() => {
    const app = express()

    console.log(process.env.PORT)

    app.use(express.json())

    app.use(cors({
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
        origin: '*',
        credentials: true,
        allowedHeaders: '*'
    }))

    app.use(routes)
    app.use(errorMiddleware)

    runTaskBlackList()
    runTaskFinancialReports()
    return app.listen(process.env.PORT ?? 3000)
})
