CREATE TABLE `feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(120) NOT NULL,
	`rating` int NOT NULL,
	`comment` text NOT NULL,
	`reviewDate` varchar(32),
	`source` varchar(64) NOT NULL DEFAULT 'Google',
	`published` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feedback_id` PRIMARY KEY(`id`)
);
