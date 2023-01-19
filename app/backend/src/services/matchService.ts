import Team from '../database/models/team';
import MatchModel from '../database/models/match';
import * as JWT from 'jsonwebtoken';
import { readFileSync } from 'fs';

class MatchService {
  private matchModel = MatchModel;

  public getAllMatches =
  async (): Promise<[]> => {
    const allMatchesResult = await this.matchModel.findAll({
      include: [
        {
          model: Team,
          as: 'teamHome',
          attributes: { exclude: ['id']},
        },
        {
            model: Team,
            as: 'teamAway',
            attributes: { exclude: ['id']},
        },
      ],
    });
    return allMatchesResult as [];
  }

  public getFilteredMatches =
  async (inProgress:string): Promise<[]> => {
    const inProgressMatchesResult = await this.matchModel.findAll({
        include: [
          {
            model: Team,
            as: 'teamHome',
            attributes: { exclude: ['id']},
          },
          {
              model: Team,
              as: 'teamAway',
              attributes: { exclude: ['id']},
          },
        ],
      where: { inProgress: JSON.parse(inProgress)},
      });
    return inProgressMatchesResult as [];
  }

  public tokenVerify =
  async (token: string): Promise<boolean> => {
    const jwtSecret = readFileSync('jwt.evaluation.key', 'utf8');
    const tokenCheck = JWT.verify(token, jwtSecret) as JWT.JwtPayload;
    
    if (tokenCheck) return true;
    
    return false;
  }

  public setNewMatch =
  async ( 
    homeTeam:string, 
    awayTeam:string, 
    homeTeamGoals:string, 
    awayTeamGoals:string,
  ): Promise<{} | null> => {
    const newMatchInsert = await this.matchModel.create({
      homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress: true,
    });
    if (newMatchInsert) return newMatchInsert as {};
    return null;
  }

  public setFinishedMatch =
  async (id:number): Promise<boolean | null> => {
    const finishMatchUpdate = await this.matchModel.update({ inProgress: false }, { where: {id} });
    if (finishMatchUpdate) return true;
    return null;
  }

  public verifyTeamsId =
  async ( homeTeam:number, awayTeam:number ): Promise<boolean> => {
    const homeTeamExists = await this.matchModel.findByPk(homeTeam);
    if (!homeTeamExists) return false;

    const awayTeamExists = await this.matchModel.findByPk(awayTeam);
    if (!awayTeamExists) return false;
    
    return true;
  }

  public editMatch =
  async ( id:number, homeTeamGoals:number, awayTeamGoals:number ): Promise<boolean> => {
    const matchSearch = await this.matchModel.findByPk(id);

    const updatedMatch = await this.matchModel.update({
      homeTeamGoals, awayTeamGoals, 
    }, {where: { id } });

    return true;
  }

}

export default MatchService;