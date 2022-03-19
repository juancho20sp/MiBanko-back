//const jwt = require('jsonwebtoken');
require('dotenv').config();


const {
  dbClient,
  Client
} = require('../database/database');


class TransctionsService{
  constructor(){}

  async createTransactionIntra(transactionintraData) {
    // Create DB connection
    const db = new Client(dbClient);
    let result;

    try {
      await db.connect();
      const {
        destiny_account,
        source_acc,
        amount,
        tdoc,
        ndoc,
        overdraw,
        amount_overdraw
      } = transactionintraData;
      const creationDate = new Date().toISOString().slice(0, 10);
      const destiny_bank=1;

      let destiny = await db.query(`SELECT acc_id FROM DB_ACCOUNTS WHERE USR_DOCTYPE=($1) AND ACC_NUMBER=($2)`, [tdoc,
        destiny_account
      ]);

      let source = await db.query(`SELECT acc_id FROM DB_ACCOUNTS WHERE ACC_NUMBER=($1)`, [source_acc]);

      source=source.rows[0];

      if(destiny.rowCount>0){

        destiny= destiny.rows[0];


        if(overdraw){
          const status ="PENDIENTE";
          const tasaction_type ="INTRA";
          const status_overdraw = null;
          result=await db.query(`INSERT INTO DB_TRANSACTIONS_INTRA(tr_date, tr_destiny_bank, tr_destiny_account, tr_source_account, amount, estatus) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [creationDate,
            destiny_bank,
            destiny.acc_id,
            source.acc_id,
            amount,
            status
          ]);
          result=result.rows[0];
          await db.query(`INSERT INTO db_overdraws(ovd_creation_date, ovd_is_authorized, amount, tr_type, tr_id) VALUES($1, $2, $3, $4, $5) RETURNING *`, [
            creationDate,
            status_overdraw,
            amount_overdraw,
            tasaction_type,
            result.tr_id
          ]);
        }
        else{

          const status ="APROBADA";
          result=await db.query(`INSERT INTO DB_TRANSACTIONS_INTRA(tr_date, tr_destiny_bank, tr_destiny_account, tr_source_account, amount, estatus) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [creationDate,
            destiny_bank,
            destiny.acc_id,
            source.acc_id,
            amount,
            status
          ]);

          await db.query(`UPDATE DB_ACCOUNTS SET acc_balance= (acc_balance-($1)) WHERE acc_id=($2)`, [amount,
            source.acc_id
          ]);
          await db.query(`UPDATE DB_ACCOUNTS SET acc_balance= (acc_balance+($1)) WHERE acc_id=($2)`, [amount,
            destiny.acc_id
          ]);
          result = result.rows[0];
        }
      }

    } catch(err) {
      result = {
        message: 'Something went wrong database'
      }
    } finally {
      await db.end();
    }

    return result;
  }


