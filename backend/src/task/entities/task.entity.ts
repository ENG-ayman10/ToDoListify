import { 
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { TaskState } from "../enums/state.enum";
import { TaskPriority } from "../enums/priority.enum";
import { UserEntity } from "src/user/entities/user.entity";

@Entity( {name: "tasks"} )
export class TaskEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( {length: 255} )
    title: string;

    @Column({nullable: true, type: 'text'})
    body: string;

    @Column({enum: TaskState, default: TaskState.TO_DO})
    status: TaskState;

    @Column({enum: TaskPriority, default: TaskPriority.MEDIUM})
    priority: TaskPriority;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    create_at: Date;

    @UpdateDateColumn()
    update_at: Date

    @ManyToOne(() => UserEntity, (user) => user.tasks )
    user: UserEntity;

    @Column()
    userId: number;
}