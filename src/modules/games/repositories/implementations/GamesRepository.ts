import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    //parte do título de um jogo ou o título inteiro e retornar um ou mais jogos que derem match com a consulta 
     const gameTitle = await this.repository
     .createQueryBuilder("game")
     .where("game.title ILIKE :title", {title: `%${param}%`})
     .getMany(); 
    
    return gameTitle;
      
  }

  async countAllGames(): Promise<[{ count: string }]> {
    // Contar total de games existentes no banco
    const countGames = await this.repository.query(`
    SELECT COUNT(id) 
    FROM games
  `)
    
    return countGames; 
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    // recebe o id de um game e retornar uma lista de todos os usuários que possuem o game
    const gamesList = await this.repository
    .createQueryBuilder()
    .relation(Game, "users")
    .of(id)
    .loadMany()
    
    return gamesList

  }
}