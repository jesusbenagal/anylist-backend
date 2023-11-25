import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateItemInput {
  @Field(() => String, { description: "Name of the item" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String, {
    description: "Quantity units of the item",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  quantityUnits?: string;
}
