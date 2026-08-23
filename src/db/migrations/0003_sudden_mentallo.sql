ALTER TABLE `partner` ADD `category` enum('institutional_strategic','knowledge_development','events_initiatives') DEFAULT 'institutional_strategic' NOT NULL;--> statement-breakpoint
ALTER TABLE `partner` ADD `status_label` varchar(120);--> statement-breakpoint
ALTER TABLE `partner` ADD `badge` varchar(160);--> statement-breakpoint
ALTER TABLE `partner` ADD `description` varchar(500);--> statement-breakpoint
ALTER TABLE `partner` ADD `view_more_url` varchar(512);