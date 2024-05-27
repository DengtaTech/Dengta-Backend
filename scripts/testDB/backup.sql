-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: dengta
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Followship`
--

DROP TABLE IF EXISTS `Followship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Followship` (
  `followerId` bigint unsigned NOT NULL,
  `followeeId` bigint unsigned NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`followerId`,`followeeId`),
  KEY `FK_84bc8596402582936cc5a1068f2` (`followeeId`),
  CONSTRAINT `FK_84bc8596402582936cc5a1068f2` FOREIGN KEY (`followeeId`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_f640a2bb16203986551babb7c47` FOREIGN KEY (`followerId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FootprintHashTags`
--

DROP TABLE IF EXISTS `FootprintHashTags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FootprintHashTags` (
  `userId` bigint unsigned NOT NULL,
  `footprintTagTypeId` bigint unsigned NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`,`footprintTagTypeId`),
  KEY `FK_5b706f024acfd116d18c676acbe` (`footprintTagTypeId`),
  CONSTRAINT `FK_5b706f024acfd116d18c676acbe` FOREIGN KEY (`footprintTagTypeId`) REFERENCES `FootprintTagType` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_a9e32991185c0bb5f4a09dc6fd4` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FootprintReactions`
--

DROP TABLE IF EXISTS `FootprintReactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FootprintReactions` (
  `userId` bigint unsigned NOT NULL,
  `footprintId` bigint unsigned NOT NULL,
  `reactionTypeId` bigint unsigned NOT NULL,
  PRIMARY KEY (`userId`,`footprintId`,`reactionTypeId`),
  KEY `FK_b078d20f0e88e39290bc32916d0` (`footprintId`),
  KEY `FK_bc65e74843e7714df3ef2f16ea5` (`reactionTypeId`),
  CONSTRAINT `FK_b078d20f0e88e39290bc32916d0` FOREIGN KEY (`footprintId`) REFERENCES `Footprints` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_bc65e74843e7714df3ef2f16ea5` FOREIGN KEY (`reactionTypeId`) REFERENCES `ReactionType` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_c8c42c67c3ef70cf0162a1f5941` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FootprintTagType`
--

DROP TABLE IF EXISTS `FootprintTagType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FootprintTagType` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Footprints`
--

DROP TABLE IF EXISTS `Footprints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Footprints` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `content` text,
  `titleImage` varchar(255) DEFAULT NULL,
  `totalLike` int NOT NULL DEFAULT '0',
  `status` varchar(50) NOT NULL DEFAULT 'draft',
  `milestone` int NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_acb88ae22088cf53b01018c12a5` (`userId`),
  CONSTRAINT `FK_acb88ae22088cf53b01018c12a5` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ProfileHashTags`
--

DROP TABLE IF EXISTS `ProfileHashTags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProfileHashTags` (
  `userId` bigint unsigned NOT NULL,
  `profileTagTypeId` bigint unsigned NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`,`profileTagTypeId`),
  KEY `FK_d011ca0672cf0e070b3563e1f24` (`profileTagTypeId`),
  CONSTRAINT `FK_a75e0b6969c5a3f1788c2f14ade` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_d011ca0672cf0e070b3563e1f24` FOREIGN KEY (`profileTagTypeId`) REFERENCES `ProfileTagType` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ProfileTagType`
--

DROP TABLE IF EXISTS `ProfileTagType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProfileTagType` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ReactionType`
--

DROP TABLE IF EXISTS `ReactionType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ReactionType` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `UserCredentials`
--

DROP TABLE IF EXISTS `UserCredentials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserCredentials` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_c9609d6439972f45b0fe145a81` (`email`),
  UNIQUE KEY `REL_31a01233eeaefccccc843d0c6d` (`userId`),
  CONSTRAINT `FK_31a01233eeaefccccc843d0c6d3` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `UserRoles`
--

DROP TABLE IF EXISTS `UserRoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserRoles` (
  `userId` bigint unsigned NOT NULL,
  `roleId` bigint unsigned NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`,`roleId`),
  KEY `FK_5f1d6fdea1024424fd60b193b9f` (`roleId`),
  CONSTRAINT `FK_5f1d6fdea1024424fd60b193b9f` FOREIGN KEY (`roleId`) REFERENCES `Roles` (`id`),
  CONSTRAINT `FK_a6b832f61ba4bd959c838a1953b` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `accountName` varchar(50) NOT NULL,
  `realName` varchar(50) NOT NULL,
  `birthday` date DEFAULT NULL,
  `provider` varchar(255) NOT NULL DEFAULT 'native',
  `avatar` varchar(255) DEFAULT NULL,
  `backgroundImage` varchar(255) DEFAULT NULL,
  `gender` int DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `lifeRole` varchar(255) DEFAULT NULL,
  `selfIntro` varchar(255) DEFAULT NULL,
  `fbLink` varchar(255) DEFAULT NULL,
  `igLink` varchar(255) DEFAULT NULL,
  `linkedInLink` varchar(255) DEFAULT NULL,
  `isActive` int DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-26 13:01:23
