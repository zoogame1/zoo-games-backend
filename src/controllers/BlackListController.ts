import { Request, Response } from "express"
import { gameRepository } from "../repositories/gameRepository"
import { blackListRepository } from "../repositories/blackListRepository"


export class BlackListController {
    async validationNumbersToBlackList(req: Request, res: Response) {
        try {
            const gamesGrouped = await gameRepository
                .createQueryBuilder("game")
                .select('"timeBet", "dateBet", "numberBet", SUM(CAST("moneyBet" as NUMERIC)) as "totalValue"')
                .groupBy('"timeBet", "dateBet", "numberBet"')
                .having('SUM(CAST("moneyBet" as NUMERIC)) >= 200')
                .getRawMany()

            let gameBlackList = []
            for (const game of gamesGrouped) {
                const existingRecord = await blackListRepository.findOne({ where: { numberBet: game.numberBet } })
                if (!existingRecord) {
                    const blackListNewData = blackListRepository.create({
                        moneyBetTotal: game.totalValue,
                        numberBet: game.numberBet,
                        dateBet: game.dateBet,
                        timeBet: game.timeBet
                    })

                    const gameBlack = await blackListRepository.save(blackListNewData)
                    gameBlackList.push(gameBlack)
                }
            }

            return res.json(gameBlackList)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async serchAllBlackListRecords (req: Request, res: Response) {
        try {
            const { page } = req.params
            let pageItens = 0
            if (Number(page) !== 0) {
                pageItens = Number(page) * 4
            }
            const blackListRecords = await blackListRepository.findAndCount({
                order:{
                    id: "DESC"
                },
                skip: pageItens,
                take: 4,
            })
            return res.status(200).json(blackListRecords)
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async serchBlackListRecordsFilterByNumber (req: Request, res: Response) {
        try {
            const { number } = req.params
            const blackListRecords = await blackListRepository.find({
                where: {
                    numberBet: number
                }
            })
            return res.status(200).json(blackListRecords)
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }
}