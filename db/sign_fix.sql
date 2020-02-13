-- phpMyAdmin SQL Dump
-- version 4.9.1deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 13, 2020 at 04:31 PM
-- Server version: 8.0.19-0ubuntu0.19.10.3
-- PHP Version: 7.3.11-0ubuntu0.19.10.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sign_fix`
--
CREATE DATABASE IF NOT EXISTS `sign_fix` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `sign_fix`;

-- --------------------------------------------------------

--
-- Table structure for table `authentications`
--

CREATE TABLE `authentications` (
  `email_student` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `code_image` blob
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `start_year` int DEFAULT NULL,
  `end_year` int DEFAULT NULL,
  `token_calendar` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `name`, `start_year`, `end_year`, `token_calendar`) VALUES
(1, 'Turing', 2018, 2019, NULL),
(2, 'McLuhan', 2018, 2019, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `judgments`
--

CREATE TABLE `judgments` (
  `id` int NOT NULL,
  `id_questionnaire` int DEFAULT NULL,
  `vote` int NOT NULL,
  `email_user_receiving` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email_user_sender` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `id` int NOT NULL,
  `lesson` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_signature` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `companies_id` int NOT NULL,
  `classroom` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_course` int DEFAULT NULL,
  `date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `start_time` float DEFAULT NULL,
  `end_time` float DEFAULT NULL,
  `total_hours` float DEFAULT NULL,
  `creation_date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `modify_date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_supervisor_create` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_supervisor_modify` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`id`, `lesson`, `email_signature`, `companies_id`, `classroom`, `id_course`, `date`, `start_time`, `end_time`, `total_hours`, `creation_date`, `modify_date`, `email_supervisor_create`, `email_supervisor_modify`) VALUES
(106, 'metodologia agile', 'simone d\'amico', 0, 'comandini', 1, '11/02/2020', 8.5, 11, 2.5, '07/02/2020', NULL, NULL, NULL),
(107, 'metologia agile', 'flowing', 0, 'maggioli', 1, '13/02/2020', 9, 12, 3, '07/02/2020', NULL, NULL, NULL),
(108, 'metodologia agile', 'simone d\'amico', 0, 'comandini', 1, '11/02/2020', 8.5, 11, 2.5, '07/02/2020', NULL, NULL, NULL),
(109, 'metologia agile', 'flowing', 0, 'maggioli', 1, '13/02/2020', 9, 12, 3, '07/02/2020', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `questionnaires`
--

CREATE TABLE `questionnaires` (
  `id` int NOT NULL,
  `text` text COLLATE utf8_unicode_ci,
  `subject` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `responsibles`
--

CREATE TABLE `responsibles` (
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `first_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `responsible_level` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `responsibles`
--

INSERT INTO `responsibles` (`email`, `password`, `first_name`, `last_name`, `responsible_level`) VALUES
('luca@info.com', '12345', 'luca', 'arcangeli', 1);

-- --------------------------------------------------------

--
-- Table structure for table `signatures_students`
--

CREATE TABLE `signatures_students` (
  `code_authentication` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `current_start_time` timestamp NULL DEFAULT NULL,
  `current_end_time` timestamp NULL DEFAULT NULL,
  `final_start_time` float DEFAULT NULL,
  `final_end_time` float DEFAULT NULL,
  `id_lesson` int DEFAULT NULL,
  `hours_of_lessons` float DEFAULT NULL,
  `lost_hours` float DEFAULT NULL,
  `email_supervisor_modify` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `modify_date` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `signatures_teachers`
--

CREATE TABLE `signatures_teachers` (
  `email_responsible` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `current_start_time` timestamp NULL DEFAULT NULL,
  `current_end_time` timestamp NULL DEFAULT NULL,
  `final_start_time` float DEFAULT NULL,
  `final_end_time` float DEFAULT NULL,
  `id_lesson` int DEFAULT NULL,
  `hours_of_lessons` float DEFAULT NULL,
  `lost_hours` float DEFAULT NULL,
  `email_supervisor_modify` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `modify_date` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `date_of_birth` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_course` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`email`, `first_name`, `last_name`, `date_of_birth`, `id_course`) VALUES
('daniele@info.com', 'daniele', 'marocchi', '01/01/1960', 1),
('niccolo@info.com', 'niccolo', 'zona', '30/09/1992', 1),
('pol@info.com', 'paolo', 'valmori', '01/01/1930', 1);

-- --------------------------------------------------------

--
-- Table structure for table `supervisors`
--

CREATE TABLE `supervisors` (
  `email_responsible` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `id_course` int NOT NULL,
  `companies_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `supervisors`
--

INSERT INTO `supervisors` (`email_responsible`, `id_course`, `companies_id`) VALUES
('luca@info.com', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `email_responsible` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `id_course` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`email_responsible`, `id_course`) VALUES
('matteo@info.com', 1),
('simone@flowing.com', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `authentications`
--
ALTER TABLE `authentications`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `judgments`
--
ALTER TABLE `judgments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questionnaires`
--
ALTER TABLE `questionnaires`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `responsibles`
--
ALTER TABLE `responsibles`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `signatures_students`
--
ALTER TABLE `signatures_students`
  ADD PRIMARY KEY (`code_authentication`);

--
-- Indexes for table `signatures_teachers`
--
ALTER TABLE `signatures_teachers`
  ADD PRIMARY KEY (`email_responsible`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `supervisors`
--
ALTER TABLE `supervisors`
  ADD PRIMARY KEY (`email_responsible`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`email_responsible`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `judgments`
--
ALTER TABLE `judgments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `questionnaires`
--
ALTER TABLE `questionnaires`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
