import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { CoreEntity } from '../../../core/core.entity';

@Entity({ name: 'users' })
@Index(['email', 'isVerified'])
export class UserEntity extends CoreEntity {
  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true })
  firstName: string;

  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true })
  lastName: string;

  @Index()
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  password?: string;

  @Column({ default: false })
  isVerified: boolean;
  
  @Column({ default: false })
  isBlocked: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }

    if (this.firstName) {
      this.firstName = this.firstName.trim();
    }

    if (this.lastName) {
      this.lastName = this.lastName.trim();
    }
  }
}
