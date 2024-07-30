import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: 1800,
};

export const signJwtAccessToken = (payload: JwtPayload, options: SignOption = DEFAULT_SIGN_OPTION) => {
  const secretKey = process.env.NEXTAUTH_SECRET;
  const token = jwt.sign(payload, secretKey, options);
  return token;
};

export const verifyJwt = (token: string) => {
  try {
    const secretKey = process.env.NEXTAUTH_SECRET;
    const decoded = jwt.verify(token, secretKey);
    return decoded as JwtPayload;
  } catch (error) {
    return "";
  }
};
