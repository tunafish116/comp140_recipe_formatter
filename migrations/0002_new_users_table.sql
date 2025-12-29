-- Migration number: 0002 	 2025-12-29T21:10:38.112Z

CREATE TABLE users (
  ip TEXT PRIMARY KEY,
  last_submit INTEGER
);