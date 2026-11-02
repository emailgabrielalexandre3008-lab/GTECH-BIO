CREATE TABLE `admin_action_tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tokenHash` varchar(64) NOT NULL,
	`email` varchar(320) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`usedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_action_tickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_action_tickets_tokenHash_unique` UNIQUE(`tokenHash`)
);
