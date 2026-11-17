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
    password_login_string VARCHAR(100) NOT NULL
)
ENGINE = InnoDB;

CREATE TABLE an_organization.theItems (
    item_name VARCHAR(100) PRIMARY KEY NOT NULL,
    item_price INT NOT NULL,
    item_amount INT NOT NULL
)
ENGINE = InnoDB;

CREATE TABLE an_organization.donation_center (
    donation_center_name VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL,
    organization_name VARCHAR(100) NOT NULL,
    street_address VARCHAR(100) NOT NULL,
    gps_location POINT NOT NULL SRID 4326,
    zip_code INT NOT NULL,
    -- Not null since this is assuming
    -- a donation center can have no items.
    item_name VARCHAR(100),
    CONSTRAINT foreign_key_organization
        FOREIGN KEY (organization_name)
        REFERENCES organization(organization_name)
        ON DELETE CASCADE,
    CONSTRAINT foreign_key_items
        FOREIGN KEY (item_name)
        REFERENCES  theItems(item_name)
        ON DELETE CASCADE
)
ENGINE = InnoDB;
