CREATE TABLE `contact_message` (
	`id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(160) NOT NULL,
	`organization` varchar(255),
	`email` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contact_message_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(200) NOT NULL,
	`title` varchar(255) NOT NULL,
	`short_description` varchar(500) NOT NULL,
	`cover_image` varchar(512) NOT NULL,
	`status` enum('ongoing','upcoming','completed') NOT NULL,
	`period_start` timestamp NULL DEFAULT NULL,
	`period_end` timestamp NULL DEFAULT NULL,
	`applications_open` boolean NOT NULL DEFAULT false,
	`application_deadline` timestamp NULL DEFAULT NULL,
	`who_can_apply` varchar(255),
	`about_body` text,
	`how_to_apply_body` text,
	`apply_url` varchar(512),
	`is_regional_initiative` boolean NOT NULL DEFAULT false,
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `project_id` PRIMARY KEY(`id`),
	CONSTRAINT `project_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `project_objective` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`text` varchar(255) NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `project_objective_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `blog_post` MODIFY COLUMN `published_at` timestamp NULL DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `opportunity` MODIFY COLUMN `category` enum('job','grant','tender','internship','vacancy','young_professional_programme','other') NOT NULL;--> statement-breakpoint
ALTER TABLE `opportunity` MODIFY COLUMN `deadline` timestamp NULL DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `publication` MODIFY COLUMN `published_at` timestamp NULL DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `blog_post` ADD `is_event` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_post` ADD `event_date` timestamp NULL DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `blog_post` ADD `event_location` varchar(255);--> statement-breakpoint
ALTER TABLE `site_settings` ADD `contact_email` varchar(255);--> statement-breakpoint
ALTER TABLE `site_settings` ADD `contact_phone` varchar(60);--> statement-breakpoint
ALTER TABLE `site_settings` ADD `contact_address` varchar(500);--> statement-breakpoint
ALTER TABLE `site_settings` ADD `contact_working_hours` varchar(255);--> statement-breakpoint
ALTER TABLE `site_settings` ADD `contact_map_embed_url` varchar(1000);--> statement-breakpoint
CREATE INDEX `project_objective_project_idx` ON `project_objective` (`project_id`,`order`);