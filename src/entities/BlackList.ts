import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"

@Entity('black_list')
export class BlackList {
  @PrimaryGeneratedColumn()
      id: number

  @Column({ type: "varchar" })
      numberBet: string

  @Column({ type: "varchar" })
      dateBet: string

  @Column({
      type: "enum",
      enum: ["11:00:00", "14:00:00", "16:00:00", "18:00:00", "21:00:00"]
  })
      timeBet: string

  @Column({ type: "varchar" })
      moneyBetTotal: string

  @CreateDateColumn()
      created_at: Date

  @UpdateDateColumn()
      updated_at: Date
}