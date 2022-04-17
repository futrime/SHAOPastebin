/**
 * @license
 * Copyright 2022 Futrime & M1saka10010
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2022-02-04 13:52:13
-- 服务器版本： 5.6.50-log
-- PHP 版本： 7.4.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `pastebin`
--

-- --------------------------------------------------------

--
-- 表的结构 `mail_confirm`
--

CREATE TABLE `mail_confirm` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `access_key` varchar(32) NOT NULL,
  `type` int(11) NOT NULL,
  `expire_date` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `pastebin`
--

CREATE TABLE `pastebin` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `alias` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `encryption` tinyint(1) NOT NULL,
  `password` varchar(32) NOT NULL,
  `title` varchar(100) NOT NULL,
  `text` mediumtext NOT NULL,
  `metadata` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `mail` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `password` varchar(32) NOT NULL,
  `level` int(11) NOT NULL,
  `token` varchar(32) NOT NULL,
  `regist_date` int(11) NOT NULL,
  `latest_date` int(11) NOT NULL,
  `salt` varchar(4) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转储表的索引
--

--
-- 表的索引 `mail_confirm`
--
ALTER TABLE `mail_confirm`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `pastebin`
--
ALTER TABLE `pastebin`
  ADD PRIMARY KEY (`id`);
  ADD UNIQUE KEY `id` (`id`);

--
-- 表的索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `mail_confirm`
--
ALTER TABLE `mail_confirm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `pastebin`
--
ALTER TABLE `pastebin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
