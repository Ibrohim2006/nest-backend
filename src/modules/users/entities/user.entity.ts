import { CoreEntity } from '@/database/core.entity';
import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity({ name: 'users' })
@Index(['email', 'isVerified'])
export class UserEntity extends CoreEntity {

  @Index()
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  password: string | null;

  @Column({ default: false })
  isVerified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }
}
