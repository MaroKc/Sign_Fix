-- phpMyAdmin SQL Dump
-- version 4.9.4deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 28, 2020 at 03:25 PM
-- Server version: 8.0.19-0ubuntu0.19.10.3
-- PHP Version: 7.3.11-0ubuntu0.19.10.3

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
CREATE DATABASE IF NOT EXISTS `sign_fix` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `sign_fix`;

-- --------------------------------------------------------

--
-- Table structure for table `anagrafica`
--

CREATE TABLE `anagrafica` (
  `ID` int NOT NULL,
  `codice_anagrafica` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `id_anagrafica` int NOT NULL,
  `valore` varchar(80) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `anagrafica`
--

INSERT INTO `anagrafica` (`ID`, `codice_anagrafica`, `id_anagrafica`, `valore`) VALUES
(1, 'RUOLO', 1, 'AMMINISTRATORE'),
(2, 'RUOLO', 2, 'COORDINATORE'),
(3, 'RUOLO', 3, 'SUPERVISORE'),
(4, 'RUOLO', 4, 'DOCENTE'),
(5, 'RUOLO', 5, 'STUDENTE');

-- --------------------------------------------------------

--
-- Table structure for table `authentications`
--

CREATE TABLE `authentications` (
  `email_student` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `code_image` blob
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `name`) VALUES
(1, 'flowing'),
(2, 'matteo@info.com'),
(3, 'brizio@info.com');

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
(1, 'Turing', 2018, 2020, NULL),
(2, 'McLuhan', 2018, 2020, NULL),
(3, 'Turing', 2019, 2021, NULL),
(4, 'Hopper', 2019, 2021, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `google_token`
--

CREATE TABLE `google_token` (
  `email` varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `access_token` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `refresh_token` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `scope` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `token_type` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `expiry_date` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `google_token`
--

INSERT INTO `google_token` (`email`, `access_token`, `refresh_token`, `scope`, `token_type`, `expiry_date`) VALUES
('daniele.marocchi.studio@fitstic-edu.com', 'ya29.a0Adw1xeUlZ-2Dn5pjoRTOvevZ5SiV-2NSkCtjVQ7W5R0p-qWaEr8jAGzrMQ1JqQel7i341OWnITojHqcwVnlyny62J8LvRHWEXkAz7Cw_EI9eZrjh50gusl7NK2POiKTIlnWeS-BibPqbo60IavuBYY_htluKcRBOdnc', '1//0cQV1XdDEBcMfCgYIARAAGAwSNwF-L9Ir2E1AWn9Qt7fhWQgRCJWlLAvQUurt6DQN7aDM9VU6f0-XMXUmvXTZ3iwlhVdKHXI3Ru4', 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar.readonly', 'Bearer', '1582508544511');

-- --------------------------------------------------------

--
-- Table structure for table `judgments`
--

CREATE TABLE `judgments` (
  `id` int NOT NULL,
  `id_questionnaire` int DEFAULT NULL,
  `vote` int NOT NULL,
  `email_user_receiving` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email_user_sender` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `id` int NOT NULL,
  `lesson` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_signature` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `companies_id` int DEFAULT NULL,
  `classroom` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_course` int DEFAULT NULL,
  `date` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `start_time` float DEFAULT NULL,
  `end_time` float DEFAULT NULL,
  `total_hours` float DEFAULT NULL,
  `creation_date` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `modify_date` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_supervisor_create` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_supervisor_modify` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`id`, `lesson`, `email_signature`, `companies_id`, `classroom`, `id_course`, `date`, `start_time`, `end_time`, `total_hours`, `creation_date`, `modify_date`, `email_supervisor_create`, `email_supervisor_modify`) VALUES
(1, 'metodologia agile', 'michele@info.com', 1, 'comandini', 1, '10/02/2020', 8.5, 11, 2.5, '07/02/2020', NULL, NULL, NULL),
(2, 'metodologia agile', 'simone@info.com', 1, 'maggioli', 1, '10/02/2020', 14, 18, 4, '07/02/2020', NULL, NULL, NULL),
(4, 'metodologia agile', 'michele@info.com', 1, 'maggioli', 1, '19/02/2020', 9, 13, 4, '07/02/2020', NULL, NULL, NULL),
(110, 'metodologia agile', 'michele@info.com', 1, 'maggioli', 1, '26/02/2020', 14, 17, 3, '07/02/2020', NULL, NULL, NULL),
(111, 'php', 'matteo@info.com', 2, 'comandini', 1, '18/02/2020', 9, 13, 4, '07/02/2020', NULL, NULL, NULL),
(112, 'database', 'brizio@info.com', 3, 'comandini', 1, '18/02/2020', 14, 18, 4, '07/02/2020', NULL, NULL, NULL),
(113, 'metodologia agile', 'simone@info.com', 1, 'maggioli', 1, '17/02/2020', 9.5, 12, 2.5, '07/02/2020', NULL, NULL, NULL),
(116, 'metodologia agile', 'michele@info.com', 1, 'maggioli', 1, '17/02/2020', 12.5, 15.5, 3, '07/02/2020', NULL, NULL, NULL),
(117, 'metodologia agile', 'simone@info.com', 1, 'maggioli', 1, '13/02/2020', 9, 13, 4, '07/02/2020', NULL, NULL, NULL),
(118, 'php', 'matteo@info.com', 2, 'comandini', 1, '13/02/2020', 14, 17, 3, '07/02/2020', NULL, NULL, NULL),
(119, 'database', 'brizio@info.com', 3, 'comandini', 1, '12/02/2020', 14, 18, 4, '07/02/2020', NULL, NULL, NULL),
(120, 'php', 'matteo@info.com', 2, 'comandini', 1, '11/02/2020', 9, 13, 4, '07/02/2020', NULL, NULL, NULL),
(121, 'metodologia agile', 'michele@info.com', 1, 'maggioli', 1, '11/02/2020', 14, 17, 3, '07/02/2020', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `questionnaires`
--

CREATE TABLE `questionnaires` (
  `id` int NOT NULL,
  `text` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `subject` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `responsibles_auth`
--

CREATE TABLE `responsibles_auth` (
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `first_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `responsible_level` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `responsibles_auth`
--

INSERT INTO `responsibles_auth` (`email`, `password`, `first_name`, `last_name`, `responsible_level`) VALUES
('luca@info.com', '12345', 'Luca', 'Arcangeli', 2);

-- --------------------------------------------------------

--
-- Table structure for table `signatures_students`
--

CREATE TABLE `signatures_students` (
  `id` int NOT NULL,
  `code_authentication` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email_student` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `date` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `current_start_time` timestamp NULL DEFAULT NULL,
  `current_end_time` timestamp NULL DEFAULT NULL,
  `final_start_time` float DEFAULT NULL,
  `final_end_time` float DEFAULT NULL,
  `id_lesson` int DEFAULT NULL,
  `hours_of_lessons` float DEFAULT NULL,
  `lost_hours` float DEFAULT NULL,
  `mattinaPomeriggio` int NOT NULL,
  `email_supervisor_modify` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `modify_date` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `signatures_students`
--

INSERT INTO `signatures_students` (`id`, `code_authentication`, `email_student`, `date`, `current_start_time`, `current_end_time`, `final_start_time`, `final_end_time`, `id_lesson`, `hours_of_lessons`, `lost_hours`, `mattinaPomeriggio`, `email_supervisor_modify`, `modify_date`) VALUES
(1, '1', 'acookek@nps.gov', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(2, '2', 'ajardeinl@163.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(3, '3', 'azeale0@linkedin.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(4, '4', 'bjuggingj@alibaba.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(5, '4', 'chackinga@g.co', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(6, '4', 'cweineb@businessinsider.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(7, '4', 'ecoalburnm@cnbc.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(8, '4', 'dmycockf@posterous.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(9, '4', 'evellad@fc2.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(10, '4', 'fdecourtc@hp.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(11, '4', 'hnatalie6@networkadvertising.org', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(12, '4', 'iallnatto@e-recht24.de', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(13, '4', 'jbenniee@epa.gov', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(14, '4', 'ktrouel4@alexa.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(15, '4', 'lblasiak2@amazonaws.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(16, '4', 'lrodnight5@123-reg.co.uk', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(17, '2', 'zvanhault8@twitpic.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(18, '4', 'rclynmans9@gravatar.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(19, '4', 'rferrandn@wufoo.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(20, '4', 'storri3@surveymonkey.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(21, '4', 'tbeldani@google.fr', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(22, '4', 'tgrimes1@linkedin.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(23, '4', 'ustouteh@paginegialle.it', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(25, '4', 'hszachniewicz7@eventbrite.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 0, 2.5, 0, NULL, NULL),
(26, '1', 'acookek@nps.gov', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(27, '2', 'ajardeinl@163.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(28, '3', 'azeale0@linkedin.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(29, '4', 'bjuggingj@alibaba.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(30, '4', 'chackinga@g.co', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(31, '4', 'cweineb@businessinsider.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(32, '4', 'ecoalburnm@cnbc.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(33, '4', 'dmycockf@posterous.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(34, '4', 'evellad@fc2.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(35, '4', 'fdecourtc@hp.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(36, '4', 'hnatalie6@networkadvertising.org', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(37, '4', 'iallnatto@e-recht24.de', '10/02/2020', NULL, NULL, 1, 1, 2, 4, NULL, 1, NULL, NULL),
(38, '4', 'jbenniee@epa.gov', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(39, '4', 'ktrouel4@alexa.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(40, '4', 'lblasiak2@amazonaws.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(41, '4', 'lrodnight5@123-reg.co.uk', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(42, '2', 'zvanhault8@twitpic.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(43, '4', 'rclynmans9@gravatar.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(44, '4', 'rferrandn@wufoo.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(45, '4', 'storri3@surveymonkey.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(46, '4', 'tbeldani@google.fr', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(47, '4', 'tgrimes1@linkedin.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(48, '4', 'ustouteh@paginegialle.it', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(50, '4', 'hszachniewicz7@eventbrite.com', '10/02/2020', NULL, NULL, 14, 18, 2, 0, 6.5, 1, NULL, NULL),
(51, '1', 'acookek@nps.gov', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(52, '2', 'ajardeinl@163.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(53, '3', 'azeale0@linkedin.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(54, '4', 'bjuggingj@alibaba.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(55, '4', 'chackinga@g.co', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(56, '4', 'cweineb@businessinsider.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(57, '4', 'ecoalburnm@cnbc.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(58, '4', 'dmycockf@posterous.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(59, '4', 'evellad@fc2.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(60, '4', 'fdecourtc@hp.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(61, '4', 'hnatalie6@networkadvertising.org', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(62, '4', 'iallnatto@e-recht24.de', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(63, '4', 'jbenniee@epa.gov', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(64, '4', 'ktrouel4@alexa.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(65, '4', 'lblasiak2@amazonaws.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(66, '4', 'lrodnight5@123-reg.co.uk', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(67, '2', 'zvanhault8@twitpic.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(68, '4', 'rclynmans9@gravatar.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(69, '4', 'rferrandn@wufoo.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(70, '4', 'storri3@surveymonkey.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(71, '4', 'tbeldani@google.fr', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(72, '4', 'tgrimes1@linkedin.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(73, '4', 'ustouteh@paginegialle.it', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(74, '4', 'hszachniewicz7@eventbrite.com', '11/02/2020', NULL, NULL, 1, 1, 120, 0, 10.5, 0, NULL, NULL),
(75, '4', 'mmaycockg@sfgate.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, 0, NULL, NULL),
(76, '4', 'mmaycockg@sfgate.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, 1, NULL, NULL),
(77, '4', 'mmaycockg@sfgate.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, 0, NULL, NULL),
(78, '1', 'acookek@nps.gov', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(79, '2', 'ajardeinl@163.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(80, '3', 'azeale0@linkedin.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(81, '4', 'bjuggingj@alibaba.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(82, '4', 'chackinga@g.co', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(83, '4', 'cweineb@businessinsider.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(84, '4', 'ecoalburnm@cnbc.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(85, '4', 'dmycockf@posterous.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(86, '4', 'evellad@fc2.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(87, '4', 'fdecourtc@hp.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(88, '4', 'hnatalie6@networkadvertising.org', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(89, '4', 'iallnatto@e-recht24.de', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(90, '4', 'jbenniee@epa.gov', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(91, '4', 'ktrouel4@alexa.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(92, '4', 'lblasiak2@amazonaws.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(93, '4', 'lrodnight5@123-reg.co.uk', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(94, '2', 'zvanhault8@twitpic.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(95, '4', 'mmaycockg@sfgate.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(96, '4', 'rclynmans9@gravatar.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(97, '4', 'rferrandn@wufoo.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(98, '4', 'storri3@surveymonkey.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(99, '4', 'tbeldani@google.fr', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(100, '4', 'tgrimes1@linkedin.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(101, '4', 'ustouteh@paginegialle.it', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, 1, NULL, NULL),
(102, '4', 'hszachniewicz7@eventbrite.com', '11/02/2020', NULL, NULL, 1, 1, 121, 0, 13.5, 1, NULL, NULL),
(103, '1', 'acookek@nps.gov', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(104, '2', 'ajardeinl@163.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(105, '3', 'azeale0@linkedin.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(106, '4', 'bjuggingj@alibaba.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(107, '4', 'chackinga@g.co', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(108, '4', 'cweineb@businessinsider.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(109, '4', 'ecoalburnm@cnbc.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(110, '4', 'dmycockf@posterous.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(111, '4', 'evellad@fc2.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(112, '4', 'fdecourtc@hp.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(113, '4', 'hnatalie6@networkadvertising.org', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(114, '4', 'iallnatto@e-recht24.de', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(115, '4', 'jbenniee@epa.gov', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(116, '4', 'ktrouel4@alexa.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(117, '4', 'lblasiak2@amazonaws.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(118, '4', 'lrodnight5@123-reg.co.uk', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(119, '2', 'zvanhault8@twitpic.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(120, '4', 'mmaycockg@sfgate.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(121, '4', 'rclynmans9@gravatar.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(122, '4', 'rferrandn@wufoo.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(123, '4', 'storri3@surveymonkey.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(124, '4', 'tbeldani@google.fr', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(125, '4', 'tgrimes1@linkedin.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(126, '4', 'ustouteh@paginegialle.it', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, 1, NULL, NULL),
(127, '4', 'hszachniewicz7@eventbrite.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, 13.5, 1, NULL, NULL),
(128, '1', 'acookek@nps.gov', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(129, '2', 'ajardeinl@163.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(130, '3', 'azeale0@linkedin.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(131, '4', 'bjuggingj@alibaba.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(132, '4', 'chackinga@g.co', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(133, '4', 'cweineb@businessinsider.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(134, '4', 'ecoalburnm@cnbc.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(135, '4', 'dmycockf@posterous.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(136, '4', 'evellad@fc2.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(137, '4', 'fdecourtc@hp.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(138, '4', 'hnatalie6@networkadvertising.org', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(139, '4', 'iallnatto@e-recht24.de', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(140, '4', 'jbenniee@epa.gov', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(141, '4', 'ktrouel4@alexa.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(142, '4', 'lblasiak2@amazonaws.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(143, '4', 'lrodnight5@123-reg.co.uk', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(144, '2', 'zvanhault8@twitpic.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(145, '4', 'mmaycockg@sfgate.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(146, '4', 'rclynmans9@gravatar.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(147, '4', 'rferrandn@wufoo.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(148, '4', 'storri3@surveymonkey.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(149, '4', 'tbeldani@google.fr', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(150, '4', 'tgrimes1@linkedin.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(151, '4', 'ustouteh@paginegialle.it', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, 0, NULL, NULL),
(152, '4', 'hszachniewicz7@eventbrite.com', '13/02/2020', NULL, NULL, 1, 1, 117, 0, 16.5, 0, NULL, NULL),
(153, '1', 'acookek@nps.gov', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(154, '2', 'ajardeinl@163.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(155, '3', 'azeale0@linkedin.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(156, '4', 'bjuggingj@alibaba.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(157, '4', 'chackinga@g.co', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(158, '4', 'cweineb@businessinsider.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(159, '4', 'ecoalburnm@cnbc.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(160, '4', 'dmycockf@posterous.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(161, '4', 'evellad@fc2.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(162, '4', 'fdecourtc@hp.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(163, '4', 'hnatalie6@networkadvertising.org', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(164, '4', 'iallnatto@e-recht24.de', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(165, '4', 'jbenniee@epa.gov', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(166, '4', 'ktrouel4@alexa.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(167, '4', 'lblasiak2@amazonaws.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(168, '4', 'lrodnight5@123-reg.co.uk', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(169, '2', 'zvanhault8@twitpic.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(170, '4', 'mmaycockg@sfgate.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(171, '4', 'rclynmans9@gravatar.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(172, '4', 'rferrandn@wufoo.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(173, '4', 'storri3@surveymonkey.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(174, '4', 'tbeldani@google.fr', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(175, '4', 'tgrimes1@linkedin.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(176, '4', 'ustouteh@paginegialle.it', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, 1, NULL, NULL),
(177, '4', 'hszachniewicz7@eventbrite.com', '13/02/2020', NULL, NULL, 1, 1, 118, 0, 19.5, 1, NULL, NULL),
(178, '1', 'acookek@nps.gov', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(179, '2', 'ajardeinl@163.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(180, '3', 'azeale0@linkedin.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(181, '4', 'bjuggingj@alibaba.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(182, '4', 'chackinga@g.co', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(183, '4', 'cweineb@businessinsider.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(184, '4', 'ecoalburnm@cnbc.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(185, '4', 'dmycockf@posterous.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(186, '4', 'evellad@fc2.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(187, '4', 'fdecourtc@hp.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(188, '4', 'hnatalie6@networkadvertising.org', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(189, '4', 'iallnatto@e-recht24.de', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(190, '4', 'jbenniee@epa.gov', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(191, '4', 'ktrouel4@alexa.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(192, '4', 'lblasiak2@amazonaws.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(193, '4', 'lrodnight5@123-reg.co.uk', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(194, '2', 'zvanhault8@twitpic.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(195, '4', 'mmaycockg@sfgate.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(196, '4', 'rclynmans9@gravatar.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(197, '4', 'rferrandn@wufoo.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(198, '4', 'storri3@surveymonkey.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(199, '4', 'tbeldani@google.fr', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(200, '4', 'tgrimes1@linkedin.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(201, '4', 'ustouteh@paginegialle.it', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, 0, NULL, NULL),
(202, '4', 'hszachniewicz7@eventbrite.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, 19.5, 0, NULL, NULL),
(203, '1', 'acookek@nps.gov', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(204, '2', 'ajardeinl@163.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(205, '3', 'azeale0@linkedin.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(206, '4', 'bjuggingj@alibaba.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(207, '4', 'chackinga@g.co', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(208, '4', 'cweineb@businessinsider.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(209, '4', 'ecoalburnm@cnbc.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(210, '4', 'dmycockf@posterous.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(211, '4', 'evellad@fc2.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(212, '4', 'fdecourtc@hp.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(213, '4', 'hnatalie6@networkadvertising.org', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(214, '4', 'iallnatto@e-recht24.de', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(215, '4', 'jbenniee@epa.gov', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(216, '4', 'ktrouel4@alexa.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(217, '4', 'lblasiak2@amazonaws.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(218, '4', 'lrodnight5@123-reg.co.uk', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(219, '2', 'zvanhault8@twitpic.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(220, '4', 'mmaycockg@sfgate.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(221, '4', 'rclynmans9@gravatar.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(222, '4', 'rferrandn@wufoo.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(223, '4', 'storri3@surveymonkey.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(224, '4', 'tbeldani@google.fr', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(225, '4', 'tgrimes1@linkedin.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(226, '4', 'ustouteh@paginegialle.it', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, 1, NULL, NULL),
(227, '4', 'hszachniewicz7@eventbrite.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, 19.5, 1, NULL, NULL),
(228, '1', 'acookek@nps.gov', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(229, '2', 'ajardeinl@163.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(230, '3', 'azeale0@linkedin.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(231, '4', 'bjuggingj@alibaba.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(232, '4', 'chackinga@g.co', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(233, '4', 'cweineb@businessinsider.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(234, '4', 'ecoalburnm@cnbc.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(235, '4', 'dmycockf@posterous.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(236, '4', 'evellad@fc2.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(237, '4', 'fdecourtc@hp.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(238, '4', 'hnatalie6@networkadvertising.org', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(239, '4', 'iallnatto@e-recht24.de', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(240, '4', 'jbenniee@epa.gov', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(241, '4', 'ktrouel4@alexa.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(242, '4', 'lblasiak2@amazonaws.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(243, '4', 'lrodnight5@123-reg.co.uk', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(244, '2', 'zvanhault8@twitpic.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(245, '4', 'mmaycockg@sfgate.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(246, '4', 'rclynmans9@gravatar.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(247, '4', 'rferrandn@wufoo.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(248, '4', 'storri3@surveymonkey.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(249, '4', 'tbeldani@google.fr', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(250, '4', 'tgrimes1@linkedin.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(251, '4', 'ustouteh@paginegialle.it', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, 0, NULL, NULL),
(252, '4', 'hszachniewicz7@eventbrite.com', '18/02/2020', NULL, NULL, 1, 1, 111, 0, 23.5, 0, NULL, NULL),
(253, '1', 'acookek@nps.gov', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(254, '2', 'ajardeinl@163.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(255, '3', 'azeale0@linkedin.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(256, '4', 'bjuggingj@alibaba.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(257, '4', 'chackinga@g.co', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(258, '4', 'cweineb@businessinsider.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(259, '4', 'ecoalburnm@cnbc.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(260, '4', 'dmycockf@posterous.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(261, '4', 'evellad@fc2.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(262, '4', 'fdecourtc@hp.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(263, '4', 'hnatalie6@networkadvertising.org', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(264, '4', 'iallnatto@e-recht24.de', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(265, '4', 'jbenniee@epa.gov', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(266, '4', 'ktrouel4@alexa.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(267, '4', 'lblasiak2@amazonaws.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(268, '4', 'lrodnight5@123-reg.co.uk', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(269, '2', 'zvanhault8@twitpic.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(270, '4', 'mmaycockg@sfgate.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(271, '4', 'rclynmans9@gravatar.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(272, '4', 'rferrandn@wufoo.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(273, '4', 'storri3@surveymonkey.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(274, '4', 'tbeldani@google.fr', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(275, '4', 'tgrimes1@linkedin.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(276, '4', 'ustouteh@paginegialle.it', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, 1, NULL, NULL),
(277, '4', 'hszachniewicz7@eventbrite.com', '18/02/2020', NULL, NULL, 1, 1, 112, 0, 27.5, 1, NULL, NULL),
(278, '1', 'acookek@nps.gov', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(279, '2', 'ajardeinl@163.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(280, '3', 'azeale0@linkedin.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(281, '4', 'bjuggingj@alibaba.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(282, '4', 'chackinga@g.co', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(283, '4', 'cweineb@businessinsider.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(284, '4', 'ecoalburnm@cnbc.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(285, '4', 'dmycockf@posterous.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(286, '4', 'evellad@fc2.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(287, '4', 'fdecourtc@hp.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(288, '4', 'hnatalie6@networkadvertising.org', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(289, '4', 'iallnatto@e-recht24.de', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(290, '4', 'jbenniee@epa.gov', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(291, '4', 'ktrouel4@alexa.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(292, '4', 'lblasiak2@amazonaws.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(293, '4', 'lrodnight5@123-reg.co.uk', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(294, '2', 'zvanhault8@twitpic.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(295, '4', 'mmaycockg@sfgate.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(296, '4', 'rclynmans9@gravatar.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(297, '4', 'rferrandn@wufoo.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(298, '4', 'storri3@surveymonkey.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(299, '4', 'tbeldani@google.fr', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(300, '4', 'tgrimes1@linkedin.com', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(301, '4', 'ustouteh@paginegialle.it', '19/02/2020', NULL, NULL, 9, 13, 4, 4, NULL, 0, NULL, NULL),
(302, '4', 'hszachniewicz7@eventbrite.com', '19/02/2020', NULL, NULL, 1, 1, 4, 0, 31.5, 0, NULL, NULL),
(303, '1', 'acookek@nps.gov', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(304, '2', 'ajardeinl@163.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(305, '3', 'azeale0@linkedin.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(306, '4', 'bjuggingj@alibaba.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(307, '4', 'chackinga@g.co', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(308, '4', 'cweineb@businessinsider.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(309, '4', 'ecoalburnm@cnbc.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(310, '4', 'dmycockf@posterous.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(311, '4', 'evellad@fc2.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(312, '4', 'fdecourtc@hp.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(313, '4', 'hnatalie6@networkadvertising.org', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(314, '4', 'iallnatto@e-recht24.de', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(315, '4', 'jbenniee@epa.gov', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(316, '4', 'ktrouel4@alexa.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(317, '4', 'lblasiak2@amazonaws.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(318, '4', 'lrodnight5@123-reg.co.uk', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(319, '2', 'zvanhault8@twitpic.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(320, '4', 'mmaycockg@sfgate.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(321, '4', 'rclynmans9@gravatar.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(322, '4', 'rferrandn@wufoo.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(323, '4', 'storri3@surveymonkey.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(324, '4', 'tbeldani@google.fr', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(325, '4', 'tgrimes1@linkedin.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(326, '4', 'ustouteh@paginegialle.it', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, 1, NULL, NULL),
(327, '4', 'hszachniewicz7@eventbrite.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, 31.5, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `signatures_teachers`
--

CREATE TABLE `signatures_teachers` (
  `id` int NOT NULL,
  `email_responsible` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `date` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
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

--
-- Dumping data for table `signatures_teachers`
--

INSERT INTO `signatures_teachers` (`id`, `email_responsible`, `date`, `current_start_time`, `current_end_time`, `final_start_time`, `final_end_time`, `id_lesson`, `hours_of_lessons`, `lost_hours`, `email_supervisor_modify`, `modify_date`) VALUES
(1, 'simone@info.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, NULL, NULL, NULL),
(2, 'michele@info.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(3, 'matteo@info.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(4, 'michele@info.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(5, 'brizio@info.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(6, 'simone@info.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(7, 'matteo@info.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(8, 'simone@info.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(9, 'michele@info.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(10, 'matteo@info.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(11, 'brizio@info.com', '18/20/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(12, 'michele@info.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(13, 'michele@info.com', '26/02/2020', NULL, NULL, 14, 17, 110, 3, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `date_of_birth` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `residence` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `fiscal_code` varchar(16) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `id_course` int DEFAULT NULL,
  `ritirato` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`email`, `first_name`, `last_name`, `date_of_birth`, `residence`, `fiscal_code`, `id_course`, `ritirato`) VALUES
('acookek@nps.gov', 'Angilo', 'Cooke', '30/08/2019', 'Kanye', 'VLLRNN10E21L736C', 1, 0),
('ajardeinl@163.com', 'Antonio', 'Jasd', '08/01/2020', 'España', 'VLLRNN10E21L736C', 1, 0),
('azeale0@linkedin.com', 'Bombazzas', 'Zeales', '25/11/2020', 'Pshadas', 'VLLRNN10E21L736T', 1, 0),
('bjuggingj@alibaba.com', 'Bernadine', 'camelio', '25/03/2019', 'Lebedyan’', 'ZNONCL92P30G596D', 1, 0),
('chackinga@g.co', 'Charmione', 'Hackinge', '23/02/2017', 'Ballitovillee', 'VLLRNN10E21L736D', 1, 0),
('cweineb@businessinsider.com', 'Colene', 'Weine', '04/09/2019', 'Māymay', 'CSSNSC09P47H501F', 1, 0),
('dmycockf@posterous.com', 'Deck', 'Mycock', '18/08/2019', 'Rudo', 'FDLDDE02P70C351K', 1, 0),
('ecoalburnm@cnbc.com', 'Evy', 'Coalburn', '13/11/2020', 'Changtang', 'CSSNSC09P47H501F', 1, 0),
('evellad@fc2.com', 'Erie', 'Vella', '06/12/2019', 'Bangrat', 'FDLDDE02P70C351K', 1, 0),
('fdecourtc@hp.com', 'Forest', 'Decourt', '12/07/2019', 'Jakšić', 'CSSNSC09P47H501F', 1, 0),
('hnatalie6@networkadvertising.org', 'Harriett', 'Natalie', '14/02/2020', 'Eldoret', 'VLLRNN10E21L736C', 1, 0),
('hszachniewicz7@eventbrite.com', 'Howie', 'Szachniewicz', '15/11/2019', 'Linares', 'FDLDDE02P70C351K', 1, 0),
('iallnatto@e-recht24.de', 'Inger', 'Allnatt', '16/03/2019', 'Rizári', 'DOJNFJ92P30G596P', 1, 0),
('jbenniee@epa.gov', 'Jeri', 'Bennie', '06/10/2019', 'Hengtang', 'CSSNSC09P47H501F', 1, 0),
('ktrouel4@alexa.com', 'Katie', 'Trouel', '15/02/2020', 'Osiek', 'FDLDDE02P70C351K', 1, 0),
('lblasiak2@amazonaws.com', 'Lexine', 'Blasiak', '14/06/2019', 'Kugesi', 'VLLRNN10E21L736C', 1, 0),
('lrodnight5@123-reg.co.uk', 'Lexy', 'Rodnight', '07/07/2019', 'Cachoeiras de Macacu', 'CSSNSC09P47H501F', 1, 0),
('mmaycockg@sfgate.com', 'Martie', 'Maycock', '13/09/2019', 'Ueki', 'SLVLEI07R24C351Y', 1, 0),
('rclynmans9@gravatar.com', 'Rosa', 'Clynmans', '24/06/2019', 'Taoyao', 'MZZRLF02C30D612Y', 1, 0),
('rferrandn@wufoo.com', 'Rossien', 'Ferrandn', '10/12/2020', 'Dentonn', 'CSSNSC09P47H501D', 1, 0),
('storri3@surveymonkey.com', 'Sofie', 'Torri', '23/02/2019', 'Kushtia', 'FDLDDE02P70C351K', 1, 0),
('tbeldani@google.fr', 'Tades', 'Beldan', '03/03/2019', 'Galitsy', 'VLLRNN10E21L736C', 1, 0),
('tgrimes1@linkedin.com', 'Torieew', 'Grimes', '01/12/2019', 'Geshan', 'CSSNSC09P47H501F', 1, 0),
('ustouteh@paginegialle.it', 'Ursuline', 'Stoute', '11/11/2019', 'Zhonggang', 'VLLRNN10E21L736C', 1, 0),
('zvanhault8@twitpic.com', 'Zabrina', 'Van Hault', '24/08/2019', 'La Agustina', 'ZNONCL65P24G596T', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `supervisors`
--

CREATE TABLE `supervisors` (
  `email_responsible` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `id_course` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `supervisors`
--

INSERT INTO `supervisors` (`email_responsible`, `id_course`) VALUES
('luca@info.com', 1),
('luca@info.com', 3);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `email_responsible` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_course` int DEFAULT NULL,
  `companies_id` int DEFAULT NULL,
  `ritirato` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`email_responsible`, `first_name`, `last_name`, `id_course`, `companies_id`, `ritirato`) VALUES
('brizio@info.com', 'brizio', 'rossi', 1, 3, 0),
('matteo@info.com', 'matteo', 'morandi', 1, 2, 0),
('michele@info.com', 'michele', 'lampada', 1, 1, 0),
('simone@info.com', 'simone', 'd\'amico', 1, 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anagrafica`
--
ALTER TABLE `anagrafica`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `authentications`
--
ALTER TABLE `authentications`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `google_token`
--
ALTER TABLE `google_token`
  ADD PRIMARY KEY (`email`);

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
-- Indexes for table `responsibles_auth`
--
ALTER TABLE `responsibles_auth`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `signatures_students`
--
ALTER TABLE `signatures_students`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `signatures_teachers`
--
ALTER TABLE `signatures_teachers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `supervisors`
--
ALTER TABLE `supervisors`
  ADD PRIMARY KEY (`email_responsible`,`id_course`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`email_responsible`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anagrafica`
--
ALTER TABLE `anagrafica`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `judgments`
--
ALTER TABLE `judgments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- AUTO_INCREMENT for table `questionnaires`
--
ALTER TABLE `questionnaires`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `signatures_students`
--
ALTER TABLE `signatures_students`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=328;

--
-- AUTO_INCREMENT for table `signatures_teachers`
--
ALTER TABLE `signatures_teachers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
