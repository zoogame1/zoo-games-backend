import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Game } from './Game'
import { Group } from './Group'
import { Financial } from './Financial'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
        id: number

    @Column({ type: 'text' })
        name: string

    @Column({ type: 'text', unique: true })
        email: string

    @Column({ type: 'text' })
        password: string

    @Column({ type: 'float', default: 5000 })
        cashier: number

    @Column({
        type: 'enum',
        enum: ['admin', 'user', 'manager', 'employee'],
        default: 'user'
    })
        role: string

    @OneToMany(() => Game, game => game.user)
        games: Game[]

    @OneToMany(() => Group, group => group.user)
        group: Group[]

    @OneToMany(() => Game, game => game.user)
        financial: Financial[]

    @CreateDateColumn()
        // eslint-disable-next-line camelcase
        created_at: Date

    @UpdateDateColumn()
        // eslint-disable-next-line camelcase
        updated_at: Date
}
