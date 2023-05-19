import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Faculty } from "./Faculty";

@Entity({
  name: "groups",
})
export class Group {
  @PrimaryColumn()
    name: string;

  @ManyToOne(() => Faculty, (faculty: Faculty) => faculty.id)
    faculty: Faculty;
}
