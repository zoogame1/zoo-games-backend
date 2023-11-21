import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { User } from '../entities/User'
import bcrypt from 'bcrypt'

export class UserSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const userRepository = dataSource.getRepository(User)

        const userData = {
            name: 'Administrador',
            email: 'administrador@email.com',
            password: await bcrypt.hash('Pedro0594', 10)
        }

        const newUser = userRepository.create(userData)
        await userRepository.save(newUser)
    }
}