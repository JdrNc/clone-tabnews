import database from "infra/database.js";
async function status(request, response) {
  const updateAt = new Date().toISOString();
  const version = await database.query("SHOW server_version");
  const maxConnections = (await database.query("SHOW max_connections")).rows[0]
    .max_connections;

  const databaseName = process.env.POSTGRES_DB;

  const openedConnectionsResult = await database.query({
    text: "SELECT count(*) as opened_connections FROM pg_stat_activity WHERE datname=$1;",
    values: [databaseName],
  });
  const { opened_connections } = openedConnectionsResult.rows[0];

  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: parseInt(version.rows[0].server_version),
        max_connections: parseInt(maxConnections),
        opened_connections: parseInt(opened_connections),
      },
    },
  });
}
export default status;
