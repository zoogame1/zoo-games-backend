import { Request, Response } from "express"
import { financialRepository } from "../repositories/financialRepository"
import { gameRepository } from "../repositories/gameRepository"
import { userRepository } from "../repositories/userRepository"
import { In } from "typeorm"

export class FinancialController {
    async create(req: Request, res: Response) {
        try {
            const usersId = (await userRepository.find()).map((e => e.id))
            for (const userId of usersId ){
                const user = await userRepository.findOneBy({ id: userId })

                let currentDate = new Date()
                let year = currentDate.getFullYear()
                let month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
                let day = currentDate.getDate().toString().padStart(2, '0')
                let formattedDate = year + '-' + month + '-' + day

                const gamesRealizedToday = await gameRepository.find({
                    where: {
                        dateBet: formattedDate,
                        user: {
                            id: userId
                        }
                    },
                    relations: {
                        user: true
                    }
                })

                const totalMoneyToDay = gamesRealizedToday.reduce((accumulator, element) => accumulator + parseFloat(element.moneyBet), 0)

                if (!!user && !!totalMoneyToDay){
                    const newFinancialReport = financialRepository.create({
                        user: user,
                        totalMoneyBet: String(totalMoneyToDay),
                        date: formattedDate,
                    })
                    await financialRepository.save(newFinancialReport)
                }
            }

            return res.status(200).json(`Novo relátorio financeiro salvo para o user`)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async searchForId(req: Request, res: Response) {
        try {
            const { userId } = req.params  
            const date =  req.query['date'] as string
            const dateFormated = date.split(',') 

            const user = await userRepository.find({
                where: {
                    id: Number(userId),
                }
            }) 

            const existingRecord = await financialRepository.find({
                where: {
                    user: {
                        id: Number(userId)
                    },
                    date: In(dateFormated),
                },
                order: {
                    date: "DESC"
                }
            }) 
            return res.json([existingRecord, user])
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async totalBetAllDays(req: Request, res: Response) {
        try {
            const { userId } = req.params

            const existingRecord = await financialRepository.find({
                where: {
                    user: {
                        id: Number(userId)
                    },
                }
            })
            const value = existingRecord.reduce((acc, elm) => acc + Number(elm.totalMoneyBet), 0)
            return res.json(value)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async totalBetDaysSelected(req: Request, res: Response) {
        try {
            const { userId, date } = req.params 
            const dateFormated = date.split(',') 
            const existingRecord = await financialRepository.find({
                where: {
                    user: {
                        id: Number(userId)
                    },
                    date: In(dateFormated)
                }
            })
            const value = existingRecord.reduce((acc, elm) => acc + Number(elm.totalMoneyBet), 0)
            return res.status(200).json({ message: value })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async widthdrawBalance(req: Request, res: Response) {
        try {
            const { userId } = req.params
            const { date } = req.query

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async subtractBalance(req: Request, res: Response) {
        try {
            const {
                value,
                userId
            } = req.body

            const user = await userRepository.findOne({
                where: {
                    id: userId
                }
            }) 

            if(!user){ 
                return res.status(400).json({ message: 'Verifique as informações' })
            }

            await userRepository.update(userId, {
                cashier: Number(user?.cashier) + Number(value)
            })

            const reports = await financialRepository.find({ where: {
                user: {
                    id: userId
                }
            },
            order: {
                id: 'asc'
            }
            })

            let saldoAux = value
            for (const report of reports) {
                if (saldoAux > 0){
                    if (Number(report.totalMoneyBet) > 0){
                        await financialRepository.update(report.id, {
                            totalMoneyBet: String(Number(report.totalMoneyBet) - saldoAux)
                        })}}
                saldoAux = saldoAux - Number(report.totalMoneyBet)
            }

            for (const report of reports) {
                if (saldoAux > 0){
                    if (Number(report.totalMoneyBet) <= 0){
                        await financialRepository.delete(report.id)
                    }
                }
            }

            return res.status(200).json({ message: 'certo' })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

}