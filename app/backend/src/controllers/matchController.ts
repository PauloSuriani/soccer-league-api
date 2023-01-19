import { Request, Response, NextFunction } from "express";
import MatchService from '../services/matchService';

class MatchController {
  private matchService: MatchService;

  constructor() {
    this.matchService = new MatchService();
  }

  public getFilteredMatches =
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { inProgress } = req.query;
    try {
      if (inProgress) {
        const inProgressSearch = await this.matchService.getFilteredMatches(String(inProgress));
        res.status(200).json(inProgressSearch);
      }
      const allMatchesSearch = await this.matchService.getAllMatches();
      return res.status(200).json(allMatchesSearch);
    } catch (error: unknown) {
      next();
    }
  }

  public setNewMatch = 
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { authorization: token } = req.headers;
    if (!token) return res.status(404).json('Invalid token');
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = req.body;
    try {
      const verifyToken = await this.matchService.tokenVerify(token);
      if (homeTeam === awayTeam){
        return res.status(401).json({
          message: 'It is not possible to create a match with two equal teams',
        })
      } 
      if (verifyToken) {
        const idVerify = await this.matchService.verifyTeamsId(homeTeam, awayTeam);
        if (!idVerify) {
          return res.status(404).json({
            message: 'There is no team with such id!',
          })
        }
        const inProgressSearch = await this.matchService.setNewMatch(
          homeTeam, awayTeam, homeTeamGoals, awayTeamGoals
        );
        return res.status(201).json(inProgressSearch);
      }
      return res.status(404).json('Invalid token');
    } catch (error: unknown) {
      next();
    }
  }

  public setFinishedMatch = 
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;
    try {
      const finishMatch = await this.matchService.setFinishedMatch(Number(id));
      if (finishMatch) res.status(200).json('Finished');
      return res.status(404).json('Invalid match option');
    } catch (error: unknown) {
      next();
    }
  }

  public editMatch = 
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    try {
      const updatedMatch = await this.matchService.editMatch(Number(id), homeTeamGoals, awayTeamGoals);
      if (updatedMatch) res.status(200).json({
        message: 'Match successfully updated'
      });
      return res.status(404).json('Match failed to update');
    } catch (error: unknown) {
      next();
    }
  }

}

export default MatchController;