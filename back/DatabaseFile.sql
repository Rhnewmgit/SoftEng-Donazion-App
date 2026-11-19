DROP DATABASE IF EXISTS an_organization;

-- Notes:
-- - Unless if specified otherwise for a reason,
--   ALL TABLE VALUES ARE SET TO NOT NULL.

CREATE SCHEMA an_organization
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE an_organization;

CREATE TABLE an_organization.organization (
    organization_name VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
)
ENGINE = InnoDB;

CREATE TABLE an_organization.category_items (
    item_name VARCHAR(100) PRIMARY KEY NOT NULL,
    item_low_price INT NOT NULL,
    item_high_amount INT NOT NULL
)
ENGINE = InnoDB;

CREATE TABLE an_organization.category (
    category_name VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL,
    category_item_name VARCHAR(100) NOT NULL,
    CONSTRAINT foreign_category_item_names
        FOREIGN KEY (category_item_name)
        REFERENCES  category_items(item_name)
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

CREATE TABLE an_organization.location (
    street_address_one VARCHAR(100) PRIMARY KEY NOT NULL,
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

CREATE TABLE an_organization.donation_center (
    donation_center_name VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL,
    donation_center_password_hash VARCHAR(100) NOT NULL,
    organization_name VARCHAR(100) NOT NULL,
    street_address_one VARCHAR(100) NOT NULL,
    donation_center_wishlist VARCHAR(100),
    CONSTRAINT foreign_address
        FOREIGN KEY (street_address_one)
        REFERENCES location(street_address_one)
        ON DELETE CASCADE,
    CONSTRAINT foreign_center_wishlist
        FOREIGN KEY (donation_center_wishlist)
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
        REFERENCES donation_center(donation_center_name)
        ON DELETE CASCADE
)
ENGINE = InnoDB;
