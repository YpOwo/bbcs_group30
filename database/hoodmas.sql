-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: hoodmas
-- ------------------------------------------------------
-- Server version	8.0.21

--
-- Table structure for table `hoods`
--

CREATE DATABASE IF NOT EXISTS `hoodmas`;
DROP TABLE IF EXISTS `hoods`;
CREATE TABLE `hoods` (
  `hoodId` int NOT NULL AUTO_INCREMENT,
  `hoods` char(255) NOT NULL,
  PRIMARY KEY (`hoodId`)
);
INSERT INTO `hoods` VALUES (1, 'Bishan'), (2, 'Bukit Merah'), (3, 'Bukit Timah'), (4, 'Downtown Core'), (5, 'Marina South'), (6, 'Marina East'), (7, 'Marina Bay'), (8, 'Newton'), (9, 'Orchard'), (10, 'Outram'), (11, 'Queenstown'), (12, 'River Valley'), (13, 'Rochor'), (14, 'Tanglin'), (15, 'Toa Payoh'), (16, 'Bedok'), (17, 'Changi'), (18, 'Changi Bay'), (19, 'Pasir Ris'), (20, 'Tampines'), (21, 'Admiralty'), (22, 'Canberra'), (23, 'Marsiling'), (24, 'Sembawang'), (25, 'Simpang'), (26, 'Woodlands'), (27, 'Yishun'), (28, 'Ang Mo Kio'), (29, 'Buangkok'), (30, 'Compassvale'), (31, 'Hougang'), (32, 'Punggol'), (33, 'Seletar'), (34, 'Sengkang'), (35, 'Serangoon'), (36, 'Boon Lay'), (37, 'Bukit Batok'), (38, 'Bukit Gombak'), (39, 'Choa Chu Kang'), (40, 'Clementi'), (41, 'Dover'), (42, 'Jurong East'), (43, 'Jurong West'), (44, 'Pioneer'), (45, 'Tengah'), (46, 'Tuas'), (47, 'West Coast'), (48, 'Bukit Panjang');

--
-- Table structure for table `secret_santa`
--

DROP TABLE IF EXISTS `secret_santa`;
CREATE TABLE `secret_santa` (
  `ssId` int NOT NULL AUTO_INCREMENT,
  `wishlist` text NOT NULL,
  `ssImage` varchar(255) NOT NULL,
  PRIMARY KEY (`ssId`),
  CONSTRAINT `ss_ibfk_1` FOREIGN KEY (`ssId`) REFERENCES `users` (`user_Id`)
);

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_Id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userImage` varchar(255) NOT NULL,
  PRIMARY KEY (`user_Id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  CONSTRAINT `users_ibfk` FOREIGN KEY (`user_Id`) REFERENCES `hoods` (`hoodId`)
);

INSERT INTO `users` VALUES (1,'cookie1','cookie1iscool@gmail.com','1234','Profile1.png'),(2,'johnhoho','john24@gmail.com','5678','Profile2.png');

-- Dump completed on 2024-12-21 15:55:58