  async createTransactionInter(transactionInterData) {
    // Create DB connection
    const db = new Client(dbClient);
    let result;

    try {
      await db.connect();

      const {
        tr_destiny_bank,
        tr_destiny_acc,
        tr_source_acc,
        tr_destiny_receiver_name,
        tr_destiny_receiver_lastName,
        tr_destiny_receiver_typeDoc,
        tr_destiny_receiver_docNum,
        amount,
        overdraw,
        amount_overdraw
      } = transactionInterData;

      const creationDate = new Date().toISOString().slice(0, 10);

      let source = await db.query(`SELECT acc_id FROM DB_ACCOUNTS WHERE ACC_NUMBER=($1)`, [tr_source_acc]);

      source = source.rows[0];

      if(overdraw){
        const status ="PENDIENTE";
        const tasaction_type ="INTER";
        const status_overdraw = null;

        result = await db.query(`INSERT INTO DB_TRANSACTIONS_INTER(tr_date, tr_destiny_bank, tr_destiny_account, tr_source_account, tr_destiny_receiver_name , tr_destiny_receiver_lastName, tr_destiny_receiver_typedoc, tr_destiny_receiver_docnum, amount, estatus) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [creationDate,
          tr_destiny_bank,
          tr_destiny_acc,
          source.acc_id,
          tr_destiny_receiver_name,
          tr_destiny_receiver_lastName,
          tr_destiny_receiver_typeDoc,
          tr_destiny_receiver_docNum,
          amount,
          status
        ]);
        result=result.rows[0];
        await db.query(`INSERT INTO db_overdraws(ovd_creation_date, ovd_is_authorized, amount, tr_type, tr_id) VALUES($1, $2, $3, $4, $5) RETURNING *`, [
          creationDate,
          status_overdraw,
          amount_overdraw,
          tasaction_type,
          result.tr_id
        ]);

      }else{

        const status ="APROBADA";

        result = await db.query(`INSERT INTO DB_TRANSACTIONS_INTER(tr_date, tr_destiny_bank, tr_destiny_account, tr_source_account, tr_destiny_receiver_name, tr_destiny_receiver_lastName, tr_destiny_receiver_typedoc, tr_destiny_receiver_docnum, amount, estatus) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [creationDate,
          tr_destiny_bank,
          tr_destiny_acc,
          source.acc_id,
          tr_destiny_receiver_name,
          tr_destiny_receiver_lastName,
          tr_destiny_receiver_typeDoc,
          tr_destiny_receiver_docNum,
          amount,
          status]);


        await db.query(`UPDATE DB_ACCOUNTS SET acc_balance=acc_balance-($1) WHERE acc_id=($2)`, [amount, source.acc_id]);
        result = result.rows[0];
      }



    } catch(err) {
      result = {
        message: 'Something went wrong interbank transaction'
      }
    } finally {
      await db.end();
    }

    return result;
  }



  async getTransactionsInfo() {
    // Create DB connection
    const db = new Client(dbClient);
    let numTransactions = 0;
    let valueTransactions = 0;

    try {
      await db.connect();

      numTransactions = await db.query(`SELECT COUNT(*) from (SELECT tr_id FROM db_transactions_intra UNION ALL SELECT tr_id FROM db_transactions_inter) AS dti;`);
      numTransactions = numTransactions.rows[0];
      numTransactions = numTransactions.count;
      valueTransactions = await db.query(`SELECT SUM(amount) FROM ((SELECT amount FROM db_transactions_intra WHERE estatus='APROBADA') UNION ALL (SELECT amount FROM db_transactions_inter WHERE estatus='APROBADA')) AS dti;`);
      valueTransactions = valueTransactions.rows[0];
      valueTransactions = valueTransactions.sum;
    } catch(err) {
        return{
          message: 'Something went wrong'
        };
    } finally {
      await db.end();
    }

    return {
      numTransactions,
      valueTransactions
    };
  }

