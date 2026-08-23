CREATE TABLE `admin_user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`name` varchar(160) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `blog_post` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(200) NOT NULL,
	`title` varchar(255) NOT NULL,
	`excerpt` varchar(500) NOT NULL,
	`body` text,
	`cover_image` varchar(512) NOT NULL,
	`category` varchar(80) NOT NULL,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_post_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_post_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contact_method` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('email','phone','office') NOT NULL,
	`title` varchar(120) NOT NULL,
	`description` varchar(255) NOT NULL,
	`value` varchar(255) NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contact_method_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hero_slide` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`background_image` varchar(512) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`see_more_enabled` boolean NOT NULL DEFAULT false,
	`page_slug` varchar(200),
	`page_title` varchar(255),
	`page_body` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hero_slide_id` PRIMARY KEY(`id`),
	CONSTRAINT `hero_slide_page_slug_unique` UNIQUE(`page_slug`)
);
--> statement-breakpoint
CREATE TABLE `member_state` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`flag_image` varchar(512) NOT NULL,
	`is_signatory` boolean NOT NULL DEFAULT true,
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `member_state_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `misc_resource` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` varchar(500) NOT NULL,
	`link` varchar(512) NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `misc_resource_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nav_item` (
	`id` int AUTO_INCREMENT NOT NULL,
	`label` varchar(120) NOT NULL,
	`href` varchar(512) NOT NULL,
	`location` enum('navbar','footer') NOT NULL,
	`group` varchar(60),
	`icon` varchar(60),
	`parent_id` int,
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nav_item_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opportunity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` enum('job','grant','tender') NOT NULL,
	`deadline` timestamp,
	`apply_url` varchar(512) NOT NULL,
	`status` enum('active','closed') NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `opportunity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `page` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`title` varchar(255) NOT NULL,
	`meta_description` varchar(500),
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `page_id` PRIMARY KEY(`id`),
	CONSTRAINT `page_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `partner` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`logo_image` varchar(512) NOT NULL,
	`link` varchar(512),
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partner_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `publication` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(200) NOT NULL,
	`title` varchar(255) NOT NULL,
	`excerpt` varchar(500) NOT NULL,
	`body` text,
	`cover_image` varchar(512) NOT NULL,
	`category` varchar(80) NOT NULL,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `publication_id` PRIMARY KEY(`id`),
	CONSTRAINT `publication_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `section` (
	`id` int AUTO_INCREMENT NOT NULL,
	`page_id` int NOT NULL,
	`component_key` varchar(80) NOT NULL,
	`scheme` enum('scheme-1','scheme-2','scheme-3','scheme-4','scheme-5','scheme-6','scheme-7') NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`eyebrow` varchar(120),
	`heading` varchar(255),
	`subtitle` text,
	`background_image` varchar(512),
	`icon` varchar(512),
	`image_position` enum('left','right'),
	`disclaimer` varchar(500),
	`cta_primary_label` varchar(80),
	`cta_primary_href` varchar(512),
	`cta_secondary_label` varchar(80),
	`cta_secondary_href` varchar(512),
	`secondary_eyebrow` varchar(120),
	`secondary_heading` varchar(255),
	`secondary_body` text,
	`closing_cta_label` varchar(80),
	`closing_cta_href` varchar(512),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `section_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `section_bullet` (
	`id` int AUTO_INCREMENT NOT NULL,
	`section_id` int NOT NULL,
	`text` varchar(255) NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `section_bullet_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `section_image` (
	`id` int AUTO_INCREMENT NOT NULL,
	`section_id` int NOT NULL,
	`url` varchar(512) NOT NULL,
	`alt_text` varchar(255),
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `section_image_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `section_tab` (
	`id` int AUTO_INCREMENT NOT NULL,
	`section_id` int NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`icon` varchar(512),
	`tab_label` varchar(80),
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`image` varchar(512),
	`video_url` varchar(512),
	`cta_primary_label` varchar(80),
	`cta_primary_href` varchar(512),
	`cta_secondary_label` varchar(80),
	`cta_secondary_href` varchar(512),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `section_tab_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`logo_light` varchar(512) NOT NULL,
	`logo_dark` varchar(512) NOT NULL,
	`footer_description` text NOT NULL,
	`copyright_text` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriber` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriber_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriber_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `team_member` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`role` varchar(160) NOT NULL,
	`bio` text,
	`photo` varchar(512),
	`email` varchar(255),
	`linkedin_url` varchar(512),
	`x_url` varchar(512),
	`dribbble_url` varchar(512),
	`group` enum('leadership','technical') NOT NULL,
	`status` enum('active','vacant') NOT NULL DEFAULT 'active',
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `team_member_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `hero_slide_order_idx` ON `hero_slide` (`order`);--> statement-breakpoint
CREATE INDEX `nav_item_location_idx` ON `nav_item` (`location`,`group`);--> statement-breakpoint
CREATE INDEX `section_page_order_idx` ON `section` (`page_id`,`order`);--> statement-breakpoint
CREATE INDEX `section_bullet_section_idx` ON `section_bullet` (`section_id`,`order`);--> statement-breakpoint
CREATE INDEX `section_image_section_idx` ON `section_image` (`section_id`,`order`);--> statement-breakpoint
CREATE INDEX `section_tab_section_idx` ON `section_tab` (`section_id`,`order`);--> statement-breakpoint
CREATE INDEX `team_member_group_idx` ON `team_member` (`group`,`order`);