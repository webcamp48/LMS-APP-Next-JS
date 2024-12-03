import crypto from 'crypto';

export const generateOtp = () => {
    return crypto.randomInt(100000, 900000).toString();
}