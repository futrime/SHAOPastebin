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

import { postData } from './include.mjs'


/**
 * Perform login operation
 * 
 * @param {String} username The username
 * @param {String} password The password
 * @returns {Object} The response object including code and message
 */
 async function performLogin(username, password) {
    const resData = await postData('user.php', {
        username: username,
        password: password,
        type: 'login'
    });
    if (resData.code === 0) {
        localStorage.setItem('token', resData.token);
    }
    return resData;
}


if (location.search !== '') {
    location.assign('./view.html' + location.search);
} else if (localStorage.getItem('token') !== null) { // if logged in
    location.assign('./create.html');
}

document.querySelector('.shao-login-button').addEventListener('click', async (event) => {
    event.preventDefault();
    const resData = await performLogin(
        document.querySelector('.shao-login-form #floatingInput').value,
        md5(document.querySelector('.shao-login-form #floatingPassword').value)
    );
    if (resData.code === 0) {
        location.assign('./create.html');
    } else {
        document.querySelector('.shao-login-failed-hint').removeAttribute('hidden');
    }
});

document.querySelector('.shao-login-form #floatingInput').addEventListener('focus', async (event) => {
    document.querySelector('.shao-login-failed-hint').setAttribute('hidden', '');
});

document.querySelector('.shao-login-form #floatingPassword').addEventListener('focus', async (event) => {
    document.querySelector('.shao-login-failed-hint').setAttribute('hidden', '');
});