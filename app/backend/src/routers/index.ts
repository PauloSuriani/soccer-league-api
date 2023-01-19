import { Application as App } from 'express';

import LoginController from '../controllers/loginController';
import LoginValidation from '../middlewares/loginMiddleware';

import TeamController from '../controllers/teamController';

import MatchController from '../controllers/matchController';

import LeaderboardController from '../controllers/leaderboardController';

const loginController = new LoginController();
const loginValidation = new LoginValidation();

const teamController = new TeamController();

const matchController = new MatchController();

const leaderboardController = new LeaderboardController();

const Routers = (app: App) => {
  app.post('/login',
    loginValidation.loginVerify, 
    loginController.userLogin,
  );
  app.get('/login/validate', 
    loginController.loginTokenVerify,
  );
  app.get('/teams', 
    teamController.getAllTeams,
  );
  app.get('/teams/:id', 
    teamController.getOneTeam,
  );
  app.get('/matches', 
    matchController.getFilteredMatches,
  );
  app.post('/matches',
    matchController.setNewMatch,
  );
  app.patch('/matches/:id/finish',
    matchController.setFinishedMatch,
  );
  app.patch('/matches/:id',
    matchController.editMatch,
  );
  app.get('/leaderboard/home',
    leaderboardController.getHomeLeaderboard,
  )
  app.get('/leaderboard/away',
    leaderboardController.getAwayLeaderboard,
  )
  app.get('/leaderboard',
  leaderboardController.getLeaderboard,
)
}

export default Routers;