import type { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & {
      id: string;
      username: string
      friends: number[]
      picture: any
      authenticate: boolean
      isFirst: boolean
      enable2FA: boolean
    };
  }
}

declare module 'next-auth/jwt/types' {
  interface JWT {
    uid: string;
  }
}