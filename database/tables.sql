-- -----------------------------------------------------
-- Table `DB_USER`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS DB_USERS(
    USR_NUMDOC                    	INTEGER     	NOT NULL, -- TODO -> Crear un check para que inicie con ("CC", "TI", "CE", "PS") (puede ser en el back)
    USR_NAME                        VARCHAR(100)    NOT NULL,
    USR_LASTNAME                    VARCHAR(100)    NOT NULL,
    USR_ROLE                        VARCHAR(50)     NOT NULL, -- TODO -> Crear un check para este tipo de dato ("USER", "ADMIN", "AUDITOR")
    USR_BIRTHDATE                   DATE            NOT NULL,
    USR_CREATION_DATE               DATE            NOT NULL,
    USR_DOCTYPE						VARCHAR(4)		NOT NULL
);


-- -----------------------------------------------------
-- Table `DB_LOGIN`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS DB_LOGIN(
	UR_DOCTYPE				        VARCHAR(4)		NOT NULL,
    USR_USERNAME                    VARCHAR(75)     NOT NULL,
    USR_EMAIL                       VARCHAR(150)    NOT NULL,
    USR_PASSWORD                    VARCHAR(300)    NOT NULL,
    USR_NUMDOC                    	INTEGER     	NOT NULL  -- TODO -> Crear un check para que inicie con ("CC", "TI", "CE", "PS") (puede ser en el back)
);


-- -----------------------------------------------------
-- Table `DB_TRANSACTIONS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS DB_TRANSACTIONS_INTRA(
    TR_ID                 SERIAL              PRIMARY KEY,
    TR_DATE               DATE                NOT NULL,
    TR_DESTINY_BANK       INTEGER             NOT NULL,
    TR_DESTINY_ACCOUNT    INTEGER	          NOT NULL,
    TR_SOURCE_ACCOUNT     INTEGER             NOT NULL,
    AMOUNT                DOUBLE PRECISION    NOT NULL,
    ESTATUS               BOOLEAN             NOT NULL
);


-- -----------------------------------------------------
-- Table `DB_TRANSACTIONS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS DB_TRANSACTIONS_INTER (
    TR_ID                           SERIAL              NOT NULL,
    TR_DATE                         DATE                NOT NULL,
    TR_DESTINY_BANK                 INTEGER             NOT NULL,
    TR_DESTINY_ACCOUNT              INTEGER	            NOT NULL,
    TR_SOURCE_ACCOUNT               INTEGER             NOT NULL,
    TR_DESTINY_RECIVER_NAME         VARCHAR(100)        NOT NULL,
    TR_DESTINY_RECIVER_LASTNAME     VARCHAR(100)        NOT NULL,
    TR_DESTINY_RECIVER_TYPEDOC      VARCHAR(4)          NOT NULL,
    TR_DESTINY_RECIVER_DOCNUM       INTEGER             NOT NULL,
    AMOUNT                          DOUBLE PRECISION    NOT NULL

);

-- -----------------------------------------------------
-- Table `DB_ACCOUNTS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS DB_ACCOUNTS(
    ACC_ID                 	SERIAL              PRIMARY KEY,
    ACC_NUMBER             	VARCHAR(300)        NOT NULL,
    ACC_CREATION_DATE      	DATE                NOT NULL,
    ACC_BALANCE            	DOUBLE PRECISION    NOT NULL,
    ACC_TYPE               	VARCHAR(75)         NOT NULL, -- TODO -> Crear un check para este tipo de dato ('AHORROS', 'CORRIENTE')
    USR_DOCTYPE				      VARCHAR(4)	        NOT NULL,
    USR_NUMDOC              INTEGER     		    NOT NULL  -- TODO -> Crear un check para que inicie con ("CC", "TI", "CE", "PS") (puede ser en el back)
);

-- -----------------------------------------------------
-- Table `DB_OVERDRAWS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS DB_OVERDRAWS(
    OVD_ID                 SERIAL               PRIMARY KEY,
    ACC_NUMBER             INTEGER		        NOT NULL,
    OVD_CREATION_DATE      DATE                 NOT NULL,
    OVD_IS_AUTHORIZED      BOOLEAN              NOT NULL, -- TODO -> Crear un trigger porque cuando se cree un overdraw debe crearse como NO autorizado (también se puede hacer en el back)
    AMOUNT                 INTEGER              NOT NULL
);

-- -----------------------------------------------------
-- Table `DB_BANKS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS DB_BANKS(
    BNK_ID                 SERIAL               PRIMARY KEY,
    BNK_NAME              VARCHAR(300)          NOT NULL-- TODO -> Crear un trigger porque cuando se cree un overdraw debe crearse como NO autorizado (también se puede hacer en el back)
);

