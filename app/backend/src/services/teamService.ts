import TeamModel from '../database/models/team';

class TeamService {
  private teamModel = TeamModel;

  public getAllTeams =
  async (): Promise<[]> => {
    const teamSearch = await this.teamModel.findAll();
    return teamSearch as [];
  }

  public getOneTeam =
  async (id: number): Promise<{}> => {
    const teamSearch = await this.teamModel.findOne({ where: { id }});
    return teamSearch as {};
  }

}

export default TeamService;