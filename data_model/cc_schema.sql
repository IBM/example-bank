CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE DATABASE example;
\connect example;
CREATE SCHEMA IF NOT EXISTS bank;
set search_path to bank;

  CREATE TABLE IF NOT EXISTS users (
      user_id VARCHAR,
      subject VARCHAR UNIQUE,
      consent_given BOOLEAN NOT NULL,
      delete_requested BOOLEAN NOT NULL,
      PRIMARY KEY (user_id)
  );

  CREATE TABLE IF NOT EXISTS events (
      event_id VARCHAR,
      event_name VARCHAR NOT NULL,
      point_value INTEGER,
      location VARCHAR,
      start_time TIMESTAMP,
      end_time TIMESTAMP,
      description VARCHAR,
      PRIMARY KEY (event_id)
  );

  -- Events attended by users
  CREATE TABLE IF NOT EXISTS user_event (
    usr VARCHAR NOT NULL,
    event VARCHAR NOT NULL,
    PRIMARY KEY (usr, event),
    FOREIGN KEY (usr) REFERENCES users(user_id) ON UPDATE CASCADE,
    FOREIGN KEY (event) REFERENCES events(event_id) ON UPDATE CASCADE
  );
  
  -- Transactions
  CREATE TABLE IF NOT EXISTS transactions (
    transaction_id VARCHAR UNIQUE,
    usr VARCHAR NOT NULL,
    transaction_name VARCHAR,
    amount NUMERIC(15,2),
    category VARCHAR,
    points_earned REAL,
    processed BOOLEAN NOT NULL,
    date TIMESTAMP,
    PRIMARY KEY (transaction_id, usr),
    FOREIGN KEY (usr) REFERENCES users(user_id) ON UPDATE CASCADE
  );

