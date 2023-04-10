import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { File } from './file.entity';


@Entity('fileaccess')
export class FileAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>User , (userInfo)=> userInfo.id)
  @JoinColumn()
  access_by: User

  @Column("varchar", {length: 64, nullable: true})
  user_ip: string;

  @Column("varchar", {length: 32})
  access_time: string;

  @ManyToOne(()=>File , (fileInfo)=> fileInfo.id, {nullable: true})
  @JoinColumn()
  accessed_file: File




  constructor(partial?: Partial<File>) {
    Object.assign(this, partial);
  }
}
