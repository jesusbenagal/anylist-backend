import { ObjectType, Field, ID } from "@nestjs/graphql";
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "../../users/entities/user.entity";
import { ListItem } from "../../list-item/entities/list-item.entity";

@Entity({ name: "lists" })
@ObjectType()
export class List {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID, { description: "Unique identifier of the list" })
  id: string;

  @Column()
  @Field(() => String, { description: "Name of the list" })
  name: string;

  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index("userId-list-index")
  @Field(() => User, { description: "User who owns the list" })
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.list, { lazy: true })
  // @Field(() => [ListItem], { description: "Items in the list" })
  listItem: ListItem[];
}
