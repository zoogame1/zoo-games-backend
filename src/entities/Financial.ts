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

@Entity('financial')
export class Financial {
  @PrimaryGeneratedColumn()
      id: number

  @Column({ type: "varchar" })
      totalMoneyBet: string

  @Column({ type: "varchar" })
      date: string

  @ManyToOne(() => User, user => user.games)
  @JoinColumn({ name: 'user_id' })
      user: User

  @CreateDateColumn()
  // eslint-disable-next-line camelcase
      created_at: Date

  @UpdateDateColumn()
  // eslint-disable-next-line camelcase
      updated_at: Date

}

