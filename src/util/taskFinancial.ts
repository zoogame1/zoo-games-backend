import { userRepository } from '../repositories/userRepository'
import { financialRepository } from '../repositories/financialRepository'
import { gameRepository } from "../repositories/gameRepository"

const targetHour = 23; // Hora alvo (23:30)
const targetMinute = 30; // Minuto alvo (23:30)

async function validationFinancialReports() {
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
}

export async function runTaskFinancialReports() {
    console.log('Agendando - relatórios financeiros as 23:30')
    const now = new Date()
    const nextRun = new Date(now)
    nextRun.setHours(targetHour, targetMinute, 0, 0)
    if (now >= nextRun) {
        nextRun.setDate(now.getDate() + 1);
    }

    const timeUntilNextRun = nextRun.getTime() - now.getTime()

    setTimeout(async () => {
        await validationFinancialReports();
        await runTaskFinancialReports();
    }, timeUntilNextRun)
} 