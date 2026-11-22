DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS category_items;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS donation_center;
DROP TABLE IF EXISTS organization;

-- Notes:
-- - Unless if specified otherwise for a reason,
--   ALL TABLE VALUES ARE SET TO NOT NULL.

CREATE TABLE organization (
    name VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL
)
ENGINE = InnoDB;


CREATE TABLE category (
    name VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL
)
ENGINE = InnoDB;


CREATE TABLE donation_center (
    name VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    street_address_one VARCHAR(100) NOT NULL,
    -- Street address 2 can be null since not every donation center
    -- has additional info regarding their location such as apartment number.
    street_address_two VARCHAR(100),
    -- Both of these are decimals since location
    -- points aren't restricted to exact values.
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    -- location_coordinates POINT GENERATED ALWAYS AS (ST_SRID(POINT(latitude, longitude), 4326)) STORED NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip INT NOT NULL
)
ENGINE = InnoDB;


CREATE TABLE category_items (
    item_name VARCHAR(100) PRIMARY KEY NOT NULL,
    low_value INT NOT NULL,
    high_value INT NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    CONSTRAINT foreign_category_name
        FOREIGN KEY (category_name)
        REFERENCES category(name)
        ON DELETE CASCADE
)
ENGINE = InnoDB;


CREATE TABLE items (
    id BINARY(16) PRIMARY KEY NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    value INT NOT NULL,
    donation_center_name VARCHAR(100) NOT NULL,
    CONSTRAINT foreign_category_item_name
        FOREIGN KEY (item_name)
        REFERENCES category_items(item_name)
        ON DELETE CASCADE,
    CONSTRAINT foreign_donation_center_name
        FOREIGN KEY (donation_center_name)
        REFERENCES donation_center(name)
        ON DELETE CASCADE
)
ENGINE = InnoDB;


CREATE TABLE wishlist_items (
    item_name VARCHAR(100) NOT NULL,
    donation_center_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (item_name, donation_center_name),
    CONSTRAINT foreign_item
        FOREIGN KEY (item_name)
        REFERENCES category_items(item_name)
        ON DELETE CASCADE,
    CONSTRAINT foreign_donation_center
        FOREIGN KEY (donation_center_name)
        REFERENCES donation_center(name)
        ON DELETE CASCADE
)
ENGINE = InnoDB;
