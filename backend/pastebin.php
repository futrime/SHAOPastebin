<?php

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

include 'config.php';
include 'functions/db.php';
include 'functions/function.php';
if (!isset($_POST['type'])) {
    $data = array('code' => 400, 'message' => 'Missing value of type.');
    $json = json_encode($data);
    exit($json);
}
switch ($_POST['type']) {
    case "add": // create a new paste
        if (!isset($_POST['token']) || !isset($_POST['title']) || !isset($_POST['text']) || !isset($_POST['encryption']) || empty($_POST['token']) || $_POST['title'] == "" || $_POST['text'] == "") {
            $data = array('code' => 400, 'message' => 'Missing value(s).');
            $json = json_encode($data);
            exit($json);
        } else if (!confirm_login($_POST['token'])) {
            $data = array('code' => 415, 'message' => 'Do not logged in.');
            $json = json_encode($data);
            exit($json);
        } else if (strlen($_POST['title']) > 100) {
            $data = array('code' => 420, 'message' => 'Title too long.');
            $json = json_encode($data);
            exit($json);
        } else if (strlen($_POST['text']) > 1048576 * 8) {
            $data = array('code' => 421, 'message' => 'Text too long.');
            $json = json_encode($data);
            exit($json);
        } else if (isset($_POST['password']) && strlen($_POST['password']) > 32) {
            $data = array('code' => 422, 'message' => 'Password too long.');
            $json = json_encode($data);
            exit($json);
        } else if (isset($_POST['alias']) && strlen($_POST['alias']) > 20) {
            $data = array('code' => 423, 'message' => 'Alias too long.');
            $json = json_encode($data);
            exit($json);
        } else if ($_POST['encryption'] == 1 && (!isset($_POST['password']) || empty($_POST['password']))) {
            $data = array('code' => 424, 'message' => 'Unsupport empty password.');
            $json = json_encode($data);
            exit($json);
        }
        $u_data = user_info($_POST['token']);
        if ($u_data['level'] == -1) {
            $data = array('code' => 425, 'message' => 'Please confirm your email first.');
            $json = json_encode($data);
            exit($json);
        }
        if ($_POST['encryption'] == 1) {
            if (!isset($_POST['alias']) || empty($_POST['alias'])) {
                if (isset($_POST['metadata']) && $_POST['metadata'] != "") {
                    add_pastebin($u_data['id'], 1, $_POST['password'], NULL, $_POST['title'], base64_encode($_POST['text']), $_POST['metadata']);
                } else {
                    add_pastebin($u_data['id'], 1, $_POST['password'], NULL, $_POST['title'], base64_encode($_POST['text']), '');
                }
                $data = array('code' => 0, 'message' => 'Successfully add pastebin.');
                $json = json_encode($data);
                exit($json);
            } else {
                if (pastebin_info_alias($_POST['alias']) || is_numeric($_POST['alias'])) {
                    $data = array('code' => 426, 'message' => 'This alias has been taken.');
                    $json = json_encode($data);
                    exit($json);
                } else {
                    if (isset($_POST['metadata']) && $_POST['metadata'] != "") {
                        add_pastebin($u_data['id'], 1, $_POST['password'], $_POST['alias'], $_POST['title'], base64_encode($_POST['text']), $_POST['metadata']);
                    } else {
                        add_pastebin($u_data['id'], 1, $_POST['password'], $_POST['alias'], $_POST['title'], base64_encode($_POST['text']), '');
                    }
                    $data = array('code' => 0, 'message' => 'Successfully add pastebin.');
                    $json = json_encode($data);
                    exit($json);
                }
            }
        } else {
            if (!isset($_POST['alias']) || empty($_POST['alias'])) {
                if (isset($_POST['metadata']) && $_POST['metadata'] != "") {
                    add_pastebin($u_data['id'], 0, '', NULL, $_POST['title'], base64_encode($_POST['text']), $_POST['metadata']);
                } else {
                    add_pastebin($u_data['id'], 0, '', NULL, $_POST['title'], base64_encode($_POST['text']), '');
                }
                $data = array('code' => 0, 'message' => 'Successfully add pastebin.');
                $json = json_encode($data);
                exit($json);
            } else {
                if (pastebin_info_alias($_POST['alias']) || is_numeric($_POST['alias'])) {
                    $data = array('code' => 426, 'message' => 'This alias has been taken.');
                    $json = json_encode($data);
                    exit($json);
                } else {
                    if (isset($_POST['metadata']) && $_POST['metadata'] != "") {
                        add_pastebin($u_data['id'], 0, '', $_POST['alias'], $_POST['title'], base64_encode($_POST['text']), $_POST['metadata']);
                    } else {
                        add_pastebin($u_data['id'], 0, '', $_POST['alias'], $_POST['title'], base64_encode($_POST['text']), '');
                    }
                    $data = array('code' => 0, 'message' => 'Successfully add pastebin.');
                    $json = json_encode($data);
                    exit($json);
                }
            }
        }
        break;
    case "update": // Update a paste
        if (!isset($_POST['token']) || !isset($_POST['id']) || !isset($_POST['title']) || !isset($_POST['text']) || !isset($_POST['encryption']) || empty($_POST['token']) || empty($_POST['id']) || $_POST['title'] == "" || $_POST['text'] == "") {
            $data = array('code' => 400, 'message' => 'Missing value(s)');
            $json = json_encode($data);
            exit($json);
        } else if (!confirm_login($_POST['token'])) {
            $data = array('code' => 415, 'message' => 'Do not logged in.');
            $json = json_encode($data);
            exit($json);
        } else if (strlen($_POST['title']) > 100) {
            $data = array('code' => 420, 'message' => 'Title too long.');
            $json = json_encode($data);
            exit($json);
        } else if (strlen($_POST['text']) > 1048576 * 8) {
            $data = array('code' => 421, 'message' => 'Text too long.');
            $json = json_encode($data);
            exit($json);
        } else if (isset($_POST['password']) && strlen($_POST['password']) > 32) {
            $data = array('code' => 422, 'message' => 'Password too long.');
            $json = json_encode($data);
            exit($json);
        } else if (isset($_POST['alias']) && strlen($_POST['alias']) > 20) {
            $data = array('code' => 423, 'message' => 'Alias too long.');
            $json = json_encode($data);
            exit($json);
        } else if ($_POST['encryption'] == 1 && (!isset($_POST['password']) || empty($_POST['password'])) && empty(pastebin_info_id($_POST['id'])['password'])) {
            $data = array('code' => 424, 'message' => 'Unsupport empty password.');
            $json = json_encode($data);
            exit($json);
        }
        $u_data = user_info($_POST['token']);
        if ($u_data['level'] == -1) {
            $data = array('code' => 425, 'message' => 'Please confirm your email first.');
            $json = json_encode($data);
            exit($json);
        }
        $p_data = pastebin_info_id($_POST['id']);
        if ($p_data['uid'] != $u_data['id']) {
            $data = array('code' => 426, 'message' => 'This pastebin isn\'t yours.');
            $json = json_encode($data);
            exit($json);
        }
        if ($_POST['encryption'] == 1) {
            if (!isset($_POST['alias']) || empty($_POST['alias'])) {
                update_pastebin($_POST['id'], 'title', $_POST['title']);
                update_pastebin($_POST['id'], 'text', base64_encode($_POST['text']));
                update_pastebin($_POST['id'], 'encryption', 1);
                if (isset($_POST['password']) && $_POST['password'] != "") {
                    update_pastebin($_POST['id'], 'password', $_POST['password']);
                }
                if (isset($_POST['metadata']) && $_POST['metadata'] != "") {
                    update_pastebin($_POST['id'], 'metadata', $_POST['metadata']);
                }
                $data = array('code' => 0, 'message' => 'Successfully updated pastebin.');
                $json = json_encode($data);
                exit($json);
            } else {
                if ((pastebin_info_alias($_POST['alias']) && $p_data['alias'] != $_POST['alias']) || is_numeric($_POST['alias'])) {
                    $data = array('code' => 426, 'message' => 'This alias has been taken.');
                    $json = json_encode($data);
                    exit($json);
                } else {
                    update_pastebin($_POST['id'], 'title', $_POST['title']);
                    update_pastebin($_POST['id'], 'text', base64_encode($_POST['text']));
                    update_pastebin($_POST['id'], 'encryption', 1);
                    if (isset($_POST['password']) && $_POST['password'] != "") {
                        update_pastebin($_POST['id'], 'password', $_POST['password']);
                    }
                    if (isset($_POST['metadata']) && $_POST['metadata'] != "") {
                        update_pastebin($_POST['id'], 'metadata', $_POST['metadata']);
                    }
                    update_pastebin($_POST['id'], 'alias', $_POST['alias']);
                    $data = array('code' => 0, 'message' => 'Successfully updated pastebin.');
                    $json = json_encode($data);
                    exit($json);
                }
            }
        } else {
            if (!isset($_POST['alias']) || empty($_POST['alias'])) {
                update_pastebin($_POST['id'], 'title', $_POST['title']);
                update_pastebin($_POST['id'], 'text', base64_encode($_POST['text']));
                update_pastebin($_POST['id'], 'encryption', 0);
                update_pastebin($_POST['id'], 'password', '');
                if (isset($_POST['metadata']) && $_POST['metadata'] != "") {
                    update_pastebin($_POST['id'], 'metadata', $_POST['metadata']);
                }
                $data = array('code' => 0, 'message' => 'Successfully updated pastebin.');
                $json = json_encode($data);
                exit($json);
            } else {
                if ((pastebin_info_alias($_POST['alias']) && $p_data['alias'] != $_POST['alias']) || is_numeric($_POST['alias'])) {
                    $data = array('code' => 426, 'message' => 'This alias has been taken.');
                    $json = json_encode($data);
                    exit($json);
                } else {
                    update_pastebin($_POST['id'], 'title', $_POST['title']);
                    update_pastebin($_POST['id'], 'text', base64_encode($_POST['text']));
                    update_pastebin($_POST['id'], 'encryption', 0);
                    update_pastebin($_POST['id'], 'password', '');
                    if (isset($_POST['metadata']) && $_POST['metadata'] != "") {
                        update_pastebin($_POST['id'], 'metadata', $_POST['metadata']);
                    }
                    update_pastebin($_POST['id'], 'alias', $_POST['alias']);
                    $data = array('code' => 0, 'message' => 'Successfully updated pastebin.');
                    $json = json_encode($data);
                    exit($json);
                }
            }
        }
        break;
    case "list": // List all pastes of current user
        if (!isset($_POST['token']) || empty($_POST['token'])) {
            $data = array('code' => 400, 'message' => 'Missing value(s).');
            $json = json_encode($data);
            exit($json);
        } else if (!confirm_login($_POST['token'])) {
            $data = array('code' => 415, 'message' => 'Do not logged in.');
            $json = json_encode($data);
            exit($json);
        }
        $u_data = user_info($_POST['token']);
        $result = search_user_pastebin($u_data['id']);
        $list = array();
        if (isset($_POST['action']) && $_POST['action'] == "backup") {
            for ($i = 0; $i < count($result); $i++) {
                $list[$i] = array("id" => $result[$i]['id'], "title" => $result[$i]['title'], "encryption" => $result[$i]['encryption'], "password" => $result[$i]['password'], "alias" => $result[$i]['alias'], "text" => base64_decode($result[$i]['text']), "metadata" => $result[$i]['metadata']);
            }
        } else {
            for ($i = 0; $i < count($result); $i++) {
                $list[$i] = array("id" => $result[$i]['id'], "title" => $result[$i]['title'], "encryption" => $result[$i]['encryption'], "alias" => $result[$i]['alias']);
            }
        }
        $data = array('code' => 0, 'data' => $list);
        $json = json_encode($data);
        exit($json);
        break;
    case "delete": // Delete a paste
        if (!isset($_POST['token']) || !isset($_POST['id'])  || empty($_POST['token']) || empty($_POST['id'])) {
            $data = array('code' => 400, 'message' => 'Missing value(s).');
            $json = json_encode($data);
            exit($json);
        } else if (!confirm_login($_POST['token'])) {
            $data = array('code' => 415, 'message' => 'Do not logged in.');
            $json = json_encode($data);
            exit($json);
        }
        $u_data = user_info($_POST['token']);
        if ($u_data['level'] == -1) {
            $data = array('code' => 425, 'message' => 'Please confirm your email first.');
            $json = json_encode($data);
            exit($json);
        }
        $p_data = pastebin_info_id($_POST['id']);
        if ($p_data) {
            if ($p_data['uid'] != $u_data['id']) {
                $data = array('code' => 426, 'message' => 'This pastebin isn\'t yours.');
                $json = json_encode($data);
                exit($json);
            } else {
                delete_pastebin($_POST['id']);
                $data = array('code' => 0, 'message' => 'Deleted successfully.');
                $json = json_encode($data);
                exit($json);
            }
        } else {
            $data = array('code' => 427, 'message' => 'This pastebin isn\'t exists.');
            $json = json_encode($data);
            exit($json);
        }
        break;
    case "info": // Fetch content of a paste
        if ((!isset($_POST['id']) || empty($_POST['id'])) && (!isset($_POST['alias']) || empty($_POST['alias']))) {
            $data = array('code' => 400, 'message' => 'Missing value(s).');
            $json = json_encode($data);
            exit($json);
        } else {
            if (!empty($_POST['id'])) {
                $p_data = pastebin_info_id($_POST['id']);
            } else if (!empty($_POST['alias'])) {
                $p_data = pastebin_info_alias($_POST['alias']);
            }
            if ($p_data) {
                if (isset($_POST['token']) && !empty($_POST['token'])) {
                    $u_data = user_info($_POST['token']);
                }
                if ($p_data['encryption'] == 0 || (isset($u_data) && !empty($u_data) && $u_data['id'] == $p_data['uid'])) {
                    $data = array('code' => 0, 'id' => $p_data['id'], 'alias' => $p_data['alias'], 'encryption' => $p_data['encryption'], 'title' => $p_data['title'], 'text' => base64_decode($p_data['text']), 'metadata' => $p_data['metadata']);
                    $json = json_encode($data);
                    exit($json);
                } else if (!isset($_POST['password']) || empty($_POST['password'])) {
                    $data = array('code' => 428, 'message' => 'Empty password.');
                    $json = json_encode($data);
                    exit($json);
                } else if ($_POST['password'] != $p_data['password']) {
                    $data = array('code' => 429, 'message' => 'Wrong password.');
                    $json = json_encode($data);
                    exit($json);
                } else {
                    $data = array('code' => 0, 'id' => $p_data['id'], 'alias' => $p_data['alias'], 'encryption' => $p_data['encryption'], 'title' => $p_data['title'], 'text' => base64_decode($p_data['text']), 'metadata' => $p_data['metadata']);
                    $json = json_encode($data);
                    exit($json);
                }
            } else {
                $data = array('code' => 427, 'message' => 'This pastebin isn\'t exists.');
                $json = json_encode($data);
                exit($json);
            }
        }
        break;
    case "import":
        if (!isset($_POST['token']) || empty($_POST['token']) || !isset($_POST['json']) || empty($_POST['json'])) {
            $data = array('code' => 400, 'message' => 'Missing value(s).');
            $json = json_encode($data);
            exit($json);
        } else if (!confirm_login($_POST['token'])) {
            $data = array('code' => 415, 'message' => 'Do not logged in.');
            $json = json_encode($data);
            exit($json);
        }
        $u_data = user_info($_POST['token']);
        if ($u_data['level'] == -1) {
            $data = array('code' => 425, 'message' => 'Please confirm your email first.');
            $json = json_encode($data);
            exit($json);
        }
        $json = $_POST['json'];
        $data = json_decode($json, true);
        $data = $data['data'];
        $list = array();
        for ($i = 0; $i < count($data); $i++) {
            if (!isset($data[$i]['title']) || !isset($data[$i]['text']) || !isset($data[$i]['encryption']) || $data[$i]['title'] == "" || $data[$i]['text'] == "") {
                $list[$i] = array('code' => 400, 'message' => 'Missing value(s).');
            } else if (strlen($data[$i]['title']) > 100) {
                $list[$i] = array('code' => 420, 'message' => 'Title too long.');
            } else if (strlen($data[$i]['text']) > 1048576 * 8) {
                $list[$i] = array('code' => 421, 'message' => 'Text too long.');
            } else if (isset($data[$i]['password']) && strlen($data[$i]['password']) > 32) {
                $list[$i] = array('code' => 422, 'message' => 'Password too long.');
            } else if (isset($data[$i]['alias']) && strlen($data[$i]['alias']) > 20) {
                $list[$i] = array('code' => 423, 'message' => 'Alias too long.');
            } else if ($data[$i]['encryption'] == 1 && (!isset($data[$i]['password']) || empty($data[$i]['password']))) {
                $list[$i] = array('code' => 424, 'message' => 'Unsupport empty password.');
            } else {
                if ($data[$i]['encryption'] == 1) {
                    if (!isset($data[$i]['alias']) || empty($data[$i]['alias'])) {
                        if (isset($data[$i]['metadata']) || $data[$i]['metadata'] != "") {
                            add_pastebin($u_data['id'], 1, $data[$i]['password'], NULL, $data[$i]['title'], base64_encode($data[$i]['text']), $data[$i]['metadata']);
                        } else {
                            add_pastebin($u_data['id'], 1, $data[$i]['password'], NULL, $data[$i]['title'], base64_encode($data[$i]['text']), '');
                        }
                        $list[$i] = array('code' => 0, 'message' => 'Successfully add pastebin.');
                    } else {
                        if (pastebin_info_alias($data[$i]['alias']) || is_numeric($data[$i]['alias'])) {
                            $list[$i] = array('code' => 426, 'message' => 'This alias has been taken.');
                        } else {
                            if (isset($data[$i]['metadata']) || $data[$i]['metadata'] != "") {
                                add_pastebin($u_data['id'], 1, $data[$i]['password'], $data[$i]['alias'], $data[$i]['title'], base64_encode($data[$i]['text']), $data[$i]['metadata']);
                            } else {
                                add_pastebin($u_data['id'], 1, $data[$i]['password'], $data[$i]['alias'], $data[$i]['title'], base64_encode($data[$i]['text']), '');
                            }
                            $list[$i] = array('code' => 0, 'message' => 'Successfully add pastebin.');
                        }
                    }
                } else {
                    if (!isset($data[$i]['alias']) || empty($data[$i]['alias'])) {
                        if (isset($data[$i]['metadata']) || $data[$i]['metadata'] != "") {
                            add_pastebin($u_data['id'], 0, '', NULL, $data[$i]['title'], base64_encode($data[$i]['text']), $data[$i]['metadata']);
                        } else {
                            add_pastebin($u_data['id'], 0, '', NULL, $data[$i]['title'], base64_encode($data[$i]['text']), '');
                        }
                        $list[$i] = array('code' => 0, 'message' => 'Successfully add pastebin.');
                    } else {
                        if (pastebin_info_alias($data[$i]['alias']) || is_numeric($data[$i]['alias'])) {
                            $list[$i] = array('code' => 426, 'message' => 'This alias has been taken.');
                        } else {
                            if (isset($data[$i]['metadata']) || $data[$i]['metadata'] != "") {
                                add_pastebin($u_data['id'], 0, '', $data[$i]['alias'], $data[$i]['title'], base64_encode($data[$i]['text']), $data[$i]['metadata']);
                            } else {
                                add_pastebin($u_data['id'], 0, '', $data[$i]['alias'], $data[$i]['title'], base64_encode($data[$i]['text']), '');
                            }
                            $list[$i] = array('code' => 0, 'message' => 'Successfully add pastebin.');
                        }
                    }
                }
            }
        }
        $data = array('code' => 0, 'data' => $list);
        $json = json_encode($data);
        exit($json);
        break;
    default:
        $data = array('code' => 400, 'message' => 'Wrong value of type.');
        $json = json_encode($data);
        exit($json);
        break;
}
