import NextAuth, { getServerSession } from "next-auth"
import FortyTwoProvider from "next-auth/providers/42-school";
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

// export default N ext
export default NextAuth({
      session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60,
      },
      providers: [
        FortyTwoProvider({
          clientId: process.env.FORTY_TWO_CLIENT_ID,
          clientSecret: process.env.FORTY_TWO_CLIENT_SECRET,
          profile(profile) {
            return {
              id: profile.id.toString(),
              name: profile.usual_full_name,
              email: profile.email,
              picture: profile.image_url,
              username: profile.login,
              isFt: true
            }
          }
        }),

        CredentialsProvider({
          
          async authorize(credentials, req) {
          const response = await axios.post("http://back:4000/user/login", {
              email :      credentials.email,
              password :  credentials.password,
          })
          const data = response.data.response;
          if (data) {
            const user = { id: data.id , name: data.name, email: data.email, picture: data.picture, username: data.username , status: data.status, enable2FA: data.enable2FA, authenticate: data.authenticate ,isFirst: data.isFirst, rank: data.rank, friends: data.friends}
            return user;
          }
          else
            return null
          }
        })
      ],
      secret: process.env.SECRET,
      callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
          if (user.isFt) {
              await axios.post("http://back:4000/user/loginWithFortyTwo", {
                id : user.id,
                username : user.username,
                name : user.name,
                email : user.email,
                picture : user.picture, 
              })
          }
          return user 
        },
            
        async redirect({ url, baseUrl }) {
          return baseUrl; 
        },
        async session({ session, user, token }) {
          if (token != undefined){
            await axios.post("http://back:4000/user/requestUser", {
              id: token.user.id,
            })
            .then(response => {
              session.user = response.data.response;
              session.toto = "toto"
            })
          }
          return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
          if (user != undefined){
            token.user = user;
          }
          return token
        },
    }
  });