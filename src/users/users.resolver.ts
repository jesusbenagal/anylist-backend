import { ParseUUIDPipe, UseGuards } from "@nestjs/common";
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Int,
  Parent,
} from "@nestjs/graphql";

import { UsersService } from "./users.service";
import { ItemsService } from "../items/items.service";
import { ListsService } from "../lists/lists.service";

import { User } from "./entities/user.entity";
import { Item } from "../items/entities/item.entity";
import { List } from "../lists/entities/list.entity";

import { ValidRolesArgs } from "./dto/args/roles.arg";
import { UpdateUserInput } from "./dto/inputs";
import { PaginationArgs, SearchArgs } from "../common/dto/args";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { ValidRoles } from "../auth/enums/valid-roles.enum";

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService
  ) {}

  @Query(() => [User], { name: "users" })
  async findAll(
    @Args() validRoles: ValidRolesArgs,
    @Args() searchArgs: SearchArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles, searchArgs);
  }

  @Query(() => User, { name: "user" })
  async findOne(
    @Args("id", { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User)
  async updateUser(
    @Args("updateUserInput") updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: "blockUser" })
  async blockUser(
    @Args("id", { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => Int, { name: "itemCount" })
  async itemCount(
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Parent() user: User
  ): Promise<number> {
    return this.itemsService.itemCountByUser(user);
  }

  @ResolveField(() => [Item], { name: "items" })
  async getItemsByUser(
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @ResolveField(() => Int, { name: "listCount" })
  async listCount(
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Parent() user: User
  ): Promise<number> {
    return this.listsService.listsCountByUser(user);
  }

  @ResolveField(() => [List], { name: "lists" })
  async getListsByUser(
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<Item[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }
}
