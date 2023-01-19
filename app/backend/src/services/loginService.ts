import * as bcrypt from 'bcryptjs';
import UserModel from '../database/models/user';
import * as JWT from 'jsonwebtoken';
import { readFileSync } from 'fs';

class LoginService {
  private userModel = UserModel;

  public userLogin =
  async (email: string, password: string): Promise<object> => {
    const userSearch = await this.userModel.findOne({ where: { email }})
  
    // console.log(userSearch);
    if (!userSearch) throw new Error('Incorrect email or password');

    if (!bcrypt.compareSync(password, userSearch.password)) {
      throw new Error('Incorrect email or password');
      // return { message: 'Incorrect email or password' };
    }

    const jwtSecret = readFileSync('jwt.evaluation.key', 'utf8');
    const newToken = JWT.sign({ email }, jwtSecret, {
      expiresIn: '15m',
      algorithm: 'HS256',
    });

    console.log(newToken);

    return { 
      user: { 
        id: userSearch.id,
        username: userSearch.username,
        role: userSearch.role,
        email,
      },
      token: newToken
    } 

  }

  public loginTokenVerify =
  async (token: string): Promise<string> => {
    const jwtSecret = readFileSync('jwt.evaluation.key', 'utf8');
    const { email } = JWT.verify(token, jwtSecret) as JWT.JwtPayload;
    const userFind = await this.userModel.findOne({ where: { email }});
    
    if (!userFind) throw new Error('Invalid token!');
    
    return userFind.role;
  }

}

export default LoginService;