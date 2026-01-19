import bcrypt from 'bcryptjs';

export const hashPassword = pwd => bcrypt.hash(pwd, 12);
export const comparePassword = (pwd, hash) => bcrypt.compare(pwd, hash);
