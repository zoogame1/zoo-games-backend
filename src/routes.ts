import { Router } from 'express'
import { GameController } from './controllers/GameController'
import { UserController } from './controllers/UserController'
import { authMiddleware } from './middlewares/authMiddleware'
import { GroupController } from './controllers/GroupController'
import { ResultController } from './controllers/ResultController'
import { BlackListController } from './controllers/BlackListController'
import { FinancialController } from './controllers/FinancialController'

import { middlewareHandler } from './util/handlerMiddlewareRole'

const routes = Router()

routes.post('/login', new UserController().login)

routes.post('/financial', new FinancialController().create) // create vai para um novo runTask



routes.use(authMiddleware)

routes.get('/profile', middlewareHandler(), new UserController().getProfile)
routes.get('/user/list/all/:page', middlewareHandler('manager'), new UserController().listAllUsers)
routes.get('/user/all/:name', middlewareHandler('manager'), new UserController().listAllUsersByName)
routes.post('/user', middlewareHandler('admin'), new UserController().create)
routes.put('/user/:id', middlewareHandler('manager'), new UserController().updateMoneyProfile)
routes.put('/user/role/:id', middlewareHandler('admin'), new UserController().updateRoleUser)
routes.delete('/user/:id', new UserController().delete)

routes.get('/game/:id', middlewareHandler(), new GameController().findOne)
routes.get('/game/search_winners/all/:page', middlewareHandler(), new GameController().searchWinnersAll)
routes.post('/game/search_winners', middlewareHandler(), new GameController().searchWinners)
routes.post('/game/:idUser', middlewareHandler(), new GameController().create)
routes.put('/game/:id', middlewareHandler(), new GameController().update)
routes.delete('/game/:id', new GameController().delete)

routes.get('/games', middlewareHandler(), new GameController().list)
routes.get('/games/user', middlewareHandler(), new GameController().searchAllGamesForUser)
routes.get('/games/winners/validated', middlewareHandler(), new GameController().findWinnersValidation)
routes.get('/games/winners', middlewareHandler(), new GameController().findWinners)
routes.get('/games/groups/:id', middlewareHandler(), new GroupController().listGamesForGroup)
routes.get('/games/groups/:id/:page', middlewareHandler(), new GroupController().listGamesForGroupPaginated)
routes.post('/game/multiple/:idUser', middlewareHandler(), new GameController().multipleCreate)
routes.post('/games/report/report_number_value', middlewareHandler(), new GameController().queryReportNumberValue)
routes.post('/games/report/report_modality_one', middlewareHandler(), new GameController().queryModaly1)
routes.put('/games/winners', middlewareHandler(), new GameController().updateWinners)

routes.get('/group/:id/:userId', middlewareHandler(), new GroupController().searchOneGameForId)
routes.get('/group/:id', middlewareHandler(), new GroupController().searchOneGameAllUsersForId)
routes.get('/group/search_more_ten/all/:page', middlewareHandler('employee'), new GroupController().searchGroupsGamesMoreTen)
routes.put('/group/favorite/:id', middlewareHandler(), new GroupController().alterValueFavoriteGroup)
routes.delete('/group/transaction/delete_cascade/:id/:countTotal/:idUser', new GroupController().deleteGroupWithGames)

routes.get('/result/all/:date', middlewareHandler(), new ResultController().list)
routes.post('/result', middlewareHandler('employee'), new ResultController().create) // employe

routes.get('/black_list/search_all_records/:page', middlewareHandler('manager'), new BlackListController().serchAllBlackListRecords)
routes.get('/black_list/search_filtered_numbers_records/:number', middlewareHandler('manager'), new BlackListController().serchBlackListRecordsFilterByNumber)

routes.get('/financial/:userId', new FinancialController().searchForId)
routes.get('/financial/all/:userId', new FinancialController().totalBetAllDays)
routes.put('/financial/update', new FinancialController().subtractBalance)
routes.get('/financial/all/selected/:userId/:date', new FinancialController().totalBetDaysSelected)

export default routes
