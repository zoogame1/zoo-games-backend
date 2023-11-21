import { Request, Response } from 'express'
import { BadRequestError } from '../helpers/api-erros'
import { userRepository } from '../repositories/userRepository'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Like, getConnection } from 'typeorm'
import { gameRepository } from '../repositories/gameRepository'
import { groupRepository } from '../repositories/groupRepository'

export class UserController {
    async create(req: Request, res: Response) {
        const { name, email, password, cashier } = req.body

        const userExists = await userRepository.findOneBy({ email })

        if (userExists) {
            throw new BadRequestError('E-mail já existe')
        }

        const userNameExist = await userRepository.findOneBy({ name })


        if (userNameExist) {
            throw new BadRequestError('Username já está sendo usado')
        }

        if (!!name == false || !!email == false || !!password == false) {
            throw new BadRequestError('Preencha corretamente os campos!')
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = userRepository.create({
            name,
            email,
            password: hashPassword,
            cashier: cashier ?? 5000
        })

        await userRepository.save(newUser)

        const { password: _, ...user } = newUser

        return res.status(201).json(user)
    }

    async delete(req: Request, res: Response) { 
        const { id } = req.params 
        let userDeleted
        try {
            await gameRepository.delete({ user: {
                id: Number(id)
            } });
            await groupRepository.delete({ user: {
                id: Number(id)
            } });
            
            userDeleted = await userRepository.delete(Number(id))
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        } 

        return res.status(201).json(userDeleted)
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body
        let user
        user = await userRepository.findOneBy({ email })

        if (!user) {
            user = await userRepository.findOneBy({ name: email })
        }

        if (!user) {
            throw new BadRequestError('E-mail ou senha inválidos')
        }

        const verifyPass = await bcrypt.compare(password, user.password)

        if (!verifyPass) {
            throw new BadRequestError('E-mail ou senha inválidos')
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? '', {
            expiresIn: '8h',
        })

        const { password: _, ...userLogin } = user

        return res.json({
            user: userLogin,
            token: token,
        })
    }

    async getProfile(req: Request, res: Response) {
        return res.json(req.user)
    }

    async updateMoneyProfile(req: Request, res: Response) {
        const { newCash } = req.body
        const { id } = req.params
        const userCash = await userRepository.update(id, {
            cashier: newCash
        })

        return res.status(201).json({ userCash })
    }

    async updateRoleUser(req: Request, res: Response) {
        const { newRole } = req.body
        const { id } = req.params
        const user = await userRepository.update(id, {
            role: newRole
        })
        return res.status(201).json({ user })
    }

    async listAllUsers(req: Request, res: Response) {
        const { page } = req.params

        let pageItens = 0
        if (Number(page) !== 0 ){
            pageItens = Number(page) * 4
        }

        const users = await userRepository.findAndCount(
            {
                order: {
                    id: 'ASC'
                },
                skip: pageItens,
                take: 4,
            }
        )
        return res.status(201).json({ users })
    }

    async listAllUsersByName(req: Request, res: Response) {
        const { name } = req.params
        const users = await userRepository.findAndCount(
            {
                where: {
                    name: Like(`%${name}%`)
                },
                order: {
                    id: 'ASC'
                }
            }
        )
        return res.status(201).json({ users })
    }
}

