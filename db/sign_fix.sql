-- phpMyAdmin SQL Dump
-- version 4.9.1deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 22, 2020 at 02:36 PM
-- Server version: 8.0.18-0ubuntu0.19.10.1
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
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(5) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `start_year` int(4) DEFAULT NULL,
  `end_year` int(4) DEFAULT NULL,
  `token_calendar` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `judgments`
--

CREATE TABLE `judgments` (
  `id` int(50) NOT NULL,
  `id_questionnaire` int(5) DEFAULT NULL,
  `vote` int(1) NOT NULL,
  `email_user_receiving` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email_user_sender` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `id` int(10) NOT NULL,
  `lesson` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_responsible` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `classroom` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_course` int(5) DEFAULT NULL,
  `date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `start_time` float DEFAULT NULL,
  `end_time` float DEFAULT NULL,
  `total_hours` float DEFAULT NULL,
  `creation_date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `modify_date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_supervisor_create` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `email_supervisor_modify` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questionnaires`
--

CREATE TABLE `questionnaires` (
  `id` int(5) NOT NULL,
  `text` text COLLATE utf8_unicode_ci,
  `subject` int(1) DEFAULT NULL
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
  `responsible_level` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
  `id_lesson` int(10) DEFAULT NULL,
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
  `id_lesson` int(10) DEFAULT NULL,
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
  `id_course` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supervisors`
--

CREATE TABLE `supervisors` (
  `email_responsible` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `id_course` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `email_responsible` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `id_course` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_questionnaire` (`id_questionnaire`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email_responsible` (`email_responsible`);

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
  ADD PRIMARY KEY (`code_authentication`),
  ADD KEY `id_lesson` (`id_lesson`);

--
-- Indexes for table `signatures_teachers`
--
ALTER TABLE `signatures_teachers`
  ADD PRIMARY KEY (`email_responsible`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`email`),
  ADD KEY `id_course` (`id_course`);

--
-- Indexes for table `supervisors`
--
ALTER TABLE `supervisors`
  ADD PRIMARY KEY (`email_responsible`),
  ADD UNIQUE KEY `id_course` (`id_course`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`email_responsible`),
  ADD UNIQUE KEY `id_course` (`id_course`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `judgments`
--
ALTER TABLE `judgments`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questionnaires`
--
ALTER TABLE `questionnaires`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `judgments`
--
ALTER TABLE `judgments`
  ADD CONSTRAINT `judgments_ibfk_1` FOREIGN KEY (`id_questionnaire`) REFERENCES `questionnaires` (`id`);

--
-- Constraints for table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`email_responsible`) REFERENCES `responsibles` (`email`);

--
-- Constraints for table `signatures_students`
--
ALTER TABLE `signatures_students`
  ADD CONSTRAINT `signatures_students_ibfk_1` FOREIGN KEY (`id_lesson`) REFERENCES `lessons` (`id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`id_course`) REFERENCES `courses` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
