import { Request, Response } from "express"
import { In, Like } from "typeorm"
import { gameRepository } from "../repositories/gameRepository"
import { resultRepository } from "../repositories/resultRepository"
import { getCombinations } from "../util/generatorCombinationsInverted"
import { BadRequestError } from "../helpers/api-erros"

export class ResultController {
    async create(req: Request, res: Response) {
        try {
            const { dateBet, hour } = req.body.data

            if (!dateBet || !hour) {
                return res.status(400).json({ message: 'Verifique as informações passadas' })
            }

            const resultAlreadyExist = await resultRepository.find({
                where: {
                    dateBet: req.body.data.dateBet,
                    timeBet: String(req.body.data.hour)
                }
            })

            if (!!resultAlreadyExist[0]){
                const idsFilter = resultAlreadyExist.map(e => e.id)
                await resultRepository.delete(idsFilter)
            }


            const resultPromises = req.body.data.winners.map(async (e: any) => {
                const categoryPosition = e.position + '°'
                const categoryInverted = e.position == '1' ? '...1°M' : `...${e.position}°`

                const resultAlreadyExist = await resultRepository.find({
                    where: {
                        dateBet: dateBet,
                        timeBet: String(hour)
                    }
                })

                // // novalinhas q add
                // if (!!resultAlreadyExist[0]){
                //     return res.status(400).json({ message: 'Resultado já cadastrado para essa data!' })
                // }

                const newResult = resultRepository.create({
                    numberBet: String(e.number),
                    dateBet: dateBet,
                    timeBet: String(hour),
                    // eslint-disable-next-line camelcase
                    winner_position: e.position,
                    dateBetExactly: dateBet,
                })
                const possibleNumbersInteger = [
                    String(newResult.numberBet).substring(3, 4),
                    String(newResult.numberBet).substring(2, 4),
                    String(newResult.numberBet).substring(1, 4),
                    String(newResult.numberBet).substring(0, 4),
                ].filter((e) => !!e)

                await resultRepository.save(newResult)

                const gameWinnerPromises = []

                // modalidades básicas: 1 ao 6
                const gameWinners = await gameRepository.find({
                    where: {
                        dateBet: newResult.dateBet,
                        timeBet: newResult.timeBet,
                        numberBet: In(possibleNumbersInteger),
                        // eslint-disable-next-line camelcase
                        modality: categoryPosition,
                    },
                    relations: {
                        user: true,
                        group: true,
                    },
                })

                gameWinners.forEach((gameWinner) => {
                    gameWinnerPromises.push(
                        gameRepository.update(gameWinner.id, {
                            // eslint-disable-next-line camelcase
                            game_winner: true,
                        })
                    )
                })

                // modalidade 1/5
                if (['1°', '2°', '3°', '4°', '5°'].includes(categoryPosition)) {
                    gameWinnerPromises.push(
                        gameRepository.update(
                            {
                                dateBet: newResult.dateBet,
                                timeBet: newResult.timeBet,
                                numberBet: In(possibleNumbersInteger),
                                modality: '1/5',
                            },
                            {
                                // eslint-disable-next-line camelcase
                                game_winner: true,
                            }
                        )
                    )
                }

                // modalidade 1/6
                if (['1°', '2°', '3°', '4°', '5°', '6°'].includes(categoryPosition)) {
                    gameWinnerPromises.push(
                        gameRepository.update(
                            {
                                dateBet: newResult.dateBet,
                                timeBet: newResult.timeBet,
                                numberBet: In(possibleNumbersInteger),
                                modality: '1/6',
                            },
                            {
                                // eslint-disable-next-line camelcase
                                game_winner: true,
                            }
                        )
                    )
                }

                // modalidade 2/5
                if (['2°', '3°', '4°', '5°'].includes(categoryPosition)) {
                    gameWinnerPromises.push(
                        gameRepository.update(
                            {
                                dateBet: newResult.dateBet,
                                timeBet: newResult.timeBet,
                                numberBet: In(possibleNumbersInteger),
                                modality: '2/5',
                            },
                            {
                                // eslint-disable-next-line camelcase
                                game_winner: true,
                            }
                        )
                    )
                }

                // //// INVERTIDAS //////
                // Modalidades Invertidas ...1M ao ...6M
                const combinationsInverted = getCombinations(newResult.numberBet)

                const gameWinnersIn = await gameRepository.find({
                    where: {
                        dateBet: newResult.dateBet,
                        timeBet: newResult.timeBet,
                        numberBet: In(combinationsInverted),
                        modality: categoryInverted,
                    },
                    relations: {
                        user: true,
                        group: true,
                    },
                })

                gameWinnersIn.forEach((gameWinner) => {
                    gameWinnerPromises.push(
                        gameRepository.update(gameWinner.id, {
                            // eslint-disable-next-line camelcase
                            game_winner: true,
                        })
                    )
                })

                // // modalidade Invertida no ...1°C
                if (['1°'].includes(categoryPosition)) {
                    // const caracteresNumberBetToCompare = Array.from(new Set(newResult.numberBet.slice(-3).split(''))) //Set remove duplicados
                    const numberBet = newResult.numberBet.toString() // Certifique-se de que numberBet é uma string
                    const caracteresNumberBetToCompare = numberBet
                        .slice(-3) // Pega os três últimos dígitos da string
                        .split('') // Divide a string em um array de caracteres individuais

                    const gamesToUpdate = await gameRepository
                        .createQueryBuilder('game')
                        .where('game.modality = :modality', { modality: '...1°C' })
                        .andWhere('game.timeBet = :timeBet', { timeBet: newResult.timeBet })
                        .andWhere(`LENGTH(game.numberBet) >= 3`)
                        .andWhere(`(
                        game.numberBet LIKE '%${caracteresNumberBetToCompare[0]}%'
                        AND game.numberBet LIKE '%${caracteresNumberBetToCompare[1]}%'
                        AND game.numberBet LIKE '%${caracteresNumberBetToCompare[2]}%'
                    )`)
                        .getMany()

                    if (gamesToUpdate.length > 0) {
                        const gameWinnerPromises = gamesToUpdate.map((game) =>
                            gameRepository.update({ id: game.id }, {
                                // eslint-disable-next-line camelcase
                                game_winner: true
                            })
                        )

                        await Promise.all(gameWinnerPromises)
                    }
                }

                // modalidade Invertida => ...1/6
                if (['1°', '2°', '3°', '4°', '5°', '6°'].includes(categoryPosition)) {
                    gameWinnerPromises.push(
                        gameRepository.update(
                            {
                                dateBet: newResult.dateBet,
                                timeBet: newResult.timeBet,
                                numberBet: In(combinationsInverted),
                                modality: '...1/6',
                            },
                            {
                                // eslint-disable-next-line camelcase
                                game_winner: true,
                            }
                        )
                    )
                }

                // modalidade Invertida => ...1/5M
                if (['1°', '2°', '3°', '4°', '5°'].includes(categoryPosition)) {
                    gameWinnerPromises.push(
                        gameRepository.update(
                            {
                                dateBet: newResult.dateBet,
                                timeBet: newResult.timeBet,
                                numberBet: In(combinationsInverted),
                                modality: '...1/5M',
                            },
                            {
                                // eslint-disable-next-line camelcase
                                game_winner: true,
                            }
                        )
                    )
                }

                // modalidade Invertida => ...1/5C
                if (['1°', '2°', '3°', '4°', '5°'].includes(categoryPosition)) {
                    const numberBet = newResult.numberBet.toString()
                    const caracteresNumberBetToCompare = numberBet
                        .slice(-3)
                        .split('')

                    const gamesToUpdate = await gameRepository
                        .createQueryBuilder('game')
                        .where('game.modality = :modality', { modality: '...1/5C' })
                        .andWhere('game.timeBet = :timeBet', { timeBet: newResult.timeBet })
                        .andWhere(`LENGTH(game.numberBet) >= 3`)
                        .andWhere(`(
                            game.numberBet LIKE '%${caracteresNumberBetToCompare[0]}%'
                            AND game.numberBet LIKE '%${caracteresNumberBetToCompare[1]}%'
                            AND game.numberBet LIKE '%${caracteresNumberBetToCompare[2]}%'
                        )`)
                        .getMany()

                    if (gamesToUpdate.length > 0) {
                        const gameWinnerPromises = gamesToUpdate.map((game) =>
                            gameRepository.update({ id: game.id }, {
                                // eslint-disable-next-line camelcase
                                game_winner: true })
                        )

                        await Promise.all(gameWinnerPromises)
                    }
                }

                // modalidade Invertida => ...2/5M
                if (['2°', '3°', '4°', '5°'].includes(categoryPosition)) {
                    gameWinnerPromises.push(
                        gameRepository.update(
                            {
                                dateBet: newResult.dateBet,
                                timeBet: newResult.timeBet,
                                numberBet: In(combinationsInverted),
                                modality: '...2/5M',
                            },
                            {
                                // eslint-disable-next-line camelcase
                                game_winner: true,
                            }
                        )
                    )
                }

                // modalidade Invertida => ...2/5C
                if (['2°', '3°', '4°', '5°'].includes(categoryPosition)) {
                    // const caracteresNumberBetToCompare = Array.from(new Set(newResult.numberBet.slice(-3).split('')))
                    const numberBet = newResult.numberBet.toString()
                    const caracteresNumberBetToCompare = numberBet
                        .slice(-3)
                        .split('')

                    const gamesToUpdate = await gameRepository
                        .createQueryBuilder('game')
                        .where('game.modality = :modality', { modality: '...2/5C' })
                        .andWhere('game.timeBet = :timeBet', { timeBet: newResult.timeBet })
                        .andWhere(`LENGTH(game.numberBet) >= 3`)
                        .andWhere(`(
                            game.numberBet LIKE '%${caracteresNumberBetToCompare[0]}%'
                            AND game.numberBet LIKE '%${caracteresNumberBetToCompare[1]}%'
                            AND game.numberBet LIKE '%${caracteresNumberBetToCompare[2]}%'
                        )`)
                        .getMany()

                    if (gamesToUpdate.length > 0) {
                        const gameWinnerPromises = gamesToUpdate.map((game) =>
                            gameRepository.update({ id: game.id }, {
                                // eslint-disable-next-line camelcase
                                game_winner: true })
                        )

                        await Promise.all(gameWinnerPromises)
                    }
                }

                return Promise.all(gameWinnerPromises)
            })
            await Promise.all(resultPromises)
            return res.status(201).json('Resultado criado com sucesso!')
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async list(req: Request, res: Response) {
        const { date } = req.params
        try {
            const results = await resultRepository.find({
                order: {
                    // dateBet: "DESC",
                    timeBet: "DESC",
                    // eslint-disable-next-line camelcase
                    winner_position: 'ASC'
                },
                where: {
                    // dateBetExactly: LessThanOrEqual(date_current)
                    dateBet: date
                }
            })

            const datasResults = results.map((e) => e.dateBet)
            const horasResults = results.map((e) => e.timeBet)

            const newDatasResults = [...new Set(datasResults)]
            const newHorasResults = [...new Set(horasResults)]

            const itensCurrentData = newDatasResults.map((dataResult, index) => {
                const r = results.map((eOrigin, index) => {
                    if (eOrigin.dateBet === dataResult) {
                        return eOrigin
                    }
                })

                const rFiltered = r.filter((element) => element !== undefined)

                const itensCurrentDataHour = newHorasResults.map((hour, index) => {
                    const h = rFiltered.map((element, index) => {
                        if (element?.timeBet === hour) {
                            return element
                        }
                    })

                    const hFiltered = h.filter((element) => element !== undefined)

                    return {
                        hora: hour,
                        elementos: hFiltered
                    }
                })

                const itensCurrentDataHourFiltered = itensCurrentDataHour.filter((element) => {
                    if (element.elementos.length > 0) {
                        return element
                    }
                })

                return {
                    dataResult,
                    itensDataEqual: itensCurrentDataHourFiltered
                }
            })

            return res.json(itensCurrentData)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }
}