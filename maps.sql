DROP DATABASE IF EXISTS maps;
CREATE DATABASE maps;
USE maps;

CREATE TABLE `transmitters` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `lat` decimal(8,6) NOT NULL,
  `lng` decimal(9,6) NOT NULL,
  `country` varchar(3) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
);

CREATE TABLE `stations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `transmitter_id` int unsigned DEFAULT NULL,
  `station_name` varchar(100) DEFAULT NULL,
  `frequency` decimal(5,2) DEFAULT NULL,
  `power_kw` decimal(10,3) DEFAULT NULL,
  `polarization` char(1) DEFAULT 'H',
  `pi_code` varchar(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transmitter_id` (`transmitter_id`),
  CONSTRAINT `stations_ibfk_1` FOREIGN KEY (`transmitter_id`) REFERENCES `transmitters` (`id`) ON DELETE CASCADE
);

CREATE TABLE `transmitter_photos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `transmitter_id` int unsigned DEFAULT NULL,
  `photo_filename` varchar(255) NOT NULL,
  `author` varchar(50) DEFAULT NULL,
  `photo_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transmitter_id` (`transmitter_id`),
  CONSTRAINT `transmitter_photos_ibfk_1` FOREIGN KEY (`transmitter_id`) REFERENCES `transmitters` (`id`) ON DELETE CASCADE
);

CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','editor','admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
);