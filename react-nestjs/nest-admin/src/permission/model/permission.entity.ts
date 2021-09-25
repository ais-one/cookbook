import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// @Entity('permissions') // if change table name
@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
