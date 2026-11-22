INSERT INTO an_organization.organization (name,password_hash) VALUES
	 ('admin','$2b$08$EYDsAep98Ggi5pFeo9R6wuSmku0s5IoPybwjdudFQC7Ennmzpx2EC');

INSERT INTO an_organization.donation_center (name,password_hash,street_address_one,street_address_two,latitude,longitude,city,state,zip) VALUES
	 ('testcenter1','$2a$08$e08sUbv/KIjJBo9CKWpTW.RycF7yEISNlcT3eqbYj/mtu4i3J4nSK','100 Main St','Floor 2',-71.80800963,42.274088724326,'Worcester','MA',1609),
	 ('testcenter2','$2a$08$zaGVnTzVoafbUciaFrIk8.uim6bN2UOuIgfmTdaejC9A4UcygxmH.','200 Main St.',NULL,0.00000000,0.00000000,'N/A','ZZ',12345);
-- testpass1, testpass2

INSERT INTO an_organization.category (name) VALUES
	 ('Furniture');

INSERT INTO an_organization.category_items (item_name,low_value,high_value,category_name) VALUES
    ('Armchair', 10.0, 200.0, 'Furniture'),
    ('Plastic lawnchair', 2.0, 25.0, 'Furniture');

INSERT INTO an_organization.items (id,item_name,value,donation_center_name) VALUES
    (UUID_TO_BIN(UUID()),'Armchair', 190.0, 'testcenter1'),
    (UUID_TO_BIN(UUID()),'Armchair', 54.0, 'testcenter1'),
    (UUID_TO_BIN(UUID()),'Plastic lawnchair', 5.0, 'testcenter1');