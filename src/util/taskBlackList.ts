import { setInterval } from 'timers'
import { gameRepository } from "../repositories/gameRepository"
import { blackListRepository } from "../repositories/blackListRepository"

const intervalInSeconds = 30
const intervalInMilliseconds = intervalInSeconds * 1000

async function validationNumbersToBlackList() {
    try {
        // eslint-disable-next-line camelcase
        const games_grouped = await gameRepository
            .createQueryBuilder("game")
            .select('"timeBet", "dateBet", "numberBet", SUM(CAST("moneyBet" as NUMERIC)) as "totalValue"')
            .groupBy('"timeBet", "dateBet", "numberBet"')
            .having('SUM(CAST("moneyBet" as NUMERIC)) >= 200')
            .getRawMany()

        const gameBlackList = []
        // eslint-disable-next-line camelcase
        for (const game of games_grouped) {
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
    } catch (error) {
        console.log(error)
    }
}

export async function runTaskBlackList() {
    console.log('Executando validação de blacklist')
    await validationNumbersToBlackList()
}

setInterval(runTaskBlackList, intervalInMilliseconds)