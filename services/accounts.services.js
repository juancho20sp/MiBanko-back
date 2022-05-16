const jwt= require("jsonwebtoken");
require('dotenv').config();

const {
    dbClient,
    Client,
  } = require('../database/database');

class AccountsService{
    constructor(){}

    async createAccount(accountData) {
        // Create DB connection
        const db = new Client(dbClient);
        let result;

        try {
            await db.connect();

            const {
            acc_number,
            acc_balance,
            acc_type,
            document_number,
            document_type,
            } = accountData;


            const creationDate = new Date().toISOString().slice(0, 10);

            result = await db.query(`INSERT INTO DB_ACCOUNTS(ACC_NUMBER, ACC_CREATION_DATE, ACC_BALANCE, ACC_TYPE, USR_NUMDOC, USR_DOCTYPE) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
            [acc_number,
            creationDate,
            acc_balance,
            acc_type.toUpperCase(),
            document_number,
            document_type.toUpperCase()]);

            result = result.rows[0];

        } catch(err) {
            result = {
                message: 'Something went wrong creating the account'
            }

            throw new Error(err)

        } finally {
            await db.end();
        }

        return result;
    }


    async getAccount(accountData){
        const db= new Client(dbClient);
        let result;

        try{
            await db.connect();

            const{
                document_number,
                document_type,
                acc_type
            }= accountData;

            result= await db.query(`SELECT * FROM DB_ACCOUNTS WHERE (DB_ACCOUNTS.USR_NUMDOC = $1 AND DB_ACCOUNTS.USR_DOCTYPE = $2 AND DB_ACCOUNTS.ACC_TYPE = $3)`, [document_number, document_type.toUpperCase(), acc_type.toUpperCase()]);

            result= result.rows;

        }catch(err){
            result = {
                message: 'Something went wrong getting the account'
            }

            throw new Error(err);
        }finally{
            await db.end();
        }

        return result;
    }

    async getAllAccounts(){

        // database connection
        const db= new Client(dbClient);
        let result;

        try{
            await db.connect();

            result= await db.query(`SELECT * FROM DB_ACCOUNTS`);

            result= result.rows;

        }catch(err){
            result = {
                message: 'Something went wrong getting all accounts'
            }
        }finally{
          await db.end();
        }

        return result;
    }

    async updateAccount(accountData){

        //database connection
        const db= new Client(dbClient);
        let result;

        try{
            await db.connect();

            const{
                document_number,
                document_type,
                acc_type,
                newAcc_balance
            }= accountData;

            result= await db.query(`UPDATE DB_ACCOUNTS SET ACC_BALANCE = $1 WHERE (DB_ACCOUNTS.USR_NUMDOC = $2 AND DB_ACCOUNTS.USR_DOCTYPE = $3 AND DB_ACCOUNTS.ACC_TYPE = $4) RETURNING *`, [newAcc_balance, document_number, document_type.toUpperCase(), acc_type.toUpperCase()]);

            result= result.rows[0];
        }catch(err){
            result = {
                message: 'Something went wrong updating account'
            }
        }finally{
            await db.end();
        }

        return result;
    }

    async getBalanceBank(){

        //database connection
        const db= new Client(dbClient);
        let result;

        try{
            await db.connect();

            result= await db.query(`select sum(acc_balance) from db_accounts da where (acc_type = $1)`,['AHORROS']);

            result= result.rows;
        }catch(err){
            result = {
                message: 'Something went wrong getting balance bank'
            }
        }finally{
            await db.end();
        }

        return result;
    }
}

module.exports= AccountsService;
