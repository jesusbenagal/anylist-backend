import { ObjectType, Field, ID } from "@nestjs/graphql";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

import { List } from "../../lists/entities/list.entity";
import { Item } from "../../items/entities/item.entity";

@Entity("listItems")
@Unique("listItem-item", ["list", "item"])
@ObjectType()
export class ListItem {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID, { description: "Unique identifier of the list item" })
  id: string;

  @Column({ type: "numeric" })
  @Field(() => Number, { description: "Quantity of the item" })
  quantity: number;

  @Column({ type: "boolean" })
  @Field(() => Boolean, { description: "Whether the item has been completed" })
  completed: boolean;

  @ManyToOne(() => List, (list) => list.listItem, { lazy: true })
  @Field(() => List, { description: "List that the item is in" })
  list: List;

  @ManyToOne(() => Item, (item) => item.listItem, { lazy: true })
  @Field(() => Item, { description: "Item that is in the list" })
  item: Item;
}
