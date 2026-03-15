import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum AssetStatus {
  ACTIVE = 'active',
  ASSIGNED = 'assigned',
  RETIRED = 'retired',
}

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  category: string;

  @Column({ default: AssetStatus.ACTIVE })
  status: AssetStatus;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  department: string;

  @ManyToOne(() => User, { nullable: true, eager: false })
  assignedTo: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
