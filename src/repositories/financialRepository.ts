import { AppDataSource } from '../data-source'
import { Financial } from '../entities/Financial'

export const financialRepository = AppDataSource.getRepository(Financial)
