import { Request, Response, NextFunction } from "express";
import TeamService from '../services/teamService';

class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  public getAllTeams =
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const allTeamsArray = await this.teamService.getAllTeams();
      return res.status(200).json(allTeamsArray);
    } catch (error: unknown) {
      next();
    }
  }

  public getOneTeam =
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;
    try {
      const teamObject = await this.teamService.getOneTeam(Number(id));
      return res.status(200).json(teamObject);
    } catch (error: unknown) {
      next();
    }
  }
}

export default TeamController;