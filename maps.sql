DROP DATABASE IF EXISTS maps;
CREATE DATABASE maps;
USE maps;

-- 1. Transmitters (Physical Infrastructure)
CREATE TABLE `transmitters` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `lat` decimal(8,6) NOT NULL,
  `lng` decimal(9,6) NOT NULL,
  `country` char(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- 2. Stations (Logical Broadcasts)
CREATE TABLE `stations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `transmitter_id` int unsigned NOT NULL,
  `station_name` varchar(100) NOT NULL,
  `frequency` decimal(5,2) NOT NULL,
  `power_kw` decimal(10,3) DEFAULT NULL,
  `polarization` ENUM('H', 'V', 'M', 'C', '?') DEFAULT 'H',
  `pi_code` char(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transmitter_id` (`transmitter_id`),
  KEY `idx_frequency` (`frequency`),
  CONSTRAINT `stations_ibfk_1` FOREIGN KEY (`transmitter_id`) REFERENCES `transmitters` (`id`) ON DELETE CASCADE
);

-- 3. Transmitter Photos
CREATE TABLE `transmitter_photos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `transmitter_id` int unsigned NOT NULL,
  `photo_filename` varchar(255) NOT NULL,
  `author` varchar(50) DEFAULT NULL,
  `photo_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transmitter_id` (`transmitter_id`),
  CONSTRAINT `transmitter_photos_ibfk_1` FOREIGN KEY (`transmitter_id`) REFERENCES `transmitters` (`id`) ON DELETE CASCADE
);

-- 4. Users
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','editor','admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
);