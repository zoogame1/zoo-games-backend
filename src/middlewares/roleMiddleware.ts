import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ForbiddenError, UnauthorizedError } from '../helpers/api-erros'
import { userRepository } from '../repositories/userRepository'
import { UserProps } from '../types/User.types'

interface RoleMiddlewareTypes {
    req: Request,
    res: Response,
    next: NextFunction,
    roleRoute?: 'public' | 'manager' | 'admin' | 'employee';
}

export const roleMiddleware = async ({ req, res, next, roleRoute = "public" }: RoleMiddlewareTypes) => {
    const { authorization } = req.headers
    if (!authorization) {
        throw new UnauthorizedError('Não autorizado')
    }
    const token = authorization.split(' ')[1]
    const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload
    const user = await userRepository.findOneBy({ id }) as UserProps | null

    if (user) {
        const { role: roleUser } = user

        if (roleRoute == 'employee' && !['manager', 'admin', 'employee'].includes(roleUser)) {

            throw new ForbiddenError('Permissões insuficientes para esta requisição')
        }

        if (roleRoute == 'manager' && !['manager', 'admin'].includes(roleUser)) {
            throw new ForbiddenError('Permissões insuficientes para esta requisição')
        }

        if (roleRoute == 'admin' && roleUser !== 'admin') {
            throw new ForbiddenError('Permissões insuficientes para esta requisição')
        }

        next()
    }
}
