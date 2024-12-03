import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';


export const authOptions : NextAuthOptions  = {
    providers : [
    // OAuth authentication providers...
      GithubProvider({
        clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string || "",
        clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET as string || ""
      }),
      GoogleProvider({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string || "",
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string || ""
      }),
    ],
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET as string, 
    debug: true,
}

export default NextAuth(authOptions);