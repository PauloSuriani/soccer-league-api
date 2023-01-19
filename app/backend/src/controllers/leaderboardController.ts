import { Request, Response, NextFunction } from "express";
import LeaderboardService from '../services/leaderboardService';

class LeaderboardController {
  private leaderboardService: LeaderboardService;

  constructor() {
    this.leaderboardService = new LeaderboardService();
  }

  public getHomeLeaderboard =
  async (req: Request, res: Response, _next: NextFunction): Promise<Response | void> => {
    try {
      const type = 'home';
      const leaderboardResult = await this.leaderboardService.getLeaderboard(type);
      return res.status(200).json(leaderboardResult);
    } catch (error: unknown) {
      return res.status(401).json({ "message": "A estranger exception was found..." });
    }
  }

  public getAwayLeaderboard =
  async (req: Request, res: Response, _next: NextFunction): Promise<Response | void> => {
    try {
      const type = 'away';
      const awayLeaderboardResult = await this.leaderboardService.getLeaderboard(type);
      return res.status(200).json(awayLeaderboardResult);
    } catch (error: unknown) {
      return res.status(401).json({ "message": "A estranger exception was found..." });
    }
  }


  public getLeaderboard =
  async (req: Request, res: Response, _next: NextFunction): Promise<Response | void> => {
    try {
      const type = 'all';
      const leaderboardResult = await this.leaderboardService.getLeaderboard(type);
      return res.status(200).json(leaderboardResult);
    } catch (error: unknown) {
      return res.status(401).json({ "message": "A estranger exception was found..." });
    }
  }

}

export default LeaderboardController;