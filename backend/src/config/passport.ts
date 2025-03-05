import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import User from '../models/User';
import config from './config';
import { JwtPayload } from 'jsonwebtoken';

if (!config.auth.jwtSecret) {
    throw new Error('Missing jwt secret');
}

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.auth.jwtSecret,
    ignoreExpiration: false,
};

passport.use(
    new JwtStrategy(
        options,
        async (payload: JwtPayload, done: (error: Error | null, user?: User | false) => void): Promise<void> => {
            try {
                const user: User | null = await User.findByPk(payload.id);
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (error) {
                return done(error instanceof Error ? error : new Error(String(error)), false);
            }
        },
    ),
);

export default passport;
