import * as express from 'express';
import Routers from './routers';

class App {
  public app: express.Express;
  public routers = Routers;

  constructor() {
    this.app = express();
    this.config();
    this.routers(this.app);
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
    this.app.use(express.json());
  }

  // ...
  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`listening on port... ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
