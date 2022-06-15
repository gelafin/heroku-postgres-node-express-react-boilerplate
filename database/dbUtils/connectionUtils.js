import pg from 'pg';

const connectionSettings = {
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false}
};

const HEROKU_FREE_PLAN_ROW_LIMIT = 10000;

// class adapted from https://javascript.info/custom-errors Jun 2022
class DbStorageLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = "DbStorageLimitError";
  }
}

// todo: create connection factory or use .env
// const pool = new pg.Pool({
//   host: 'localhost',
//   database: 'example_local_database_name',
//   port: 5432,
//   user: 'postgres',
// });

// create database connection pool
const pool = new pg.Pool(connectionSettings);

/**
 * logic and SQL copied from https://stackoverflow.com/a/2611745/14257952 Jun 2022
 * @returns -1 on invalid query result, else the total row count of all tables
 */
 export const getTotalDbRowCount = async client => {
  let allRowCountObjects = [];
  const sql = `
    WITH tbl AS
    (SELECT table_schema,
      TABLE_NAME
    FROM information_schema.tables
    WHERE TABLE_NAME not like 'pg_%'
      AND table_schema in ('public'))
    SELECT
      TABLE_NAME,
      (xpath('/row/c/text()',
        query_to_xml(format('select count(*)
          as c from %I.%I', table_schema, TABLE_NAME), FALSE, TRUE, '')))[1]::text::int
        AS rowCount
    FROM tbl
    ORDER BY rowCount DESC
  ;
  `;
  [client, allRowCountObjects] = await queryInTransaction(client, sql);

  const totalRows = allRowCountObjects?.reduce((subtotal, rowcountObj) => subtotal + rowcountObj.rowcount, 0) || -1;

  return [client, totalRows];
};

/**
 * Basic query function that does not transactionalize 
 * or protect from Heroku row limit.
 * Please use safeInsertQuery() for inserts and transactions
 */
export const query = async (sql, params = []) => {
  const client = await pool.connect();
  const result = await client.query(sql, params);
  client.release();
  return result.rows;
};

/**
 * Connects to db, executes a callback which receives the connection object, 
 * then checks for Heroku storage limit. Throws DbStorageLimitError if limit is exceeded.
 * Wraps callback in transaction statements--commits transaction if
 * Heroku storage limit is not exceeded and callback return value indicates intent to commit.
 * @param callback function that accepts a connection object,
 * uses queryInTransaction() 1+ times, then returns a list of:
 * [the same connection, true if the transaction should rollback, optional data to return]
 * @returns data provided by the callback
 */
export const safeInsertQuery = async (callback) => {
  let client = await beginTransaction();
  let callbackDataOut;
  let totalDbRows;
  let shouldRollback = false;
  let errorMessage = '';

  // This callback executes some queries and if they also contain transactions,
  // the callback can cause rollback by returning true for shouldRollback
  [client, shouldRollback, callbackDataOut] = await callback(client);

  if (! shouldRollback) {
    // respect limit of Heroku free plan database
    [client, totalDbRows] = await getTotalDbRowCount(client);

    if (totalDbRows === -1) {
      throw new Error('Can\'t use INSERT. Unable to query for the total count of current rows');
    }

    if (totalDbRows > HEROKU_FREE_PLAN_ROW_LIMIT) {
      shouldRollback = true;
      errorMessage = `
        Can\'t use INSERT. Database is too close to the ${HEROKU_FREE_PLAN_ROW_LIMIT} row limit`;
    }
  }

  if (shouldRollback) {
    rollbackTransaction(client);

    // notify caller of rollback
    throw new DbStorageLimitError(errorMessage);
  } else {
    commitTransaction(client);

    return callbackDataOut;
  }
};

/**
 * Runs a single query against the database and stays connected.
 * You have to call commitTransaction() or rollbackTransaction() to disconnect.
 */
const beginTransaction = async () => {
  const client = await pool.connect();

  client.query('BEGIN;');

  return client;
};

/**
 * Runs a single query against the database during an existing connection
 * and stays connected
 * @param client PG pool connection
 * @param sql string
 * @param params (optional) array of values to insert into prepared sql string
 */
export const queryInTransaction = async (client, sql, params=[]) => {
  const result = await client.query(sql, params);

  return [client, result?.rows];
};

const commitTransaction = async client => {
  await client.query('COMMIT;');
  await client.release();
};

const rollbackTransaction = async client => {
  await client.query('ROLLBACK;');
  await client.release();
};
