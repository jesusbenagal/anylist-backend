import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

import { User } from "./entities/user.entity";

import { SignupInput } from "../auth/dto/inputs/signup.input";
import { UpdateUserInput } from "./dto/inputs";
import { SearchArgs } from "../common/dto/args";

import { ValidRoles } from "../auth/enums/valid-roles.enum";

@Injectable()
export class UsersService {
  private logger = new Logger("UsersService");

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(roles: ValidRoles[], searchArgs: SearchArgs): Promise<User[]> {
    const { search } = searchArgs;

    const queryBuilder = this.userRepository.createQueryBuilder();

    if (roles.length) {
      queryBuilder
        .andWhere("ARRAY[roles] && ARRAY[:...roles]")
        .setParameter("roles", roles);
    }

    if (search)
      queryBuilder.andWhere(`LOWER("fullName") like :fullName`, {
        fullName: `%${search.toLowerCase()}%`,
      });

    return queryBuilder.getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBErrors({
        code: "error-001",
        detail: `${email} not found`,
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBErrors({
        code: "error-001",
        detail: `${id} not found`,
      });
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);

    userToBlock.isActive = false;

    userToBlock.lastUpdateBy = adminUser;

    return await this.userRepository.save(userToBlock);
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    updateBy: User
  ): Promise<User> {
    try {
      const user = await this.userRepository.preload({
        id,
        ...updateUserInput,
      });

      user.lastUpdateBy = updateBy;

      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any): never {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail.replace("Key", ""));
    }

    if (error.code === "error-001") {
      throw new NotFoundException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException("Please check server logs");
  }
}
