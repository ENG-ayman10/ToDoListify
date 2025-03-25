import { 
    BaseEntity, 
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { UserState } from "../enums/user-state.enum";
import { TaskEntity } from "src/task/entities/task.entity";


@Entity( { name: "users" })
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ unique: true, length: 255 })
    email: string;

    @Column({ unique: true, length: 255 })
    username: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'text' })
    salt: string;

    @Column({enum: UserState , default: UserState.ACTIVE})
    state: UserState;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    create_at: Date;

    @UpdateDateColumn()
    update_at: Date

    @OneToMany( () => TaskEntity, (task) => task.user )
    tasks: TaskEntity[];
}