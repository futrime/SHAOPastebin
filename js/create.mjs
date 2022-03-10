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
 * Perform create operation
 * 
 * @param {String} title Paste title
 * @param {String} alias Paste alias
 * @param {Number} encryption Paste encryption
 * @param {String} password Paste password
 * @param {String} content Paste content
 * @returns {Object} The response object from server
 */
async function performCreate(title, alias, encryption, password, content) {
    let resData = {};
    if (alias !== '') {
        resData = await postData('pastebin.php', {
            token: localStorage.getItem('token'),
            title: title,
            alias: alias,
            encryption: encryption,
            password: password,
            text: content,
            type: 'add'
        });
    } else {
        resData = await postData('pastebin.php', {
            token: localStorage.getItem('token'),
            title: title,
            encryption: encryption,
            password: password,
            text: content,
            type: 'add'
        });
    }
    return resData;
}


if (location.search !== '') {
    location.assign('./view.html' + location.search);
}

if (localStorage.getItem('token') === null) {
    location.assign('./');
}

postData('user.php', {
    token: localStorage.getItem('token'),
    type: 'info'
})
    .then(resData => {
        if (resData.code !== 0) { // if token is invalid, go to login page
            localStorage.removeItem('token');
            location.assign('./');
        }
    });


document.querySelector('.shao-logout-button').addEventListener('click', async () => {
    const resData = await postData('user.php', {
        token: localStorage.getItem('token'),
        type: 'logout'
    })
    if (resData.code === 0) {
        localStorage.removeItem('token');
        location.assign('./');
    }
});

document.querySelector('.shao-create-paste-button').addEventListener('click', async (event) => {
    event.preventDefault();
    document.querySelector('.shao-paste-title').classList.remove('is-invalid');
    document.querySelector('.shao-paste-textarea').classList.remove('is-invalid');
    document.querySelector('.shao-create-paste-hint').setAttribute('hidden', '');
    const title = document.querySelector('.shao-paste-title').value;
    const alias = document.querySelector('.shao-paste-alias').value;
    const content = document.querySelector('.shao-paste-textarea').value;
    let password = document.querySelector('.shao-paste-password').value;
    let encryption = 0;
    if (password !== '') {
        password = md5(password);
        encryption = 1;
    }
    let is_valid = true;
    if (title === '') {
        document.querySelector('.shao-paste-title').classList.add('is-invalid');
        is_valid = false;
    }
    if (content === '') {
        document.querySelector('.shao-paste-textarea').classList.add('is-invalid');
        is_valid = false;
    }
    if (is_valid) {
        const resData = await performCreate(
            title, alias, encryption, password, content
        );
        if (resData.code === 0) {
            location.assign('./list.html');
        } else {
            document.querySelector('.shao-create-paste-hint').textContent = resData.message;
            document.querySelector('.shao-create-paste-hint').removeAttribute('hidden');
        }
    }
});