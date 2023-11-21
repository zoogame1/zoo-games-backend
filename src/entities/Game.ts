import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"
import { User } from "./User"
import { Group } from "./Group"

@Entity('games')
export class Game {
    @PrimaryGeneratedColumn()
        id: number

    @Column({ type: "varchar" })
        numberBet: string

    @Column({
        type: "enum",
        enum: ['1°', '1/5', '2/5', '...1°C','...1°M','...1/5M','...1/5C','...2/5M','...2/5C', '2°', '3°', '4°', '5°', '...2°', '...3°', '...4°', '...5°', '...6°', '6°', '1/6', '...1/6']
    })
        modality: string

    @Column({ type: "varchar" })
        dateBet: string

    @Column({
        type: "enum",
        enum: ["11:00:00", "14:00:00", "16:00:00", "18:00:00", "21:00:00"]
    })
        timeBet: string

    @Column({ type: "varchar" })
        moneyBet: string

    @Column({
        type: "boolean",
        default: false
    })
        winner: boolean

    @Column({
        type: "boolean",
        default: false
    })
        favorite: boolean

    @Column({
        type: "boolean",
        default: false
    })
        game_winner: boolean

    @CreateDateColumn()
        created_at: Date

    @UpdateDateColumn()
        updated_at: Date


    @ManyToOne(() => User, user => user.games)
    @JoinColumn({ name: 'user_id' })
        user: User

    @ManyToOne(() => Group, group => group.game)
    @JoinColumn({ name: 'group_id' })
        group: Group
}

