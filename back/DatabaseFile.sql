DROP DATABASE IF EXISTS an_organization;
CREATE SCHEMA an_organization
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE an_organization;

CREATE TABLE organization_table (
    organizationName VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL,
    passwordLoginString VARCHAR(100) NOT NULL
);

CREATE TABLE donation_center_table (
    donationCenterName VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL,
    organizationName VARCHAR(100) NOT NULL,
    streetAddress VARCHAR(100) NOT NULL,
    gpsLocation POINT NOT NULL SRID 4326,
    zipCode INT NOT NULL,
    CONSTRAINT foreign_key_organization
        FOREIGN KEY (donationCenterName)
        REFERENCES donation_center_table(donationCenterName)
        ON DELETE CASCADE
);

CREATE TABLE items_table (
    itemName VARCHAR(100) PRIMARY KEY NOT NULL,
    itemPrice INT NOT NULL,
    itemAmount INT NOT NULL
);