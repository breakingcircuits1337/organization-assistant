import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.NEXT_PUBLIC_EMAIL_SERVER,
      from: process.env.NEXT_PUBLIC_EMAIL_FROM,
    }),
    CredentialsProvider({
      name: "Demo login",
      credentials: { username: { label: "Username", type: "text" } },
      async authorize(credentials) {
        if (!credentials?.username) return null
        // Demo: auto-create user with username as email
        const email = `${credentials.username}@demo.local`
        let user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
          user = await prisma.user.create({ data: { email, name: credentials.username } })
        }
        return user
      },
    }),
  ],
  session: { strategy: "database" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {},
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }