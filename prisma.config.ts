import "dotenv/config"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 마이그레이션은 Direct URL 사용 (pgbouncer 미경유)
    url: process.env.DIRECT_URL!,
  },
})
