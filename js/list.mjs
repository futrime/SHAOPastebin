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


if (localStorage.getItem('token') === null) { // if not logged in, go to login page
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

postData('pastebin.php', {
    token: localStorage.getItem('token'),
    type: 'list'
})
    .then(resData => {
        resData.data.forEach(element => {
            const card = document.querySelector('.shao-paste-card-template').cloneNode(true);
            card.querySelector('a').setAttribute('href', `./view.html?${element[0]}`);
            if (element[4] === '') { // if not set alias
                card.querySelector('.shao-paste-id').textContent = `#${element[0]}`;
            } else {
                card.querySelector('.shao-paste-id').textContent = `#${element[0]} (@${element[4]})`;
            }
            card.querySelector('.shao-paste-title').textContent = element[1];
            card.classList.remove('shao-paste-card-template');
            card.classList.add('shao-paste-card');
            if (element[2] === '1') {
                card.querySelector('.shao-paste-info .bi-key').removeAttribute('hidden');
            }
            card.removeAttribute('hidden');
            document.querySelector('main').append(card);
        });
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