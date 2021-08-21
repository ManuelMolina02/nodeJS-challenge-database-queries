import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    //selecione o usuário com id correspondente e retorne:
    // dados do usuário
    // games relacionados a esse user
    const user = await this.repository.findOne(
      user_id, 
      { relations: ["games"] }
    );

    // se o usuário não existir retorne
    if (!user) {
      throw new Error("User not exist!");
    }

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    //selecione todos os usuários e retorne uma lista
    //lista deve estar em ordem alfabética usando 'first_name' como ref
    const user = await this.repository.query(`
      SELECT * 
      FROM users
      ORDER BY first_name ASC
    `);

    return user
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    // buscar todos os dados do usuário com first name e last name correspndente
    // deve-se ignorar se o caractere esta em caixa alta
    // buscar pelo uso do LOWER no Postgres
    const user = await this.repository.query(`
    SELECT * 
    FROM users
    WHERE 
    LOWER(first_name) = LOWER('${first_name}') 
    AND LOWER(last_name) = LOWER('${last_name}')
  `);

    return user
  }
}