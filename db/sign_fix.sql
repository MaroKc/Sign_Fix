-- phpMyAdmin SQL Dump
-- version 4.9.1deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 21, 2020 at 12:27 PM
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
CREATE DATABASE IF NOT EXISTS `sign_fix` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
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
  `companies_id` int NOT NULL,
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

INSERT INTO `signatures_students` (`code_authentication`, `email_student`, `date`, `current_start_time`, `current_end_time`, `final_start_time`, `final_end_time`, `id_lesson`, `hours_of_lessons`, `lost_hours`, `email_supervisor_modify`, `modify_date`) VALUES
('', 'acookek@nps.gov', '21/02/2020', NULL, NULL, NULL, NULL, NULL, 50, 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `signatures_teachers`
--

CREATE TABLE `signatures_teachers` (
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
  `id_course` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`email`, `first_name`, `last_name`, `date_of_birth`, `residence`, `fiscal_code`, `id_course`) VALUES
('acookek@nps.gov', 'Angil', 'Cooke', '30/08/2019', 'Kanye', '0074-3043', 1),
('ajardeinl@163.com', 'Antony', 'Jardein', '08/01/2020', 'España', '63304-588', 1),
('azeale0@linkedin.com', 'Alanson', 'Zeale', '25/11/2019', 'Pshada', '45765-5100', 1),
('bjuggingj@alibaba.com', 'Bernadine', 'Jugging', '25/03/2019', 'Lebedyan’', '65162-554', 1),
('chackinga@g.co', 'Charmion', 'Hacking', '23/02/2019', 'Ballitoville', '57520-0769', 1),
('cweineb@businessinsider.com', 'Colene', 'Weine', '03/09/2019', 'Māymay', '48102-003', 1),
('dmycockf@posterous.com', 'Deck', 'Mycock', '18/08/2019', 'Rudo', '0363-0458', 1),
('ecoalburnm@cnbc.com', 'Evy', 'Coalburn', '13/11/2019', 'Changtang', '16110-502', 1),
('evellad@fc2.com', 'Erie', 'Vella', '06/12/2019', 'Bangrat', '41250-906', 1),
('fdecourtc@hp.com', 'Forest', 'Decourt', '12/07/2019', 'Jakšić', '65342-1004', 1),
('hnatalie6@networkadvertising.org', 'Harriett', 'Natalie', '14/02/2020', 'Eldoret', '33261-830', 1),
('hszachniewicz7@eventbrite.com', 'Howie', 'Szachniewicz', '15/11/2019', 'Linares', '0093-2047', 1),
('iallnatto@e-recht24.de', 'Inger', 'Allnatt', '16/03/2019', 'Rizári', '16781-375', 1),
('jbenniee@epa.gov', 'Jeri', 'Bennie', '06/10/2019', 'Hengtang', '58930-036', 1),
('ktrouel4@alexa.com', 'Katie', 'Trouel', '15/02/2020', 'Osiek', '66291-001', 1),
('lblasiak2@amazonaws.com', 'Lexine', 'Blasiak', '14/06/2019', 'Kugesi', '21695-602', 1),
('lrodnight5@123-reg.co.uk', 'Lexy', 'Rodnight', '07/07/2019', 'Cachoeiras de Macacu', '68462-361', 1),
('mmaycockg@sfgate.com', 'Martie', 'Maycock', '13/09/2019', 'Ueki', '55714-1500', 1),
('rclynmans9@gravatar.com', 'Rosa', 'Clynmans', '24/06/2019', 'Taoyao', '68472-049', 1),
('rferrandn@wufoo.com', 'Rossie', 'Ferrand', '10/12/2019', 'Denton', '67795-033', 1),
('storri3@surveymonkey.com', 'Sofie', 'Torri', '23/02/2019', 'Kushtia', '49643-305', 1),
('tbeldani@google.fr', 'Tades', 'Beldan', '03/03/2019', 'Galitsy', '68016-080', 1),
('tgrimes1@linkedin.com', 'Torie', 'Grimes', '01/12/2019', 'Geshan', '49967-575', 1),
('ustouteh@paginegialle.it', 'Ursuline', 'Stoute', '11/11/2019', 'Zhonggang', '52584-485', 1),
('zvanhault8@twitpic.com', 'Zabrina', 'Van Hault', '24/08/2019', 'La Agustina', '60681-1001', 1);

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
  `id_course` int DEFAULT NULL,
  `companies_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`email_responsible`, `id_course`, `companies_id`) VALUES
('matteo@info.com', 1, 0),
('simone@flowing.com', 1, 0);

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
  ADD PRIMARY KEY (`email_responsible`,`id_course`) USING BTREE;

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
