import TeamModel from '../database/models/team';
import MatchModel from '../database/models/match';
import IMatch from '../interfaces/match.interface';


class LeadeboardService {
  private matchModel = MatchModel;
  private teamModel = TeamModel;

  public getLeaderboard =
  async (type:string): Promise<{}> => {
    const finishedMatches = await this.matchModel.findAll({ 
      where: {
        inProgress: false
      }
    });

    const allTeams = await this.teamModel.findAll();

    const result = allTeams.map((team) => {
  
      if (type === 'home') {
        const matchesByHometeam = finishedMatches.filter((match) => (
          team.id === match.homeTeam
        ));
        return this.generateLeaderboard(team.teamName, matchesByHometeam as [], type, team.id)
      }

      else if (type === 'away') {
        const matchesByAwayteam = finishedMatches.filter((match) => (
          team.id === match.awayTeam
        ));
        return this.generateLeaderboard(team.teamName, matchesByAwayteam as [], type, team.id)
      }
      else {
        const matchesByTeam = finishedMatches.filter((match) => (
          team.id === match.awayTeam || team.id === match.homeTeam
        ));
        return this.generateLeaderboard(team.teamName, matchesByTeam as [], type, team.id)
      }
    }); 

    result.sort((a, b) => (
      b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || b.goalsOwn - a.goalsOwn
      )
    )

    return (result);
  }

  public generateLeaderboard =
   (teamName:String, matches:IMatch[], type:String, id:number) => {
    const name = teamName;
    const totalVictories = this.getTotalWins(matches, type, id);
    const totalDraws = this.getTotalDraws(matches);
    const totalPoints = this.getTotalPoints(matches, type, id);
    const totalGames = this.getTotalGames(matches);
    const totalLosses = this.getTotalLosses(matches, type, id);
    const goalsFavor = this.getFavorGoals(matches, type, id);
    const goalsOwn = this.getOwnGoals(matches, type, id);
    const goalsBalance = Number(goalsFavor) - Number(goalsOwn);
    const efficiency = Number((((totalPoints) / (((totalGames) * 3))) * 100).toFixed(2));

    const resultObject = {
      name,
      totalPoints,
      totalGames,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance,
      efficiency,
    }
    return resultObject;
  }

  public getTotalPoints = 
   (allMatches:IMatch[], type:String, id:number) => {
    const wins = this.getTotalWins(allMatches, type, id);
    const draws = this.getTotalDraws(allMatches);
    const totalPoints = ((Number(wins) * 3) + Number(draws));
    return totalPoints;
  }

  public getTotalWins = 
   (allMatches:IMatch[], type:String, id:number) => {
    let winsCounter = 0;
    allMatches.map((match) => {
      if (match.homeTeam === id){
        if (match.homeTeamGoals > match.awayTeamGoals) {
          winsCounter += 1;
        }
      }
      else if (match.awayTeam === id){
        if (match.homeTeamGoals < match.awayTeamGoals) {
          winsCounter += 1;
        }
      }
    });
    return winsCounter; 
  }

  public getTotalDraws = 
   (allMatches:IMatch[]) => {
    let drawsCounter = 0;
    allMatches.map((match) => {
      if (match.homeTeamGoals === match.awayTeamGoals) {
        drawsCounter += 1;
      }
    });
    return drawsCounter; 
  }

  public getTotalLosses = 
   (allMatches:IMatch[], type:String, id:number) => {
    let lossesCounter = 0;
    allMatches.map((match) => {
      if (match.homeTeam === id){
        if (match.homeTeamGoals < match.awayTeamGoals) {
          lossesCounter += 1;
        }
      }
      if (match.awayTeam === id){
        if (match.homeTeamGoals > match.awayTeamGoals) {
          lossesCounter += 1;
        }
      }
    });
    return lossesCounter; 
  }

  public getTotalGames = 
(allMatches: IMatch[]) => {
    const gamesCounter = allMatches.length;
    return gamesCounter; 
  }

  public getFavorGoals = 
   (allMatches:IMatch[], type:String, id:number) => {
    let favorGoalCounter = 0;
    allMatches.map((match) => {
      if (match.homeTeam === id){
        favorGoalCounter += match.homeTeamGoals;
      }
      if (match.awayTeam === id){
        favorGoalCounter += match.awayTeamGoals;
      }
    });
    return favorGoalCounter; 
  }

  public getOwnGoals = 
   (allMatches:IMatch[], type:String, id:number) => {
    let ownGoalCounter = 0;
    allMatches.map((match) => {
      if (match.homeTeam === id){
        ownGoalCounter += match.awayTeamGoals;
      }
      if (match.awayTeam === id){
        ownGoalCounter += match.homeTeamGoals;
      }
      
    });
    return ownGoalCounter; 
  }

}
  
  export default LeadeboardService;