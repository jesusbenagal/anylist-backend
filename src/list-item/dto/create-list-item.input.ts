import { InputType, Field, ID } from "@nestjs/graphql";
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from "class-validator";

@InputType()
export class CreateListItemInput {
  @Field(() => Number, { description: "Quantity of the item", nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;

  @Field(() => Boolean, {
    description: "Whether the item has been completed",
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @Field(() => ID, { description: "Id of the list that the item is in" })
  @IsUUID()
  listId: string;

  @Field(() => ID, { description: "Id of the item" })
  @IsUUID()
  itemId: string;
}
