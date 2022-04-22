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
            card.querySelector('a').setAttribute('href', `./view.html?${element['id']}`);
            if (element['alias'] === null) { // if not set alias
                card.querySelector('.shao-paste-id').textContent = `#${element['id']}`;
            } else {
                card.querySelector('.shao-paste-id').textContent = `#${element['id']} (@${element['alias']})`;
            }
            card.querySelector('.shao-paste-title').textContent = element['title'];
            card.classList.remove('shao-paste-card-template');
            card.classList.add('shao-paste-card');
            if (element['encryption'] === '1') {
                card.querySelector('.shao-paste-info .bi-key').removeAttribute('hidden');
            }
            card.removeAttribute('hidden');
            document.querySelector('main').append(card);
        });
    });

document.querySelector('.shao-export-button').addEventListener('click', async () => {
    const resData = await postData('pastebin.php', {
        token: localStorage.getItem('token'),
        type: 'list',
        action: 'backup'
    });
    if (resData.code === 0) {
        const exportString = JSON.stringify(resData);
        const nowTimeString = (new Date()).toJSON().replaceAll(':', '-').replaceAll('.', '-');
        const exportFile = new File([exportString], `shao-pastebin-export-${nowTimeString}.json`, {
            type: 'application/json'
        });
        const blobURL = URL.createObjectURL(exportFile);
        const aElement = document.createElement('a');
        aElement.href = blobURL;
        aElement.download = `shao-pastebin-export-${nowTimeString}.json`;
        aElement.click();
        URL.revokeObjectURL(blobURL);
    }
});

document.querySelector('.shao-import-button').addEventListener('click', async () => {
    window.modal = new bootstrap.Modal(
        document.querySelector('.shao-modal'),
        {
            backdrop: 'static',
            keyboard: false
        }
    );
    modal.show();
});

document.querySelector('.shao-modal-import').addEventListener('click', async () => {
    document.querySelector('.shao-modal-hint').setAttribute('hidden', '');
    const importFile = document.querySelector('.shao-modal-file').files[0];
    if (importFile === undefined) {
        return;
    }
    const importJSONString = await importFile.text();
    let resObj = await postData('pastebin.php', {
        token: localStorage.getItem('token'),
        type: 'import',
        json: importJSONString
    });
    let successCount = 0;
    let failureCount = 0;
    for (const item of resObj.data) {
        if (item.code !== 0) {
            failureCount++;
        } else {
            successCount++;
        }
    }
    document.querySelector('.shao-modal-hint').textContent = `导入成功${successCount}条，失败${failureCount}条，刷新后生效。`;
    document.querySelector('.shao-modal-hint').removeAttribute('hidden');
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