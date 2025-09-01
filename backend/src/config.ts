export const config = {
  port: Number(process.env.PORT || 8080),
  omdbApiKey: process.env.OMDB_API_KEY || "",
  databaseUrl: process.env.DATABASE_URL || "",
};
