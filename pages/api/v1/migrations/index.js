import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function status(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" is not allowed`,
    });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationConfig = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };
    if (request.method === "GET") {
      const pedingMigrations = await migrationRunner(defaultMigrationConfig);
      return response.status(200).json(pedingMigrations);
    } else if (request.method === "POST") {
      const migratedMigration = await migrationRunner({
        ...defaultMigrationConfig,
        dryRun: false,
      });

      if (migratedMigration.length > 0) {
        return response.status(201).json(migratedMigration);
      }

      return response.status(200).json(migratedMigration);
    }
  } catch (error) {
    console.log(error);
  } finally {
    await dbClient.end();
  }
}
