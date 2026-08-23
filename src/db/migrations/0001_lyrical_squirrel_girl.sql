ALTER TABLE `opportunity` ADD `slug` varchar(200);--> statement-breakpoint
ALTER TABLE `opportunity` ADD `excerpt` varchar(500);--> statement-breakpoint
ALTER TABLE `opportunity` ADD CONSTRAINT `opportunity_slug_unique` UNIQUE(`slug`);