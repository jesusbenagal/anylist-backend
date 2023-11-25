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

@Entity({ name: "items" })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID, { description: "Unique identifier of the item" })
  id: string;

  @Column()
  @Field(() => String, { description: "Name of the item" })
  name: string;

  @Column({ nullable: true })
  @Field(() => String, {
    description: "Description of the item",
    nullable: true,
  })
  quantityUnits?: string;

  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index("userId-index")
  @Field(() => User, { description: "User that owns this item" })
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  @Field(() => [ListItem], { description: "Lists that the item is in" })
  listItem: ListItem[];
}
