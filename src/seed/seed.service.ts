import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Item } from "../items/entities/item.entity";
import { User } from "../users/entities/user.entity";
import { ListItem } from "../list-item/entities/list-item.entity";
import { List } from "../lists/entities/list.entity";

import { UsersService } from "../users/users.service";
import { ItemsService } from "../items/items.service";
import { ListsService } from "../lists/lists.service";
import { ListItemService } from "../list-item/list-item.service";

import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from "./data/seed-data";

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,

    @InjectRepository(List)
    private readonly listRepository: Repository<List>,

    private readonly userService: UsersService,

    private readonly itemService: ItemsService,

    private readonly listsService: ListsService,

    private readonly listItemService: ListItemService
  ) {
    this.isProd = configService.get("STATE") === "prod";
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException(
        "You are not authorized to seed the database in production!"
      );
    }

    await this.deleteDatabase();

    const user = await this.loadUsers();

    await this.loadItems(user);

    const list = await this.loadLists(user);

    const items = await this.itemService.findAll(
      user,
      { limit: 15, offset: 0 },
      {}
    );
    await this.loadListItems(list, items);

    return true;
  }

  async deleteDatabase(): Promise<void> {
    await this.listItemRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.listRepository.createQueryBuilder().delete().where({}).execute();

    await this.itemRepository.createQueryBuilder().delete().where({}).execute();

    await this.userRepository.createQueryBuilder().delete().where({}).execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.userService.create(user));
    }

    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const itemsPromises = [];

    for (const item of SEED_ITEMS) {
      itemsPromises.push(this.itemService.create(item, user));
    }

    await Promise.all(itemsPromises);
  }

  async loadLists(user: User): Promise<List> {
    const lists = [];

    for (const list of SEED_LISTS) {
      lists.push(await this.listsService.create(list, user));
    }

    return lists[0];
  }

  async loadListItems(list: List, items: Item[]): Promise<void> {
    for (const item of items) {
      await this.listItemService.create({
        quantity: Math.round(Math.random() * 10),
        completed: Math.round(Math.random() * 1) === 0,
        listId: list.id,
        itemId: item.id,
      });
    }
  }
}
