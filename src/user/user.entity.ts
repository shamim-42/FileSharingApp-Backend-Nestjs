import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcriptjs from 'bcryptjs';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  salt: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcriptjs.hash(password, this.salt);
    return hash === this.password;
  }

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
}
