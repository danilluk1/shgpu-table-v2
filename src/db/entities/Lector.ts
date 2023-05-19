import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("lectors")
export class Lector extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: string;

  @Column()
    name: string;
}
