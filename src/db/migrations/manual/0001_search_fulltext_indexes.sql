-- Manual migration — NOT tracked by drizzle-kit.
--
-- drizzle-orm's mysql-core (v0.45.2) has no FULLTEXT index type in its
-- `index()` builder (confirmed: absent from node_modules/drizzle-orm/
-- mysql-core/indexes.d.ts), so this can't be expressed in schema.ts and
-- won't show up in `drizzle-kit generate` output. Applied directly against
-- the DB on 2026-08-23 (Faza 5, docs/architecture/03-migration-plan.md).
--
-- If the database is ever recreated from scratch, re-run this file after
-- the drizzle-kit migrations (0000, 0001, 0002) have been applied.

ALTER TABLE blog_post ADD FULLTEXT INDEX blog_post_search_idx (title, excerpt, body);
ALTER TABLE opportunity ADD FULLTEXT INDEX opportunity_search_idx (title, excerpt, description);
ALTER TABLE project ADD FULLTEXT INDEX project_search_idx (title, short_description, about_body);
ALTER TABLE publication ADD FULLTEXT INDEX publication_search_idx (title, excerpt, body);
