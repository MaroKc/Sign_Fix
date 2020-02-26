-- phpMyAdmin SQL Dump
-- version 4.9.1deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 25, 2020 at 08:12 PM
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
(2, 'metologia agile', 'simone@info.com', 1, 'maggioli', 1, '10/02/2020', 14, 18, 4, '07/02/2020', NULL, NULL, NULL),
(3, 'metodologia agile', 'flowing', 1, 'comandini', 1, '27/02/2020', 9, 11, 2, '07/02/2020', NULL, NULL, NULL),
(4, 'metologia agile', 'michele@info.com', 1, 'maggioli', 1, '19/02/2020', 9, 12, 3, '07/02/2020', NULL, NULL, NULL),
(110, 'metologia agile', 'flowing', 1, 'maggioli', 1, '26/02/2020', 14, 17, 3, '07/02/2020', NULL, NULL, NULL),
(111, 'php', 'matteo@info.com', 2, 'comandini', 1, '18/02/2020', 9, 13, 4, '07/02/2020', NULL, NULL, NULL),
(112, 'database', 'brizio@info.com', 3, 'comandini', 1, '18/02/2020', 14, 18, 4, '07/02/2020', NULL, NULL, NULL),
(113, 'metologia agile', 'simone@info.com', 1, 'maggioli', 1, '17/02/2020', 9.5, 12, 2.5, '07/02/2020', NULL, NULL, NULL),
(116, 'metologia agile', 'michele@info.com', 1, 'maggioli', 1, '17/02/2020', 12.5, 15.5, 3, '07/02/2020', NULL, NULL, NULL),
(117, 'metologia agile', 'simone@info.com', 1, 'maggioli', 1, '13/02/2020', 9, 13, 4, '07/02/2020', NULL, NULL, NULL),
(118, 'php', 'matteo@info.com', 2, 'comandini', 1, '13/02/2020', 14, 17, 3, '07/02/2020', NULL, NULL, NULL),
(119, 'database', 'brizio@info.com', 3, 'comandini', 1, '12/02/2020', 14, 18, 4, '07/02/2020', NULL, NULL, NULL),
(120, 'php', 'matteo@info.com', 2, 'comandini', 1, '11/02/2020', 9, 13, 4, '07/02/2020', NULL, NULL, NULL),
(121, 'metologia agile', 'michele@info.com', 1, 'maggioli', 1, '11/02/2020', 14, 17, 3, '07/02/2020', NULL, NULL, NULL);

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
  `email_supervisor_modify` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `modify_date` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `signatures_students`
--

