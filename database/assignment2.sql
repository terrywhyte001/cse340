-- Data for table `account` --
INSERT INTO public.account(
	account_firstname,
	account_lastname,
	account_email,
	account_password
) VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- Udate Tony stack account to admin type --
UPDATE public.account SET account_type = 'Admin' WHERE account_id = 1;


--Deleting tony stack record from `account` table --s
DELETE FROM public.account WHERE account_id = 1



-- Modify the "GM Hummer" record description in `inventory` table --
UPDATE public.inventory SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
	WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- Use an INNER JOIN to get make, model, and classification_name for "Sport" category items in `inventory` table --
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
INNER JOIN public.classification c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';


-- Query to Add /vehicles to the File Paths in `inventory` table --
UPDATE public.inventory SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');