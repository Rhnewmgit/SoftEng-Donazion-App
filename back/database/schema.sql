DROP TABLE IF EXISTS an_organization.wishlist_items;
DROP TABLE IF EXISTS an_organization.items;
DROP TABLE IF EXISTS an_organization.category_items;
DROP TABLE IF EXISTS an_organization.category;
DROP TABLE IF EXISTS an_organization.donation_center;
DROP TABLE IF EXISTS an_organization.organization;

-- Notes:
-- - Unless if specified otherwise for a reason,
--   ALL TABLE VALUES ARE SET TO NOT NULL.

CREATE TABLE an_organization.organization (
    organization_name VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL
)
ENGINE = InnoDB;


CREATE TABLE an_organization.category (
    name VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL
)
ENGINE = InnoDB;


CREATE TABLE an_organization.donation_center (
    name VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    street_address_one VARCHAR(100) NOT NULL,
    -- Street address 2 can be null since not every donation center
    -- has additional info regarding their location such as apartment number.
    street_address_two VARCHAR(100),
    -- Both of these are decimals since location
    -- points aren't restricted to exact values.
    latitude DECIMAL(10, 8)  NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location_coordinates POINT GENERATED ALWAYS AS (ST_SRID(POINT(latitude, longitude), 4326)) STORED NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip INT NOT NULL
)
ENGINE = InnoDB;


CREATE TABLE an_organization.category_items (
    item_name VARCHAR(100) PRIMARY KEY NOT NULL,
    item_low_price INT NOT NULL,
    item_high_amount INT NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    CONSTRAINT foreign_category_name
        FOREIGN KEY (category_name)
        REFERENCES  category(name)
        ON DELETE CASCADE
)
ENGINE = InnoDB;


CREATE TABLE an_organization.items (
    item_name VARCHAR(100) PRIMARY KEY NOT NULL,
    item_price INT NOT NULL,
    CONSTRAINT foreign_category_item_name
        FOREIGN KEY (item_name)
        REFERENCES  category_items(item_name)
        ON DELETE CASCADE
)
ENGINE = InnoDB;


CREATE TABLE wishlist_items (
    wishlist_item_name VARCHAR(100) NOT NULL,
    donation_center_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (wishlist_item_name, donation_center_name),
    CONSTRAINT foreign_wishlist
        FOREIGN KEY (wishlist_item_name)
        REFERENCES  category_items(item_name)
        ON DELETE CASCADE,
    CONSTRAINT foreign_donation_center
        FOREIGN KEY (donation_center_name)
        REFERENCES donation_center(name)
        ON DELETE CASCADE
)
ENGINE = InnoDB;