INSERT INTO `signatures_students` (`id`, `code_authentication`, `email_student`, `date`, `current_start_time`, `current_end_time`, `final_start_time`, `final_end_time`, `id_lesson`, `hours_of_lessons`, `lost_hours`, `email_supervisor_modify`, `modify_date`) VALUES
(1, '1', 'acookek@nps.gov', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(2, '2', 'ajardeinl@163.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(3, '3', 'azeale0@linkedin.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(4, '4', 'bjuggingj@alibaba.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(5, '4', 'chackinga@g.co', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(6, '4', 'cweineb@businessinsider.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(8, '4', 'ecoalburnm@cnbc.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(9, '4', 'dmycockf@posterous.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(10, '4', 'evellad@fc2.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(11, '4', 'fdecourtc@hp.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(12, '4', 'hnatalie6@networkadvertising.org', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(13, '4', 'hszachniewicz7@eventbrite.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(14, '4', 'iallnatto@e-recht24.de', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(15, '4', 'jbenniee@epa.gov', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(16, '4', 'ktrouel4@alexa.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(17, '4', 'lblasiak2@amazonaws.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(18, '4', 'lrodnight5@123-reg.co.uk', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(19, '4', 'rclynmans9@gravatar.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(20, '4', 'rferrandn@wufoo.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(21, '4', 'storri3@surveymonkey.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(22, '4', 'tbeldani@google.fr', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(23, '4', 'tgrimes1@linkedin.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(24, '', 'azeale0@linkedin.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(25, '', 'bjuggingj@alibaba.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(26, '', 'chackinga@g.co', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(27, '', 'cweineb@businessinsider.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(28, '', 'dmycockf@posterous.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(29, '', 'ecoalburnm@cnbc.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(30, '', 'evellad@fc2.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(31, '', 'fdecourtc@hp.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(32, '', 'hnatalie6@networkadvertising.org', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(33, '', 'hszachniewicz7@eventbrite.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(34, '', 'iallnatto@e-recht24.de', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(35, '', 'jbenniee@epa.gov', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(36, '', 'ktrouel4@alexa.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(37, '', 'lblasiak2@amazonaws.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(38, '', 'lrodnight5@123-reg.co.uk', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(39, '', 'mmaycockg@sfgate.com', '10/02/2020', NULL, NULL, 9, 12, 4, 3, 38, NULL, NULL),
(40, '', 'rclynmans9@gravatar.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(41, '', 'rferrandn@wufoo.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(42, '', 'storri3@surveymonkey.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(43, '', 'tbeldani@google.fr', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(44, '', 'tgrimes1@linkedin.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(47, '', 'acookek@nps.gov', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(48, '', 'ajardeinl@163.com', '10/02/2020', NULL, NULL, 14, 18, 2, 4, 0, NULL, NULL),
(49, '1', 'acookek@nps.gov', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(50, '2', 'ajardeinl@163.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(51, '3', 'azeale0@linkedin.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(52, '4', 'bjuggingj@alibaba.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(53, '4', 'chackinga@g.co', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(54, '4', 'cweineb@businessinsider.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(56, '4', 'ecoalburnm@cnbc.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(57, '4', 'dmycockf@posterous.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(58, '4', 'evellad@fc2.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(59, '4', 'fdecourtc@hp.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(60, '4', 'hnatalie6@networkadvertising.org', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(61, '4', 'hszachniewicz7@eventbrite.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(62, '4', 'iallnatto@e-recht24.de', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(63, '4', 'jbenniee@epa.gov', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(64, '4', 'ktrouel4@alexa.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(65, '4', 'lblasiak2@amazonaws.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(66, '4', 'lrodnight5@123-reg.co.uk', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(67, '4', 'rclynmans9@gravatar.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(68, '4', 'rferrandn@wufoo.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(69, '4', 'storri3@surveymonkey.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(70, '4', 'tbeldani@google.fr', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(71, '4', 'tgrimes1@linkedin.com', '11/02/2020', NULL, NULL, 9, 13, 120, 4, NULL, NULL, NULL),
(72, '1', 'acookek@nps.gov', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(73, '2', 'ajardeinl@163.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(74, '3', 'azeale0@linkedin.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(75, '4', 'bjuggingj@alibaba.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(76, '4', 'chackinga@g.co', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(77, '4', 'cweineb@businessinsider.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(78, '4', 'dmycockf@posterous.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(79, '4', 'ecoalburnm@cnbc.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(81, '4', 'evellad@fc2.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(82, '4', 'fdecourtc@hp.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(83, '4', 'hnatalie6@networkadvertising.org', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(84, '4', 'hszachniewicz7@eventbrite.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(85, '4', 'iallnatto@e-recht24.de', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(86, '4', 'jbenniee@epa.gov', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(87, '4', 'ktrouel4@alexa.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(88, '4', 'lblasiak2@amazonaws.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(89, '4', 'lrodnight5@123-reg.co.uk', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(90, '4', 'rclynmans9@gravatar.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(91, '4', 'rferrandn@wufoo.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(92, '4', 'storri3@surveymonkey.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(93, '4', 'tbeldani@google.fr', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(94, '4', 'tgrimes1@linkedin.com', '11/02/2020', NULL, NULL, 14, 17, 121, 3, NULL, NULL, NULL),
(95, '1', 'acookek@nps.gov', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(96, '2', 'ajardeinl@163.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(97, '3', 'azeale0@linkedin.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(98, '4', 'bjuggingj@alibaba.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(99, '4', 'chackinga@g.co', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(100, '4', 'cweineb@businessinsider.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(102, '4', 'ecoalburnm@cnbc.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(103, '4', 'dmycockf@posterous.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(104, '4', 'evellad@fc2.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(105, '4', 'fdecourtc@hp.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(106, '4', 'hnatalie6@networkadvertising.org', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(107, '4', 'hszachniewicz7@eventbrite.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(108, '4', 'iallnatto@e-recht24.de', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(109, '4', 'jbenniee@epa.gov', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(110, '4', 'ktrouel4@alexa.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(111, '4', 'lblasiak2@amazonaws.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(112, '4', 'lrodnight5@123-reg.co.uk', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(113, '4', 'rclynmans9@gravatar.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(114, '4', 'rferrandn@wufoo.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(115, '4', 'storri3@surveymonkey.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(116, '4', 'tbeldani@google.fr', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(117, '4', 'tgrimes1@linkedin.com', '12/02/2020', NULL, NULL, 14, 18, 119, 4, NULL, NULL, NULL),
(118, '4', 'ustouteh@paginegialle.it', '10/02/2020', NULL, NULL, 9, 12, 4, 3, 38, NULL, NULL),
(120, '4', 'mmayockg@sfgate.com', '10/02/2020', NULL, NULL, 8.5, 11, 1, 2.5, NULL, NULL, NULL),
(121, '2', 'zvanhault8@twitpic.com', '10/02/2020', NULL, NULL, 9, 12, 4, 2.5, 38, NULL, NULL),
(122, '1', 'acookek@nps.gov', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(123, '2', 'ajardeinl@163.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(124, '3', 'azeale0@linkedin.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(125, '4', 'bjuggingj@alibaba.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(126, '4', 'chackinga@g.co', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(127, '4', 'cweineb@businessinsider.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(128, '4', 'ecoalburnm@cnbc.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(129, '4', 'dmycockf@posterous.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(130, '4', 'evellad@fc2.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(131, '4', 'fdecourtc@hp.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(132, '4', 'hnatalie6@networkadvertising.org', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(133, '4', 'hszachniewicz7@eventbrite.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(134, '4', 'iallnatto@e-recht24.de', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(135, '4', 'jbenniee@epa.gov', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(136, '4', 'ktrouel4@alexa.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(137, '4', 'lblasiak2@amazonaws.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(138, '4', 'lrodnight5@123-reg.co.uk', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(139, '4', 'rclynmans9@gravatar.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(140, '4', 'rferrandn@wufoo.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(141, '4', 'storri3@surveymonkey.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(142, '4', 'tbeldani@google.fr', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(143, '4', 'tgrimes1@linkedin.com', '13/02/2020', NULL, NULL, 9, 13, 117, 4, NULL, NULL, NULL),
(144, '1', 'acookek@nps.gov', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(145, '2', 'ajardeinl@163.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(146, '3', 'azeale0@linkedin.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(147, '4', 'bjuggingj@alibaba.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(148, '4', 'chackinga@g.co', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(149, '4', 'cweineb@businessinsider.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(150, '4', 'ecoalburnm@cnbc.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(151, '4', 'dmycockf@posterous.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(152, '4', 'evellad@fc2.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(153, '4', 'fdecourtc@hp.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(154, '4', 'hnatalie6@networkadvertising.org', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(155, '4', 'hszachniewicz7@eventbrite.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(156, '4', 'iallnatto@e-recht24.de', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(157, '4', 'jbenniee@epa.gov', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(158, '4', 'ktrouel4@alexa.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(159, '4', 'lblasiak2@amazonaws.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(160, '4', 'lrodnight5@123-reg.co.uk', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(161, '4', 'rclynmans9@gravatar.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(162, '4', 'rferrandn@wufoo.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(163, '4', 'storri3@surveymonkey.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(164, '4', 'tbeldani@google.fr', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(165, '4', 'tgrimes1@linkedin.com', '13/02/2020', NULL, NULL, 14, 17, 118, 3, NULL, NULL, NULL),
(166, '1', 'acookek@nps.gov', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(167, '2', 'ajardeinl@163.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(168, '3', 'azeale0@linkedin.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(169, '4', 'bjuggingj@alibaba.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(170, '4', 'chackinga@g.co', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(171, '4', 'cweineb@businessinsider.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(172, '4', 'ecoalburnm@cnbc.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(173, '4', 'dmycockf@posterous.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(174, '4', 'evellad@fc2.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(175, '4', 'fdecourtc@hp.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(176, '4', 'hnatalie6@networkadvertising.org', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(177, '4', 'hszachniewicz7@eventbrite.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(178, '4', 'iallnatto@e-recht24.de', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(179, '4', 'jbenniee@epa.gov', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(180, '4', 'ktrouel4@alexa.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(181, '4', 'lblasiak2@amazonaws.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(182, '4', 'lrodnight5@123-reg.co.uk', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(183, '4', 'rclynmans9@gravatar.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(184, '4', 'rferrandn@wufoo.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(185, '4', 'storri3@surveymonkey.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(186, '4', 'tbeldani@google.fr', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(187, '4', 'tgrimes1@linkedin.com', '17/02/2020', NULL, NULL, 9.5, 12, 113, 2.5, NULL, NULL, NULL),
(188, '1', 'acookek@nps.gov', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(189, '2', 'ajardeinl@163.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(190, '3', 'azeale0@linkedin.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(191, '4', 'bjuggingj@alibaba.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(192, '4', 'chackinga@g.co', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(193, '4', 'cweineb@businessinsider.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(194, '4', 'ecoalburnm@cnbc.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(195, '4', 'dmycockf@posterous.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(196, '4', 'evellad@fc2.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(197, '4', 'fdecourtc@hp.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(198, '4', 'hnatalie6@networkadvertising.org', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(199, '4', 'hszachniewicz7@eventbrite.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(200, '4', 'iallnatto@e-recht24.de', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(201, '4', 'jbenniee@epa.gov', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(202, '4', 'ktrouel4@alexa.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(203, '4', 'lblasiak2@amazonaws.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(204, '4', 'lrodnight5@123-reg.co.uk', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(205, '4', 'rclynmans9@gravatar.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(206, '4', 'rferrandn@wufoo.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(207, '4', 'storri3@surveymonkey.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(208, '4', 'tbeldani@google.fr', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(209, '4', 'tgrimes1@linkedin.com', '17/02/2020', NULL, NULL, 12.5, 15.5, 116, 3, NULL, NULL, NULL),
(210, '1', 'acookek@nps.gov', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(211, '2', 'ajardeinl@163.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(212, '3', 'azeale0@linkedin.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(213, '4', 'bjuggingj@alibaba.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(214, '4', 'chackinga@g.co', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(215, '4', 'cweineb@businessinsider.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(216, '4', 'ecoalburnm@cnbc.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(217, '4', 'dmycockf@posterous.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(218, '4', 'evellad@fc2.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(219, '4', 'fdecourtc@hp.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(220, '4', 'hnatalie6@networkadvertising.org', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(221, '4', 'hszachniewicz7@eventbrite.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(222, '4', 'iallnatto@e-recht24.de', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(223, '4', 'jbenniee@epa.gov', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(224, '4', 'ktrouel4@alexa.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(225, '4', 'lblasiak2@amazonaws.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(226, '4', 'lrodnight5@123-reg.co.uk', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(227, '4', 'rclynmans9@gravatar.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(228, '4', 'rferrandn@wufoo.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(229, '4', 'storri3@surveymonkey.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(230, '4', 'tbeldani@google.fr', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(231, '4', 'tgrimes1@linkedin.com', '18/02/2020', NULL, NULL, 9, 13, 111, 4, NULL, NULL, NULL),
(232, '1', 'acookek@nps.gov', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(233, '2', 'ajardeinl@163.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(234, '3', 'azeale0@linkedin.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(235, '4', 'bjuggingj@alibaba.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(236, '4', 'chackinga@g.co', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(237, '4', 'cweineb@businessinsider.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(238, '4', 'ecoalburnm@cnbc.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(239, '4', 'dmycockf@posterous.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(240, '4', 'evellad@fc2.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(241, '4', 'fdecourtc@hp.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(242, '4', 'hnatalie6@networkadvertising.org', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(243, '4', 'hszachniewicz7@eventbrite.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(244, '4', 'iallnatto@e-recht24.de', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(245, '4', 'jbenniee@epa.gov', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(246, '4', 'ktrouel4@alexa.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(247, '4', 'lblasiak2@amazonaws.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(248, '4', 'lrodnight5@123-reg.co.uk', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(249, '4', 'rclynmans9@gravatar.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(250, '4', 'rferrandn@wufoo.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(251, '4', 'storri3@surveymonkey.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(252, '4', 'tbeldani@google.fr', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(253, '4', 'tgrimes1@linkedin.com', '18/02/2020', NULL, NULL, 14, 18, 112, 4, NULL, NULL, NULL),
(254, '1', 'acookek@nps.gov', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(255, '2', 'ajardeinl@163.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(256, '3', 'azeale0@linkedin.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(257, '4', 'bjuggingj@alibaba.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(258, '4', 'chackinga@g.co', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(259, '4', 'cweineb@businessinsider.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(260, '4', 'ecoalburnm@cnbc.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(261, '4', 'dmycockf@posterous.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(262, '4', 'evellad@fc2.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(263, '4', 'fdecourtc@hp.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(264, '4', 'hnatalie6@networkadvertising.org', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(265, '4', 'hszachniewicz7@eventbrite.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(266, '4', 'iallnatto@e-recht24.de', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(267, '4', 'jbenniee@epa.gov', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(268, '4', 'ktrouel4@alexa.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(269, '4', 'lblasiak2@amazonaws.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(270, '4', 'lrodnight5@123-reg.co.uk', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(271, '4', 'rclynmans9@gravatar.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(272, '4', 'rferrandn@wufoo.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(273, '4', 'storri3@surveymonkey.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(274, '4', 'tbeldani@google.fr', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL),
(275, '4', 'tgrimes1@linkedin.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL);

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
(12, 'michele@info.com', '19/02/2020', NULL, NULL, 9, 12, 4, 3, NULL, NULL, NULL);

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
('acookek@nps.gov', 'Angil', 'Cooke', '30/08/2019', 'Kanye', 'VLLRNN10E21L736C', 1, 0),
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
  `companies_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`email_responsible`, `first_name`, `last_name`, `id_course`, `companies_id`) VALUES
('brizio@info.com', 'brizio', 'rossi', 1, 3),
('matteo@info.com', 'matteo', 'morandi', 1, 2),
('michele@info.com', 'michele', 'lampada', 1, 1),
('simone@info.com', 'simone', 'cala', 1, 1);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `questionnaires`
--
ALTER TABLE `questionnaires`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `signatures_students`
--
ALTER TABLE `signatures_students`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=276;

--
-- AUTO_INCREMENT for table `signatures_teachers`
--
ALTER TABLE `signatures_teachers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
