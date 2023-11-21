import { Request, Response } from "express"
import { gameRepository } from "../repositories/gameRepository"
import { userRepository } from "../repositories/userRepository"
import { groupRepository } from "../repositories/groupRepository"
import { In } from "typeorm"
import { blackListRepository } from "../repositories/blackListRepository"

export class GameController {
    async create(req: Request, res: Response) {
        const {
            numberBet,
            dateBet,
            moneyBet,
            timeBet,
            modality
        } = req.body
        const { idUser } = req.params

        if (!idUser) {
            return res.status(400).json({ message: 'O nome é obrigatório' })
        }

        try {
            const user = await userRepository.findOneBy({ id: Number(idUser) })

            if (!user) {
                return res.status(404).json({ message: 'Usuário não existe' })
            }

            const newGame = gameRepository.create({
                user,
                numberBet,
                dateBet,
                moneyBet,
                timeBet,
                modality
            })
            await gameRepository.save(newGame)
            return res.status(201).json(newGame)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async multipleCreate(req: Request, res: Response) {
        let userCash
        const { idUser } = req.params
        const justTwo = req.body.dataBody.justTwo
        const data = req.body.dataBody
        const valueTotalBet = data.countTotal
        const hours = data.multipleDatesIndex.map((item: number | string) => {
            switch (item) {
            case 0:
                return '11:00:00'
            case 1:
                return '14:00:00'
            case 2:
                return '16:00:00'
            case 3:
                return '18:00:00'
            case 4:
                return '21:00:00'
            }
        })

        const days = Object.keys(data.dataTimeMarked).map((item) => {
            return item
        })

        const user = await userRepository.findOneBy({ id: Number(idUser) })

        if (!!user?.cashier) {
            if ((Number(user.cashier) - Number(valueTotalBet)) < 0) {
                console.log('tá chegando na verificação')
                return res.status(404).json({ message: 'Saldo insuficiente' })
            }
            userCash = await userRepository.update(user.id, {
                cashier: Number(user?.cashier) - Number(valueTotalBet)
            })
        }

        if (!user) {
            return res.status(404).json({ message: 'Usuário não existe' })
        }

        for (const childBody of data.allDataBody) {
            let numbers = childBody.number.split(/,|-| /).join('.').split('.')
            let message = ''

            const hasUndefinedNumbers = numbers.some((e: string) => !e)
            if (hasUndefinedNumbers) {
                message = 'confira os nomes que está jogando!'
            }

            if (justTwo == false) {
                const invalidLessValidNumbers = numbers.filter((e: string) => e.length < 3)
                if (invalidLessValidNumbers.length) {
                    message = 'Dezenas devem ser jogadas em sua respectiva tela!'
                }

                const invalidMoreValidNumbers = numbers.filter((e: string) => e.length > 4)
                if (invalidMoreValidNumbers.length) {
                    message = 'Somente numeros até 4 algarismos são permitidos'
                }
            }

            if (justTwo == true) {
                const invalidLessValidNumbers = numbers.filter((e: string) => e.length > 2)
                if (invalidLessValidNumbers.length) {
                    message = 'Centenas e Milhares devem ser jogadas em sua respectiva tela!'
                }
            }

            for (const currentElementFather of childBody.fatherArrModalAndValue) {
                if (currentElementFather.selected.length <= 0) {
                    message = 'Modalidade não preenchida encontrada - Verifique suas informação'
                }
            }

            for (const number of numbers) {
                for (const day of days) {
                    for (const hour of hours) {
                        const existingRecordBlackList = await blackListRepository.findOne(
                            {
                                where: {
                                    numberBet: number,
                                    dateBet: day,
                                    timeBet: hour
                                }
                            }
                        )
                        if (!!existingRecordBlackList) {
                            message = `O numero ${number} não está disponivel para jogo`
                        }
                    }
                }
            }

            if (message) {
                return res.status(400).json({ message })
            }
        }

        const newGroup = groupRepository.create({
            user,
            // eslint-disable-next-line camelcase
            total_price: valueTotalBet,
            note: data.note,
            squema: req.body.dataBody
        })

        const groupCurrent = await groupRepository.save(newGroup)

        try {
            for (const day of days) {
                for (const hora of hours) {
                    for (const childBody of data.allDataBody) {
                        let numbers = childBody.number.split(/,|-| /).join('.').split('.')
                        for (const item of childBody.fatherArrModalAndValue) {
                            let value = item.value
                            let categories = item.selected
                            for (const number of numbers) {
                                try {
                                    for (const cat of categories) {
                                        console.log('/////////////////////// Iniciando envio do jogo... //////////////////////////')
                                        const newGame = gameRepository.create({
                                            user,
                                            group: groupCurrent,
                                            numberBet: number,
                                            dateBet: day,
                                            moneyBet: value,
                                            timeBet: hora,
                                            modality: cat
                                        })
                                        await gameRepository.save(newGame)
                                        console.log('//////////////////////Game enviado///////////////////////////')
                                    }
                                } catch (err) {
                                    return res.status(400).json({ message: `sem saldo no numero: ${number}` })
                                }
                            }
                        }
                    }
                }
            }
            return res.status(200).json({ message: 'enviado', saved: { group: groupCurrent } })
        } catch (err: any) {
            return res.status(500).json({ message: err.detail })
        }
    }

    async list(req: Request, res: Response) {
        try {
            const games = await gameRepository.find({
                relations: {
                    user: true
                }
            })
            return res.json(games)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async findWinnersValidation(req: Request, res: Response) {
        const {
            numberBet,
            dateBet,
            timeBet,
            modality
        } = req.body
        try {
            const games = await gameRepository.find({
                where: {
                    numberBet,
                    dateBet,
                    timeBet,
                    modality
                },
                relations: {
                    user: true
                }
            })
            return res.json(games)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async findWinners(req: Request, res: Response) {
        try {
            const winners = await gameRepository.find({
                where: {
                    winner: true
                },
                relations: {
                    user: true
                }
            })
            return res.json(winners)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async updateWinners(req: Request, res: Response) {
        const {
            numberBet,
            dateBet,
            timeBet,
            modality
        } = req.body

        try {
            const winners = await gameRepository.find({
                where: {
                    numberBet,
                    dateBet,
                    timeBet,
                    modality
                },
                relations: {
                    user: true
                }
            })

            winners.forEach(async (e) => {
                await gameRepository.update(e.id, {
                    winner: true
                })
            })

            return res.json(winners)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async findOne(req: Request, res: Response) {
        const { id } = req.params
        try {
            const game = await gameRepository.findOne({
                where: { id: Number(id) },
                relations: {
                    user: true
                }
            })
            return res.json(game)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: 'O nome é obrigatório' })
        }

        try {
            await gameRepository.delete(id)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }

        return res.status(200).json("Usuário deletado com sucesso")
    }

    async update(req: Request, res: Response) {
        const {
            idUser,
            numberBet,
            dateBet,
            moneyBet,
            timeBet,
            modality
        } = req.body
        const { id } = req.params

        if (!idUser) {
            return res.status(400).json({ message: 'O nome é obrigatório' })
        }

        try {
            const user = await userRepository.findOneBy({ id: Number(idUser) })

            if (!user) {
                return res.status(404).json({ message: 'Usuário não existe' })
            }

            await gameRepository.update(id, {
                user,
                numberBet,
                dateBet,
                moneyBet,
                timeBet,
                modality
            })

            return res.status(200).json("Alterado com sucesso")

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async searchAllGamesForUser(req: Request, res: Response) {
        try {
            let userId = req.user.id

            const games = await gameRepository.find({
                relations: {
                    user: true,
                    group: true
                },
                where: {
                    user: {
                        id: userId,
                    },
                },
                order: {
                    dateBet: "DESC"
                }
            })

            let gamesRefactor = [...new Set(games.map(x => x.dateBet))].map(x => {
                return {
                    item: {
                        dataBet: games.filter(d => d.dateBet == x).map(u => u.dateBet),
                        gameUser: games.filter(d => d.dateBet == x).map(u => u)
                    }
                }
            })

            return res.json(gamesRefactor)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async queryReportNumberValue(req: Request, res: Response) {
        const { hour, date, category } = req.body

        try {
            const games = await gameRepository.find({
                where: {
                    timeBet: hour,
                    dateBet: date,
                    modality: In([...category]) // category[0]
                }, order: {
                    dateBet: 'ASC'
                }
            })


            let totalBetNumber: any = games.map((e) => { return Number(e.moneyBet) })
            const valueTotal = totalBetNumber.reduce((soma: any, i: any) => {
                return soma + i
            })

            const perNumber = games.map((elemento: any) => {
                return {
                    name: elemento.numberBet,
                    price: Number(elemento.moneyBet),
                    modality: elemento.modality
                }
            })

            const numbeAndValueReduced_ = perNumber.reduce((soma: any, cur: any) => {
                let name = cur.name
                let modality = cur.modality

                let repetido = soma.find((elem: { name: any, modality: any }) => elem.name === name && elem.modality === modality)

                if (repetido) repetido.price += cur.price
                else soma.push(cur)
                return soma
            }, [])

            numbeAndValueReduced_.sort((a: any, b: any) => b.price - a.price)

            return res.json({
                valueTotal,
                games,
                numbeAndValueReduced_
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async queryModaly1(req: Request, res: Response) {
        const { hour, date, category, number } = req.body

        try {
            const games = await gameRepository.find({
                where: {
                    timeBet: hour,
                    dateBet: date,
                    modality: category,
                }, order: {
                    dateBet: 'ASC'
                }
            })

            const nA = number.substring(3, 4)
            const nB = number.substring(2, 4)
            const nC = number.substring(1, 4)
            const nD = number.substring(0, 4)

            const gamesFiltered = games.map((e, i) => {
                if (
                    e.numberBet == nA ||
                    e.numberBet == nB ||
                    e.numberBet == nC ||
                    e.numberBet == nD
                ) {

                    return ({
                        element: e,
                        validated: true
                    })
                }
                else {
                    return null
                }
            }).filter((e) => !!e)

            return res.status(200).json({
                gamesFiltered,
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async searchWinners(req: Request, res: Response) { 
        try {
            const { hour, date, category } = req.body  
            const games = await gameRepository.find({
                where: {
                    timeBet: hour,
                    dateBet: date,
                    modality: In([...category]),
                    // eslint-disable-next-line camelcase
                    game_winner: true
                },
                order: {
                    dateBet: 'ASC'
                },
                relations: {
                    user: true,
                    group: true
                }
            })

            return res.json(games)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async searchWinnersAll(req: Request, res: Response) {
        const { page } = req.params

        let pageItens = 0
        if (Number(page) !== 0) {
            pageItens = Number(page) * 4
        }

        try {
            const games = await gameRepository.findAndCount({
                where: {
                    // eslint-disable-next-line camelcase
                    game_winner: true
                },
                order: {
                    dateBet: 'DESC'
                },
                relations: {
                    user: true,
                    group: true
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
}
