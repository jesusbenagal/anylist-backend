import { IsUUID } from "class-validator";
import { InputType, Field, PartialType, ID } from "@nestjs/graphql";

import { CreateListItemInput } from "./create-list-item.input";

@InputType()
export class UpdateListItemInput extends PartialType(CreateListItemInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
