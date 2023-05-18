import {
  Column,
  CreateDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  Unique,
  Entity
} from "typeorm";

export enum Services {
  TELEGRAM = "tg",
  VK = "vk"
}

@Entity("subscribers")
@Unique(["chatId", "service"])
export class Subscriber extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  chatId: string;

  @Column({ enum: Services })
  service: Services;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  subscribedGroup: string;

  @Column()
  facultyId: string;

  @Column({ default: true })
  subscribedToNotifications: boolean;
}
