SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Database: `maps`
-- --------------------------------------------------------
DROP DATABASE IF EXISTS maps;
CREATE DATABASE maps;
USE maps;

-- --------------------------------------------------------

--
-- Table structure for table `transmitters`
--
CREATE TABLE `transmitters` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lng` decimal(11,8) NOT NULL,
  `country` varchar(100) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stations`
--
CREATE TABLE `stations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `transmitter_id` int unsigned DEFAULT NULL,
  `station_name` varchar(100) DEFAULT NULL,
  `frequency` decimal(5,2) DEFAULT NULL, -- Fixed precision for FM/AM ranges
  `power_kw` decimal(10,3) DEFAULT NULL,
  `polarization` char(1) DEFAULT 'H',
  `pi_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transmitter_id` (`transmitter_id`),
  CONSTRAINT `stations_ibfk_1` FOREIGN KEY (`transmitter_id`) REFERENCES `transmitters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transmitter_photos`
--
CREATE TABLE `transmitter_photos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `transmitter_id` int unsigned DEFAULT NULL, -- Matched to 'int unsigned'
  `photo_filename` varchar(255) NOT NULL,
  `author` varchar(100) DEFAULT NULL,
  `photo_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transmitter_id` (`transmitter_id`),
  CONSTRAINT `transmitter_photos_ibfk_1` FOREIGN KEY (`transmitter_id`) REFERENCES `transmitters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','editor','admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;