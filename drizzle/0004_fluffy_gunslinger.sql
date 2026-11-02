CREATE TABLE `part_price_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`catalogKey` varchar(500) NOT NULL,
	`brand` varchar(80) NOT NULL,
	`model` varchar(160) NOT NULL,
	`category` varchar(32) NOT NULL,
	`serviceType` varchar(120) NOT NULL,
	`quality` varchar(120),
	`supplierCost` decimal(10,2) NOT NULL,
	`sourceImportId` int NOT NULL,
	`sourceFileName` varchar(255) NOT NULL,
	`changedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `part_price_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `parts_catalog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(80) NOT NULL,
	`model` varchar(160) NOT NULL,
	`category` varchar(32) NOT NULL,
	`serviceType` varchar(120) NOT NULL,
	`quality` varchar(120),
	`supplierCost` decimal(10,2) NOT NULL,
	`supplier` varchar(120) NOT NULL DEFAULT 'Tyros Cell',
	`sourceImportId` int NOT NULL,
	`sourceFileName` varchar(255) NOT NULL,
	`approvalStatus` varchar(32) NOT NULL DEFAULT 'approved',
	`availabilityStatus` varchar(32) NOT NULL DEFAULT 'confirmed',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `parts_catalog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplier_imports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(32) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`sourceFileKey` varchar(500),
	`status` varchar(32) NOT NULL DEFAULT 'preview',
	`rowsTotal` int NOT NULL DEFAULT 0,
	`validRows` int NOT NULL DEFAULT 0,
	`invalidRows` int NOT NULL DEFAULT 0,
	`duplicateRows` int NOT NULL DEFAULT 0,
	`changedRows` int NOT NULL DEFAULT 0,
	`previewJson` text NOT NULL,
	`errorMessage` text,
	`importedBy` varchar(320) NOT NULL,
	`approvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supplier_imports_id` PRIMARY KEY(`id`)
);
