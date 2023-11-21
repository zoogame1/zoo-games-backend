import { AppDataSource } from '../data-source'
import { Result } from '../entities/Result'

export const resultRepository = AppDataSource.getRepository(Result)