import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { UsersModule } from "../users/users.module";
import { ItemsModule } from "../items/items.module";

import { SeedService } from "./seed.service";
import { SeedResolver } from "./seed.resolver";
import { ListItemModule } from "../list-item/list-item.module";
import { ListsModule } from "../lists/lists.module";

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    ConfigModule,
    UsersModule,
    ItemsModule,
    ListItemModule,
    ListsModule,
  ],
})
export class SeedModule {}
