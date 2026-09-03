ALTER TABLE `blog_post` ADD `view_count` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `team_member` ADD `slug` varchar(200);--> statement-breakpoint
ALTER TABLE `team_member` ADD `has_detail_page` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `team_member` ADD `detail_body` text;--> statement-breakpoint
ALTER TABLE `team_member` ADD CONSTRAINT `team_member_slug_unique` UNIQUE(`slug`);