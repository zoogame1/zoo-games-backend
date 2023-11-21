import { AppDataSource } from "../data-source"
import { BlackList } from "../entities/BlackList"

export const blackListRepository = AppDataSource.getRepository(BlackList)