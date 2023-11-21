import { roleMiddleware } from "../middlewares/roleMiddleware"
import { NextFunction, Request, Response } from 'express'

export const middlewareHandler = (roleRoute?: 'public' | 'manager' | 'admin' | 'employee') => (req: Request, res: Response, next: NextFunction) =>
    roleMiddleware({ req, res, next, roleRoute })
