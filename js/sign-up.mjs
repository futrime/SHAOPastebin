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

import { isValidEmail, postData } from './include.mjs'


/**
 * Perform sign up operation
 * 
 * @param {String} username The username
 * @param {String} email The email
 * @param {String} password The password
 * @returns {Object} The response object including code and message
 */
 async function performSignUp(username, email, password) {
    const resData = await postData('user.php', {
        username: username,
        email: email,
        password: password,
        type: 'register'
    });
    if (resData.code === 0) {
        localStorage.setItem('token', resData.token);
    }
    return resData;
}


if (localStorage.getItem('token') !== null) { // if logged in
    location.assign('./create.html');
}

document.querySelector('.shao-sign-up-button').addEventListener('click', async (event) => {
    event.preventDefault();
    document.querySelector('.shao-sign-up-failed-hint').setAttribute('hidden', '');
    document.querySelector('#floatingUsername').classList.remove('is-invalid');
    document.querySelector('#floatingEmail').classList.remove('is-invalid');
    document.querySelector('#floatingPassword').classList.remove('is-invalid');
    const username = document.querySelector('#floatingUsername').value;
    const email = document.querySelector('#floatingEmail').value;
    const password = md5(document.querySelector('#floatingPassword').value);
    let isFormValid = true;
    if (username.length < 4) {
        document.querySelector('#floatingUsername').classList.add('is-invalid');
        isFormValid = false;
    }
    if (!isValidEmail(email)) {
        document.querySelector('#floatingEmail').classList.add('is-invalid');
        isFormValid = false;
    }
    if (password.length < 8) {
        document.querySelector('#floatingPassword').classList.add('is-invalid');
        isFormValid = false;
    }
    if (isFormValid) {
        const resData = await performSignUp(username, email, password);
        if (resData.code === 0) {
            location.assign('./create.html');
        } else {
            document.querySelector('.shao-sign-up-failed-hint').textContent = resData.message;
            document.querySelector('.shao-sign-up-failed-hint').removeAttribute('hidden');
        }
    }
});