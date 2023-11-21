import { Request, Response } from "express"
import { gameRepository } from "../repositories/gameRepository"
import { groupRepository } from "../repositories/groupRepository"
import { userRepository } from "../repositories/userRepository"

export class GroupController {
    async listGamesForGroup(req: Request, res: Response) {
        const { id } = req.params
        try {
            const games = await groupRepository.find({
                relations: {
                    user: true,
                    game: true
                },
                order: {
                    favorite: "DESC"
                },
                where: {
                    user: {
                        id: Number(id)
                    }
                }
            })

            return res.json(games)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async listGamesForGroupPaginated(req: Request, res: Response) {
        const { id, page } = req.params

        let pageItens = 0
        if (Number(page) !== 0) {
            pageItens = Number(page) * 4
        }

        try {
            const games = await groupRepository.findAndCount({
                relations: {
                    user: true,
                    game: true
                },
                order: {
                    favorite: "DESC",
                    id: "DESC"
                },
                where: {
                    user: {
                        id: Number(id)
                    }
                },
                skip: pageItens,
                take: 4,
            })

            return res.json(games)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async alterValueFavoriteGroup(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { currentFavorite } = req.body

            await groupRepository.update(Number(id), {
                favorite: currentFavorite
            })
            const group = await groupRepository.findOneBy({ id: Number(id) })
            return res.json(group)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async searchOneGameForId(req: Request, res: Response) {
        try {
            const { id, userId } = req.params 
            const group = await groupRepository.find({
                relations: {
                    game: true
                },
                where: {
                    id: Number(id),
                    user: {
                        id: Number(userId)
                    }
                }
            })

            return res.json(group)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async searchOneGameAllUsersForId(req: Request, res: Response) {
        try {
            const { id } = req.params
            const group = await groupRepository.find({
                relations: {
                    game: true
                },
                where: {
                    id: Number(id),
                }
            })

            return res.json(group)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async searchGroupsGamesMoreTen(req: Request, res: Response) {
        try {
            const { page } = req.params

            let pageItens = 0
            if (Number(page) !== 0) {
                pageItens = Number(page) * 4
            }
            const games = await gameRepository
                .createQueryBuilder("game")
                .leftJoinAndSelect("game.user", "user")
                .leftJoinAndSelect("game.group", "group")
                .where("CAST(game.moneyBet AS DECIMAL) >= :minMoneyBet", { minMoneyBet: 10 })
                .skip(pageItens)
                .take(4)
                .getManyAndCount()

            return res.json(games)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async deleteGroupWithGames(req: Request, res: Response) {
        const {
            id: groupId,
            countTotal,
            idUser
        } = req.params

        try {
            await gameRepository.createQueryBuilder()
                .delete()
                .where('group_id = :groupId', { groupId })
                .execute()
            await groupRepository.delete(groupId)

            const user = await userRepository.findOneBy({ id: Number(idUser) })
            await userRepository.update(idUser, {
                cashier: Number(countTotal) + Number(user?.cashier)
            })
            const userUpdate = await userRepository.findOneBy({ id: Number(idUser) })

            res.status(200).json({ userUpdate })
        } catch (error) {
            console.error('Ocorreu um erro durante a transação:', error)
            res.sendStatus(500)
        }
    }
}