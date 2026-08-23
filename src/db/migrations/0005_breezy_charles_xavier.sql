CREATE TABLE `media_gallery_image` (
	`id` int AUTO_INCREMENT NOT NULL,
	`media_item_id` int NOT NULL,
	`image` varchar(512) NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `media_gallery_image_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media_item` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(200) NOT NULL,
	`title` varchar(255) NOT NULL,
	`type` enum('photo_gallery','video','press') NOT NULL,
	`description` varchar(500),
	`thumbnail` varchar(512) NOT NULL,
	`event_date` timestamp NULL DEFAULT NULL,
	`video_url` varchar(512),
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `media_item_id` PRIMARY KEY(`id`),
	CONSTRAINT `media_item_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `publication` ADD `file_url` varchar(512);--> statement-breakpoint
ALTER TABLE `publication` ADD `file_format` varchar(20);--> statement-breakpoint
ALTER TABLE `publication` ADD `file_size_bytes` int;--> statement-breakpoint
ALTER TABLE `publication` ADD `language` varchar(60);--> statement-breakpoint
ALTER TABLE `publication` ADD `pages` int;--> statement-breakpoint
ALTER TABLE `publication` ADD `published_by` varchar(160);--> statement-breakpoint
CREATE INDEX `media_gallery_image_media_idx` ON `media_gallery_image` (`media_item_id`,`order`);