  async getTransactionsDetail() {
    // Create DB connection
    const db = new Client(dbClient);
    let result;

    try {
      await db.connect();

      result = await db.query(`SELECT * FROM (
        SELECT dda AS date, dta AS amount, snd AS source_account, sdo AS source_doctype, snu AS source_numdoc, sn AS source_name, sln AS source_lastname, dnd AS destiny_account, ddo AS destiny_doctype, dnu AS destiny_numdoc, dn AS destiny_name, dln AS destiny_lastname FROM
         ((SELECT tr.tr_id AS sti, tr.tr_date AS sda, tr.amount AS sta, da.acc_number AS snd, du.usr_doctype AS sdo, du.usr_numdoc AS snu, du.usr_name AS sn, du.usr_lastname AS sln
         FROM db_transactions_intra tr JOIN db_accounts da ON da.acc_id = tr.tr_source_account
         JOIN db_users du ON du.usr_doctype = da.usr_doctype AND du.usr_numdoc = da.usr_numdoc ) AS source_account JOIN
         (SELECT tr.tr_id AS dti, tr.tr_date AS dda, tr.amount AS dta, da.acc_number AS dnd, du.usr_doctype AS ddo, du.usr_numdoc AS dnu, du.usr_name AS dn, du.usr_lastname AS dln
         FROM db_transactions_intra tr JOIN db_accounts da ON da.acc_id = tr.tr_destiny_account
         JOIN db_users du ON du.usr_doctype = da.usr_doctype AND du.usr_numdoc = da.usr_numdoc ) AS destiny_account
         ON source_account.sti=destiny_account.dti)
         UNION ALL
         (SELECT tr.tr_date AS date, tr.amount AS amount, da.acc_number AS source_account, du.usr_doctype AS source_doctype, du.usr_numdoc AS source_numdoc, du.usr_name AS source_name, du.usr_lastname AS source_lastname,
          tr.tr_destiny_account AS destiny_account, tr.tr_destiny_receiver_typedoc AS destiny_doctype, tr.tr_destiny_receiver_docnum AS destiny_numdoc, tr.tr_destiny_receiver_name AS destiny_name, tr.tr_destiny_receiver_lastname AS destiny_lastname
         FROM db_transactions_inter tr JOIN db_accounts da ON da.acc_id = tr.tr_source_account
         JOIN db_users du ON du.usr_doctype = da.usr_doctype AND du.usr_numdoc = da.usr_numdoc ))as todo ; `);

      result=result.rows;

    } catch(err) {
        return{
          message: 'Something went wrong'
        };
    } finally {
      await db.end();
    }

    return {
      result
    };
  }

  async getTransactionsUsuario(data) {
    // Create DB connection
    const db = new Client(dbClient);
    let result;
    const{account}=data;

    try {
      await db.connect();

      result = await db.query(`SELECT * FROM (
        SELECT dda AS date, dta AS amount, snd AS source_account, sdo AS source_doctype, snu AS source_numdoc, sn AS source_name, sln AS source_lastname, dnd AS destiny_account, ddo AS destiny_doctype, dnu AS destiny_numdoc, dn AS destiny_name, dln AS destiny_lastname FROM
         ((SELECT tr.tr_id AS sti, tr.tr_date AS sda, tr.amount AS sta, da.acc_number AS snd, du.usr_doctype AS sdo, du.usr_numdoc AS snu, du.usr_name AS sn, du.usr_lastname AS sln
         FROM db_transactions_intra tr JOIN db_accounts da ON da.acc_id = tr.tr_source_account
         JOIN db_users du ON du.usr_doctype = da.usr_doctype AND du.usr_numdoc = da.usr_numdoc ) AS source_account JOIN
         (SELECT tr.tr_id AS dti, tr.tr_date AS dda, tr.amount AS dta, da.acc_number AS dnd, du.usr_doctype AS ddo, du.usr_numdoc AS dnu, du.usr_name AS dn, du.usr_lastname AS dln
         FROM db_transactions_intra tr JOIN db_accounts da ON da.acc_id = tr.tr_destiny_account
         JOIN db_users du ON du.usr_doctype = da.usr_doctype AND du.usr_numdoc = da.usr_numdoc ) AS destiny_account
         ON source_account.sti=destiny_account.dti)
         UNION ALL
         (SELECT tr.tr_date AS date, tr.amount AS amount, da.acc_number AS source_account, du.usr_doctype AS source_doctype, du.usr_numdoc AS source_numdoc, du.usr_name AS source_name, du.usr_lastname AS source_lastname,
          tr.tr_destiny_account AS destiny_account, tr.tr_destiny_receiver_typedoc AS destiny_doctype, tr.tr_destiny_receiver_docnum AS destiny_numdoc, tr.tr_destiny_receiver_name AS destiny_name, tr.tr_destiny_receiver_lastname AS destiny_lastname
         FROM db_transactions_inter tr JOIN db_accounts da ON da.acc_id = tr.tr_source_account
         JOIN db_users du ON du.usr_doctype = da.usr_doctype AND du.usr_numdoc = da.usr_numdoc ))as todo
        WHERE source_account=($1) OR destiny_account =($1);`,[account]);


      result=result.rows;
    } catch(err) {
        return{
          message: 'Something went wrong'
        };
    } finally {
      await db.end();
    }

    return {
      result
    };
  }

