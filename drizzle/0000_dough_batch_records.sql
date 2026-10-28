CREATE TABLE `batches` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `batch_id` text NOT NULL,
  `mixer_no` text,
  `collected_date` text,
  `initial_data` text DEFAULT '{}' NOT NULL,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `batches_batch_id_unique` ON `batches` (`batch_id`);
--> statement-breakpoint
CREATE TABLE `observations` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `batch_id` text NOT NULL,
  `timestamp` text NOT NULL,
  `elapsed_seconds` text,
  `data` text DEFAULT '{}' NOT NULL,
  `notes` text,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL
);
