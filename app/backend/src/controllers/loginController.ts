import { Request, Response, NextFunction } from "express";
import LoginService from '../services/loginService';

class LoginController {
  private loginService: LoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  public userLogin =
  async (req: Request, res: Response, _next: NextFunction): Promise<Response | void> => {
    const { email, password } = req.body;
    try {
      const userLoginResult = await this.loginService.userLogin(email, password);
      return res.status(200).json(userLoginResult);
    } catch (error: unknown) {
      return res.status(401).json({ "message": "Incorrect email or password" });
    }
  }

  public loginTokenVerify =
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { authorization: token } = req.headers;
    if (!token) return res.status(404).json('Invalid token');
    try {
      const tokenRequest = await this.loginService.loginTokenVerify(token);
      return res.status(200).json(tokenRequest);
    } catch (error: unknown) {
      return next();
    }
  }
}

export default LoginController;