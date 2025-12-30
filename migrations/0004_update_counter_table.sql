-- Migration number: 0004 	 2025-12-30T02:23:41.193Z

CREATE TABLE counter (
    name TEXT PRIMARY KEY,
    count INTEGER NOT NULL
);

INSERT INTO counter (name, count) VALUES ('about', 0), ('back_to_safety', 0), ('join_us', 0);