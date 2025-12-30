-- Migration number: 0003 	 2025-12-30T02:03:59.929Z

CREATE TABLE counter (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    about_count INTEGER NOT NULL,
    back_to_safety_count INTEGER NOT NULL,
    join_us_count INTEGER NOT NULL
);

INSERT INTO counter (id, about_count, back_to_safety_count, join_us_count) VALUES (1, 0, 0, 0);