-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Feb 20, 2020 alle 18:17
-- Versione del server: 10.4.11-MariaDB
-- Versione PHP: 7.4.2

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
-- Struttura della tabella `anagrafica`
--

CREATE TABLE `anagrafica` (
  `ID` int(11) NOT NULL,
  `codice_anagrafica` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `id_anagrafica` int(11) NOT NULL,
  `valore` varchar(80) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dump dei dati per la tabella `anagrafica`
--

INSERT INTO `anagrafica` (`ID`, `codice_anagrafica`, `id_anagrafica`, `valore`) VALUES
(1, 'RUOLO', 1, 'AMMINISTRATORE'),
(2, 'RUOLO', 2, 'COORDINATORE'),
(3, 'RUOLO', 3, 'SUPERVISORE'),
(4, 'RUOLO', 4, 'DOCENTE'),
(5, 'RUOLO', 5, 'STUDENTE');

-- --------------------------------------------------------

--
-- Struttura della tabella `authentications`
--

CREATE TABLE `authentications` (
  `email_student` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `code_image` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `start_year` int(11) DEFAULT NULL,
  `end_year` int(11) DEFAULT NULL,
  `token_calendar` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dump dei dati per la tabella `courses`
--

INSERT INTO `courses` (`id`, `name`, `start_year`, `end_year`, `token_calendar`) VALUES
(1, 'Turing', 2018, 2020, NULL),
(2, 'McLuhan', 2018, 2020, NULL),
(3, 'Turing', 2019, 2021, NULL),
(4, 'Hopper', 2019, 2021, NULL);

-- --------------------------------------------------------

--
-- Struttura della tabella `judgments`
--

CREATE TABLE `judgments` (
  `id` int(11) NOT NULL,
  `id_questionnaire` int(11) DEFAULT NULL,
  `vote` int(11) NOT NULL,
  `email_user_receiving` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `email_user_sender` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `lessons`
--

CREATE TABLE `lessons` (
  `id` int(11) NOT NULL,
  `lesson` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_signature` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `companies_id` int(11) NOT NULL,
  `classroom` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_course` int(11) DEFAULT NULL,
  `date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `start_time` float DEFAULT NULL,
  `end_time` float DEFAULT NULL,
  `total_hours` float DEFAULT NULL,
  `creation_date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `modify_date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_supervisor_create` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_supervisor_modify` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dump dei dati per la tabella `lessons`
--

INSERT INTO `lessons` (`id`, `lesson`, `email_signature`, `companies_id`, `classroom`, `id_course`, `date`, `start_time`, `end_time`, `total_hours`, `creation_date`, `modify_date`, `email_supervisor_create`, `email_supervisor_modify`) VALUES
(106, 'metodologia agile', 'simone d\'amico', 0, 'comandini', 1, '11/02/2020', 8.5, 11, 2.5, '07/02/2020', NULL, NULL, NULL),
(107, 'metologia agile', 'flowing', 0, 'maggioli', 1, '13/02/2020', 9, 12, 3, '07/02/2020', NULL, NULL, NULL),
(108, 'metodologia agile', 'simone d\'amico', 0, 'comandini', 1, '11/02/2020', 8.5, 11, 2.5, '07/02/2020', NULL, NULL, NULL),
(109, 'metologia agile', 'flowing', 0, 'maggioli', 1, '13/02/2020', 9, 12, 3, '07/02/2020', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struttura della tabella `questionnaires`
--

CREATE TABLE `questionnaires` (
  `id` int(11) NOT NULL,
  `text` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `subject` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `responsibles_auth`
--

CREATE TABLE `responsibles_auth` (
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `first_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `responsible_level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dump dei dati per la tabella `responsibles_auth`
--

INSERT INTO `responsibles_auth` (`email`, `password`, `first_name`, `last_name`, `responsible_level`) VALUES
('luca@info.com', '12345', 'Luca', 'Arcangeli', 2);

-- --------------------------------------------------------

--
-- Struttura della tabella `signatures_students`
--

CREATE TABLE `signatures_students` (
  `code_authentication` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `current_start_time` timestamp NULL DEFAULT NULL,
  `current_end_time` timestamp NULL DEFAULT NULL,
  `final_start_time` float DEFAULT NULL,
  `final_end_time` float DEFAULT NULL,
  `id_lesson` int(11) DEFAULT NULL,
  `hours_of_lessons` float DEFAULT NULL,
  `lost_hours` float DEFAULT NULL,
  `email_supervisor_modify` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `modify_date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `signatures_teachers`
--

CREATE TABLE `signatures_teachers` (
  `email_responsible` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `current_start_time` timestamp NULL DEFAULT NULL,
  `current_end_time` timestamp NULL DEFAULT NULL,
  `final_start_time` float DEFAULT NULL,
  `final_end_time` float DEFAULT NULL,
  `id_lesson` int(11) DEFAULT NULL,
  `hours_of_lessons` float DEFAULT NULL,
  `lost_hours` float DEFAULT NULL,
  `email_supervisor_modify` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `modify_date` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `students`
--

CREATE TABLE `students` (
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `date_of_birth` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_course` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dump dei dati per la tabella `students`
--

INSERT INTO `students` (`email`, `first_name`, `last_name`, `date_of_birth`, `id_course`) VALUES
('daniele@info.com', 'daniele', 'marocchi', '01/01/1960', 1),
('niccolo@info.com', 'niccolo', 'zona', '30/09/1992', 1),
('pol@info.com', 'paolo', 'valmori', '01/01/1930', 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `supervisors`
--

CREATE TABLE `supervisors` (
  `email_responsible` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `id_course` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dump dei dati per la tabella `supervisors`
--

INSERT INTO `supervisors` (`email_responsible`, `id_course`) VALUES
('luca@info.com', 1),
('luca@info.com', 3);

-- --------------------------------------------------------

--
-- Struttura della tabella `teachers`
--

CREATE TABLE `teachers` (
  `email_responsible` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `id_course` int(11) DEFAULT NULL,
  `companies_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dump dei dati per la tabella `teachers`
--

INSERT INTO `teachers` (`email_responsible`, `id_course`, `companies_id`) VALUES
('matteo@info.com', 1, 0),
('simone@flowing.com', 1, 0);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `anagrafica`
--
ALTER TABLE `anagrafica`
  ADD PRIMARY KEY (`ID`);

--
-- Indici per le tabelle `authentications`
--
ALTER TABLE `authentications`
  ADD PRIMARY KEY (`code`);

--
-- Indici per le tabelle `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `judgments`
--
ALTER TABLE `judgments`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `questionnaires`
--
ALTER TABLE `questionnaires`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `responsibles_auth`
--
ALTER TABLE `responsibles_auth`
  ADD PRIMARY KEY (`email`);

--
-- Indici per le tabelle `signatures_students`
--
ALTER TABLE `signatures_students`
  ADD PRIMARY KEY (`code_authentication`);

--
-- Indici per le tabelle `signatures_teachers`
--
ALTER TABLE `signatures_teachers`
  ADD PRIMARY KEY (`email_responsible`);

--
-- Indici per le tabelle `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`email`);

--
-- Indici per le tabelle `supervisors`
--
ALTER TABLE `supervisors`
  ADD PRIMARY KEY (`email_responsible`,`id_course`) USING BTREE;

--
-- Indici per le tabelle `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`email_responsible`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `anagrafica`
--
ALTER TABLE `anagrafica`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la tabella `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `judgments`
--
ALTER TABLE `judgments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT per la tabella `questionnaires`
--
ALTER TABLE `questionnaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
