import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"

@Entity('results')
export class Result {
    @PrimaryGeneratedColumn()
        id: number


    // @Column({
    //     type: "json"
    // })
    // modality: JSON

    @Column({ type: "date" })
        dateBet: string

    @Column({ type: "timestamp" })
        dateBetExactly: Date


    @Column({ type: "int" })
        winner_position: number

    @Column({ type: "text" })
        numberBet: string

    @Column({
        type: "enum",
        enum: ["11:00:00", "14:00:00", "16:00:00", "18:00:00", "21:00:00"]
    })
        timeBet: string

    @CreateDateColumn()
        created_at: Date

    @UpdateDateColumn()
        updated_at: Date
}