-- Migration number: 0005 	 2026-11-05T19:44:10.501Z

CREATE TABLE submissions (
  user_id TEXT PRIMARY KEY,
  first_submit DATETIME default CURRENT_TIMESTAMP,
  last_submit DATETIME default CURRENT_TIMESTAMP,
  num_submissions INTEGER default 1
);