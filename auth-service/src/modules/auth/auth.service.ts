import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.model';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    @Inject('USER_EVENTS') private readonly userEventsClient: ClientProxy,
  ) {}

  async register(name: string, email: string, pass: string) {
    const hash = await bcrypt.hash(pass, 10);    
    const user = await this.userModel.create({ name, email, passwordHash: hash });
    // publish user.created event
    this.userEventsClient.emit('user.created', {
      userId: (user._id as Types.ObjectId).toString(),
      email: user.email,
      name: user.name,
    });
    return user;
  }

  async login(email: string, pass: string) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(pass, user.passwordHash)))
      throw new Error('Invalid credentials');
    const payload = { sub: (user._id as Types.ObjectId).toString(), name: user.name, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRefresh;
    await user.save();

    return { accessToken, refreshToken };
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }

  async logout(userId: string) {
    await this.userModel.updateOne({ _id: userId }, { $unset: { refreshToken: '' } });
    return { message: 'Logged out' };
  }
}