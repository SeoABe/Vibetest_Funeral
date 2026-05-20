import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string
        const password = credentials?.password as string

        if (!email || !password) return null

        const adminEmail = process.env.ADMIN_EMAIL
        const adminHash = process.env.ADMIN_PASSWORD_HASH

        if (!adminEmail || !adminHash) return null
        if (email !== adminEmail) return null

        const valid = await bcrypt.compare(password, adminHash)
        if (!valid) return null

        return { id: "admin", email: adminEmail, name: "관리자" }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
      const isLoginPage = request.nextUrl.pathname === "/admin/login"
      if (isAdminRoute && !isLoginPage && !auth?.user) return false
      return true
    },
  },
})
