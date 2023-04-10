import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';


@Entity('fileinfo')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>User , (userInfo)=> userInfo.id, {nullable: true})
  @JoinColumn()
  uploader: User

  @Column("varchar", {length: 16})
  uploader_ip: string;

  @Column("varchar", { length: 2048 })
  filename: string;

  @Column("varchar", { length: 2048 })
  storage_location: string;

  @Column("varchar", { length: 2048 })
  url: string;

  @Column("varchar", {length: 1024})
  public_key: string;

  @Column("varchar", {length: 1024})
  private_key: string;



  constructor(partial?: Partial<File>) {
    Object.assign(this, partial);
  }
}
