CREATE TABLE `default_initial_parameters` (
  `id` integer PRIMARY KEY NOT NULL CHECK (`id` = 1),
  `mixer_no` text,
  `collected_date` text,
  `initial_data` text DEFAULT '{}' NOT NULL,
  `updated_at` text NOT NULL
);
