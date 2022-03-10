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
    case "register": 
        if (!isset($_POST['username']) || !isset($_POST['email']) || !isset($_POST['password']) || empty($_POST['username']) || empty($_POST['email']) || empty($_POST['password'])) {
            $data = array('code' => 400, 'message' => 'Missing value(s).');
            $json = json_encode($data);
            exit($json);
        } else if (is_user_repeat('username', $_POST['username'])) {
            $data = array('code' => 411, 'message' => 'Duplicate username.');
            $json = json_encode($data);
            exit($json);
        } else if (is_user_repeat('mail', $_POST['email'])) {
            $data = array('code' => 412, 'message' => 'Duplicate email.');
            $json = json_encode($data);
            exit($json);
        } else {
            $token = user_register($_POST['username'], $_POST['password'], $_POST['email']);
            $data = array('code' => 0, 'message' => 'Registration success.', 'token' => $token);
            $json = json_encode($data);
            exit($json);
        }
        break;
    case "login": 
        if (!isset($_POST['username']) || !isset($_POST['password']) || empty($_POST['username']) || empty($_POST['password'])) {
            $data = array('code' => 400, 'message' => 'Missing value(s).');
            $json = json_encode($data);
            exit($json);
        } else {
            $token = user_login($_POST['username'], $_POST['password']);
            if ($token == -1) {
                $data = array('code' => 413, 'message' => 'Error username.');
                $json = json_encode($data);
                exit($json);
            } else if ($token == 0) {
                $data = array('code' => 414, 'message' => 'Error password.');
                $json = json_encode($data);
                exit($json);
            } else {
                $data = array('code' => 0, 'message' => 'Login success.', 'token' => $token);
                $json = json_encode($data);
                exit($json);
            }
        }
        break;
    case "logout": 
        if (!isset($_POST['token']) || empty($_POST['token'])) {
            $data = array('code' => 400, 'message' => 'Missing value(s).');
            $json = json_encode($data);
            exit($json);
        } else {
            if (confirm_login($_POST['token'])) {
                user_logout($_POST['token']);
                $data = array('code' => 0, 'message' => 'Logout success.');
                $json = json_encode($data);
                exit($json);
            } else {
                $data = array('code' => 415, 'message' => 'Do not logged in.');
                $json = json_encode($data);
                exit($json);
            }
        }
        break;
    case "confirm_email_sendmail": 
        if (!isset($_POST['token']) || empty($_POST['token'])) {
            $data = array('code' => 400, 'message' => 'Missing value(s).');
            $json = json_encode($data);
            exit($json);
        } else {
            if (confirm_login($_POST['token'])) {
                $user_info = user_info($_POST['token']);
                if (search_confirm_key($_POST['token'])) {
                    $old_access_key = search_confirm_key($_POST['token']);
                    $old_access_key = $old_access_key['access_key'];
                    $access_key = creat_confirm_key($_POST['token']);
                    if ($old_access_key != $access_key) { 
                        $result = sendEmail($user_info['mail'], SITE_NAME, SITE_NAME . '邮件验证', '验证码（请复制）：' . $access_key);
                    } else {
                        $result = 'This email has been sent.';
                    }
                } else {
                    $access_key = creat_confirm_key($_POST['token']);
                    $result = sendEmail($user_info['mail'], SITE_NAME, SITE_NAME . '邮件验证', '验证码（请复制）：' . $access_key);
                }
                if (!$result) {
                    $data = array('code' => 0, 'message' => 'Sent successfully.');
                    $json = json_encode($data);
                    exit($json);
                } else {
                    $data = array('code' => 400, 'message' => $result);
                    $json = json_encode($data);
                    exit($json);
                }
            } else {
                $data = array('code' => 415, 'message' => 'Do not logged in.');
                $json = json_encode($data);
                exit($json);
            }
        }
        break;
    case "confirm_email": 
        if (!isset($_POST['token']) || !isset($_POST['access_key']) || empty($_POST['token']) || empty($_POST['access_key'])) {
            $data = array('code' => 400, 'message' => 'Missing value(s).');
            $json = json_encode($data);
            exit($json);
        } else {
            if (confirm_login($_POST['token'])) {
                $data = search_confirm_key($_POST['token']);
                if ($data) {
                    if ($_POST['access_key'] == $data['access_key']) {
                        if ($data['expire_date'] >= time()) {
                            update_user_level($_POST['token'], 0);
                            delete_access_key($data['uid'], 1);
                            $data = array('code' => 0, 'message' => 'Confirm success.');
                            $json = json_encode($data);
                            exit($json);
                        } else {
                            $data = array('code' => 416, 'message' => 'Verification code has expired.');
                            $json = json_encode($data);
                            exit($json);
                        }
                    }
                } else {
                    $data = array('code' => 419, 'message' => 'Not apply.');
                    $json = json_encode($data);
                    exit($json);
                }
            } else {
                $data = array('code' => 415, 'message' => 'Do not logged in.');
                $json = json_encode($data);
                exit($json);
            }
        }
        break;
    case "info": 
        if (!isset($_POST['token']) || empty($_POST['token'])) {
            $data = array('code' => 400, 'message' => 'Missing value(s).');
            $json = json_encode($data);
            exit($json);
        } else {
            if (confirm_login($_POST['token'])) {
                $info = user_info($_POST['token']);
                $data = array('code' => 0, 'username' => $info['username'], 'email' => $info['mail'], 'level' => $info['level'], 'regist_date' => $info['regist_date']);
                $json = json_encode($data);
                exit($json);
            } else {
                $data = array('code' => 415, 'message' => 'Do not logged in.');
                $json = json_encode($data);
                exit($json);
            }
        }
        break;
    case "change_passwd": 
        if (!isset($_POST['token']) || !isset($_POST['old_password']) || !isset($_POST['new_password']) || empty($_POST['token']) || empty($_POST['old_password']) || empty($_POST['new_password'])) {
            $data = array('code' => 400, 'message' => 'Missing value(s).');
            $json = json_encode($data);
            exit($json);
        } else {
            if (confirm_login($_POST['token'])) {
                $info = user_info($_POST['token']);
                if ($_POST['old_password'] == $info['password']) {
                    update_user_password($_POST['token'], $_POST['new_password']);
                    $data = array('code' => 0, 'message' => 'Password successfully changed.');
                    $json = json_encode($data);
                    exit($json);
                } else {
                    $data = array('code' => 417, 'message' => 'Wrong old password.');
                    $json = json_encode($data);
                    exit($json);
                }
            } else {
                $data = array('code' => 415, 'message' => 'Do not logged in.');
                $json = json_encode($data);
                exit($json);
            }
        }
        break;
    case "forgot_passwd_sendmail": 
        if (!isset($_POST['email']) || empty($_POST['email'])) {
            $data = array('code' => 400, 'message' => 'Missing value(s).');
            $json = json_encode($data);
            exit($json);
        } else {
            if (is_email_exist($_POST['email'])) {
                $user_info = user_info_email($_POST['email']);
                if (search_confirm_key_email($_POST['email'])) {
                    $old_access_key = search_confirm_key_email($_POST['email']);
                    $old_access_key = $old_access_key['access_key'];
                    $access_key = creat_confirm_key_email($_POST['email']);
                    if ($old_access_key != $access_key) { 
                        $result = sendEmail($_POST['email'], SITE_NAME, SITE_NAME . '找回密码', '验证码（请复制）：' . $access_key);
                    } else {
                        $result = 'This email has been sent.';
                    }
                } else {
                    $access_key = creat_confirm_key_email($_POST['email']);
                    $result = sendEmail($_POST['email'], SITE_NAME, SITE_NAME . '找回密码', '验证码（请复制）：' . $access_key);
                }
                if (!$result) {
                    $data = array('code' => 0, 'message' => 'Sent successfully.');
                    $json = json_encode($data);
                    exit($json);
                } else {
                    $data = array('code' => 400, 'message' => $result);
                    $json = json_encode($data);
                    exit($json);
                }
            } else {
                $data = array('code' => 418, 'message' => 'Account does not exist.');
                $json = json_encode($data);
                exit($json);
            }
        }
        break;
    case "forgot_passwd": 
        if (!isset($_POST['email']) || !isset($_POST['access_key']) || !isset($_POST['new_password']) || empty($_POST['email']) || empty($_POST['access_key']) || empty($_POST['new_password'])) {
            $data = array('code' => 400, 'message' => 'Missing value(s)');
            $json = json_encode($data);
            exit($json);
        } else {
            if (is_email_exist($_POST['email'])) {
                $data = search_confirm_key_email($_POST['email']);
                if ($data) {
                    if ($_POST['access_key'] == $data['access_key']) {
                        if ($data['expire_date'] >= time()) {
                            update_user_password_email($_POST['email'], $_POST['new_password']);
                            delete_access_key($data['uid'], 2);
                            $data = array('code' => 0, 'message' => 'Update success.');
                            $json = json_encode($data);
                            exit($json);
                        } else {
                            $data = array('code' => 416, 'message' => 'Verification code has expired.');
                            $json = json_encode($data);
                            exit($json);
                        }
                    }
                } else {
                    $data = array('code' => 419, 'message' => 'Not apply.');
                    $json = json_encode($data);
                    exit($json);
                }
            } else {
                $data = array('code' => 418, 'message' => 'Account does not exist.');
                $json = json_encode($data);
                exit($json);
            }
        }
        break;
    case "change_email": 
        if (!isset($_POST['token']) || !isset($_POST['new_email']) || empty($_POST['token']) || empty($_POST['new_email'])) {
            $data = array('code' => 400, 'message' => 'Missing value(s).');
            $json = json_encode($data);
            exit($json);
        } else {
            if (confirm_login($_POST['token'])) {
                update_user_email($_POST['token'], $_POST['new_email']);
                update_user_level($_POST['token'], -1);
                $data = array('code' => 0, 'message' => 'Email successfully changed.');
                $json = json_encode($data);
                exit($json);
            } else {
                $data = array('code' => 415, 'message' => 'Do not logged in.');
                $json = json_encode($data);
                exit($json);
            }
        }
        break;
    default:
        $data = array('code' => 400, 'message' => 'Wrong value of type.');
        $json = json_encode($data);
        exit($json);
}
