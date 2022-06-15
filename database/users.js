import { query, safeInsertQuery, queryInTransaction } from './dbUtils/connectionUtils.js';

/**
 * example using query(), the basic way to query the database
 * which doesn't transactionalize or check Heroku storage limit
 */
export const getAllUsers = async () => {
  const userDataQueryResult = await query(`
    SELECT
      id, username
    FROM users
    ;
  `);

  return userDataQueryResult;
};

/**
 * example using safeInsertQuery(), the robust way to query the database
 * which transactionalizes and checks Heroku storage limit
 */
 export const insertToUsers = async newUser => {
  const relatedExampleItems = newUser?.relatedExampleItems;

  // define callback to give to safeInsertQuery()
  const transactionizedCallback = async client => {
    // shouldRollback tells safeInsertQuery() whether to rollback or not
    let shouldRollback = false;
    let transactionResult = [];
    let userInsertQueryResult = [];
    let exampleItemInsertQueryResult = [];

    try {
      // insert new user
      const userInsertSql = `
        INSERT INTO users (username)
        VALUES ($1)
        RETURNING id
        ;
      `;
      const userInsertParams = [newUser.username];
      [client, userInsertQueryResult] = await queryInTransaction(
        client,
        userInsertSql,
        userInsertParams
      );

      // EXAMPLE nested query
      // insert to some other table related to users
      try {
        if (userInsertQueryResult.length > 0) {
          const exampleNestedInsertSql = `
            INSERT INTO example_table (id, example)
            VALUES ($1, $2)
            ;
          `;
          const userId = userInsertQueryResult[0].id;

          // insert each example item
          for (const exampleItem of relatedExampleItems) {
            const exampleInsertParams = [userId, exampleItem.id];
            const [_, result] = await queryInTransaction(
              client,
              exampleNestedInsertSql,
              exampleInsertParams
            );
            exampleItemInsertQueryResult.push(result);
          }
        }
      } catch (error) {
        // error during example item insert
        // ask safeInsertQuery() to rollback
        shouldRollback = true;
        console.error('\terror during user example item insert', error);
      }

      // ask safeInsertQuery() to commit
      transactionResult = [userInsertQueryResult, exampleItemInsertQueryResult];
    } catch (err) {
      // error during user insert
      // ask safeInsertQuery() to rollback
      shouldRollback = true;
      console.error('\terror during user insert', err);
    }

    // return to safeInsertQuery()
    return [client, shouldRollback, transactionResult];
  };

  // query, in transaction, with callback giving permission to commit,
  // if safeInsertQuery() agrees to commit
  return await safeInsertQuery(transactionizedCallback);
};

/**
 * example using query(), the basic way to query the database
 * which doesn't transactionalize or check Heroku storage limit
 */
 export const updateUsers = async userToUpdate => {
  // update user
  const userUpdateQueryResult = await query(`
    UPDATE users
    SET username = $1
    WHERE id = $2
    ;
    `, [userToUpdate.username, userToUpdate.id]
  );

  return userUpdateQueryResult;
};

/**
 * example using query(), the basic way to query the database
 * which doesn't transactionalize or check Heroku storage limit
 */
 export const deleteFromUsers = async userIdToDelete => {
  await query(`
    DELETE FROM users
    WHERE id = $1
    ;
  `, [userIdToDelete]
  );
};