  async getOverdraws() {
    // Create DB connection
    const db = new Client(dbClient);
    let result;

    try {
      await db.connect();

      result = await db.query(`SELECT * FROM(
        (SELECT do2.ovd_creation_date AS date, do2.amount AS amount_overdraw, do2.tr_type AS transaction_type, dti.amount AS monto_transaccion,
        da.acc_number AS account_number, du.usr_doctype AS usr_doctype, du.usr_numdoc AS usr_numdoc, du.usr_name AS usr_name,
        du.usr_lastname AS usr_lastname FROM db_overdraws  do2 JOIN  db_transactions_inter dti ON do2.tr_id  = dti.tr_id JOIN
        db_accounts da ON dti.tr_source_account = da.acc_id  JOIN db_users du ON da.usr_doctype=du.usr_doctype AND
        da.usr_numdoc=du.usr_numdoc)
        UNION ALL
        (SELECT do2.ovd_creation_date AS date, do2.amount AS amount_overdraw, do2.tr_type AS transaction_type, dti.amount AS monto_transaccion,
        da.acc_number AS account_number, du.usr_doctype AS usr_doctype, du.usr_numdoc AS usr_numdoc, du.usr_name AS usr_name,
        du.usr_lastname AS usr_lastname FROM db_overdraws  do2 JOIN  db_transactions_intra dti ON do2.tr_id  = dti.tr_id JOIN
        db_accounts da ON dti.tr_source_account = da.acc_id  JOIN db_users du ON da.usr_doctype=du.usr_doctype AND
        da.usr_numdoc=du.usr_numdoc)) AS todo;`);


      result=result.rows;
    } catch(err) {
        return{
          message: 'Something went wrong'
        };
    } finally {
      await db.end();
    }

    return {
      result
    };
  }

  async setOverdraws(data) {
    // Create DB connection
    const db = new Client(dbClient);
    let result;
    const{estado, id_overdraw}=data;
    try {
      await db.connect();

      result = await db.query(`UPDATE db_overdraws SET ovd_is_authorized=($1) WHERE ovd_id=($2) RETURNING *`,[estado,id_overdraw]);
      result = result.rows[0];
      if(estado){
        let estatus="APROBADA";
        if(result.tr_type==="INTER"){
          let transaccion = await db.query(`UPDATE db_transactions_inter SET estatus=($1) WHERE tr_id=($2) RETURNING *`,[estatus,result.tr_id]);
          transaccion=transaccion.rows[0];
          await db.query(`UPDATE db_accounts SET acc_balance=acc_balance-($1) WHERE acc_id=($2)`,[transaccion.amount,transaccion.tr_source_account]);
        }
        else if(result.tr_type==="INTRA"){
          let transaccion = await db.query(`UPDATE db_transactions_intra SET estatus=($1) WHERE tr_id=($2) RETURNING *`,[estatus,result.tr_id]);
          transaccion=transaccion.rows[0];
          await db.query(`UPDATE db_accounts SET acc_balance=acc_balance-($1) WHERE acc_id=($2)`,[transaccion.amount,transaccion.tr_source_account]);
          await db.query(`UPDATE db_accounts SET acc_balance=acc_balance+($1) WHERE acc_id=($2)`,[transaccion.amount,transaccion.tr_destiny_account]);
        }
      }
      else{
        let estatus="RECHAZADA";
        if(result.tr_type=="INTER"){
          await db.query(`UPDATE db_transactions_inter SET estatus=($1) WHERE tr_id=($2)`,[estatus,result.tr_id]);
        }
        else if(result.tr_type==="INTER"){
          await db.query(`UPDATE db_transactions_intra SET estatus=($1) WHERE tr_id=($2)`,[estatus,result.tr_id]);
        }
      }
    } catch(err) {
        return{
          message: 'Something went wrong'
        };
    } finally {
      await db.end();
    }

    return {
      result
    };
  }

}



module.exports = TransctionsService;
