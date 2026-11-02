CREATE TABLE `admin_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kind` varchar(32) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`title` varchar(180) NOT NULL,
	`subtitle` varchar(240),
	`body` text,
	`url` varchar(500),
	`dataJson` text,
	`active` int NOT NULL DEFAULT 1,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventName` varchar(80) NOT NULL,
	`path` varchar(255),
	`referrer` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quote_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(120) NOT NULL,
	`phone` varchar(32),
	`brand` varchar(64) NOT NULL,
	`model` varchar(120) NOT NULL,
	`issue` varchar(160) NOT NULL,
	`details` text,
	`serviceMode` varchar(32) NOT NULL,
	`address` text,
	`complement` varchar(160),
	`reference` varchar(160),
	`intent` varchar(32) NOT NULL,
	`status` varchar(32) NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quote_requests_id` PRIMARY KEY(`id`)
);
