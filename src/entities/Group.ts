import {
    JoinColumn,
    ManyToOne,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn } from 'typeorm'
import { Game } from './Game'
import { User } from './User'

@Entity('groups')
export class Group {
    @PrimaryGeneratedColumn()
        id: number

    @CreateDateColumn()
        created_at: Date

    @UpdateDateColumn()
        updated_at: Date

    @Column({
        type: "boolean",
        default: false
    })
        favorite: boolean

    @Column({
        type: "varchar",
        default: null
    })
        note: string

    @Column({
        type: "decimal",
        default: null
    })
        total_price: number

    @Column({
        type: "json",
    })
        squema: JSON

    @ManyToOne(() => User, user => user.group)
    @JoinColumn({ name: 'user_id' })
        user: User

    @OneToMany(() => Game, game => game.group)
        game: Game[]
}