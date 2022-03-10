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

function triggerGuestMode() {
    document.querySelector('.shao-create-button').setAttribute('hidden', '');
    document.querySelector('.shao-list-button').setAttribute('hidden', '');
    document.querySelector('.shao-settings-button').setAttribute('hidden', '');
    document.querySelector('.shao-logout-button').setAttribute('hidden', '');
    document.querySelector('.shao-login-button').removeAttribute('hidden');
    document.querySelector('.shao-sign-up-button').removeAttribute('hidden');
}


let resData = {};
window.modal = new bootstrap.Modal(
    document.querySelector('.shao-modal'),
    {
        backdrop: 'static',
        keyboard: false
    }
);

if (location.search === '') {
    location.assign('./create.html');
}

if (localStorage.getItem('token') === null) {
    triggerGuestMode();
}

await postData('user.php', {
    token: localStorage.getItem('token'),
    type: 'info'
})
    .then(resData => {
        if (resData.code !== 0) { // if token is invalid, turn to guest mode
            localStorage.removeItem('token');
            triggerGuestMode();
        }
    });

if (localStorage.getItem('token') !== null) {
    postData('pastebin.php', {
        token: localStorage.getItem('token'),
        type: 'list'
    }).then(resData => {
        resData.data.forEach(element => {
            if (
                element[0] === location.search.substring(1) ||
                (element[4] === location.search.substring(2) && location.search[1] === '@')
            ) { // if this paste is created by current user
                document.querySelector('.shao-edit-paste-button').removeAttribute('hidden');
                document.querySelector('.shao-delete-paste-button').setAttribute('data-shao-pid', element[0]);
                return;
            }
        });
    });
}

if (location.search[1] === '@') {
    resData = await postData('pastebin.php', {
        token: localStorage.getItem('token'),
        alias: location.search.substring(2),
        type: 'info'
    });
    document.querySelector('.shao-paste-id').textContent = `Paste @${location.search.substring(2)}`;
    document.querySelector('title').textContent = `Paste @${location.search.substring(2)} - SHAO Pastebin`;
} else {
    resData = await postData('pastebin.php', {
        token: localStorage.getItem('token'),
        id: location.search.substring(1),
        type: 'info'
    });
    document.querySelector('.shao-paste-id').textContent = `Paste #${location.search.substring(1)}`;
    document.querySelector('title').textContent = `Paste #${location.search.substring(1)} - SHAO Pastebin`;
}

if (resData.code === 428) {
    window.modal.show();
} else if (resData.code !== 0) { // if failed to fetch the paste
    location.assign('./');
} else {
    document.querySelector('.shao-paste-title').value = resData.title;
    document.querySelector('.shao-paste-alias').value = resData.alias;
    document.querySelector('.shao-paste-display').innerHTML = marked.parse(`# ${resData.title}\n` + DOMPurify.sanitize(resData.text));
    document.querySelector('.shao-paste-textarea').value = resData.text;
    if (resData.alias === '') {
        document.querySelector('.shao-copy-alias-link-button').setAttribute('hidden', '');
    }
}

window.resData = resData; // to use in event listeners

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

document.querySelector('.shao-copy-id-link-button').addEventListener('click', async () => {
    document.querySelector('.shao-edit-paste-hint').setAttribute('hidden', '');
    navigator.clipboard.writeText(location.href.substring(0, location.href.indexOf('/view.html') + 1) + '?' + resData.id).then(
        () => { // if succeeded
            document.querySelector('.shao-edit-paste-hint').innerHTML = '<span class="text-success">Copy successfully!</span>';
            document.querySelector('.shao-edit-paste-hint').removeAttribute('hidden');
        },
        () => { // if failed
            document.querySelector('.shao-edit-paste-hint').innerHTML = `Failed to write your clipboard!`;
            document.querySelector('.shao-edit-paste-hint').removeAttribute('hidden');
        }
    )
});

document.querySelector('.shao-copy-alias-link-button').addEventListener('click', async () => {
    document.querySelector('.shao-edit-paste-hint').setAttribute('hidden', '');
    navigator.clipboard.writeText(location.href.substring(0, location.href.indexOf('/view.html') + 1) + '?@' + resData.alias).then(
        () => { // if succeeded
            document.querySelector('.shao-edit-paste-hint').innerHTML = '<span class="text-success">Copy successfully!</span>';
            document.querySelector('.shao-edit-paste-hint').removeAttribute('hidden');
        },
        () => { // if failed
            document.querySelector('.shao-edit-paste-hint').innerHTML = `Failed to write your clipboard!`;
            document.querySelector('.shao-edit-paste-hint').removeAttribute('hidden');
        }
    )
});

document.querySelector('.shao-edit-paste-button').addEventListener('click', () => {
    document.querySelector('.shao-edit-paste-hint').setAttribute('hidden', '');
    document.querySelector('.shao-paste-title').removeAttribute('readonly');
    document.querySelector('.shao-paste-title').parentElement.removeAttribute('hidden');
    document.querySelector('.shao-paste-alias').parentElement.removeAttribute('hidden');
    document.querySelector('.shao-paste-password').parentElement.removeAttribute('hidden');
    document.querySelector('.shao-paste-textarea').removeAttribute('readonly');
    document.querySelector('.shao-paste-textarea').removeAttribute('hidden');
    document.querySelector('.shao-paste-display').setAttribute('hidden', '');
    document.querySelector('.shao-copy-id-link-button').setAttribute('hidden', '');
    document.querySelector('.shao-copy-alias-link-button').setAttribute('hidden', '');
    document.querySelector('.shao-edit-paste-button').setAttribute('hidden', '');
    document.querySelector('.shao-submit-paste-button').removeAttribute('hidden');
    document.querySelector('.shao-delete-paste-button').removeAttribute('hidden');
});

document.querySelector('.shao-paste-keep-password').addEventListener('click', () => {
    if (document.querySelector('.shao-paste-keep-password').checked) {
        document.querySelector('.shao-paste-password').setAttribute('disabled', '');
    } else {
        document.querySelector('.shao-paste-password').removeAttribute('disabled');
    }
});

document.querySelector('.shao-submit-paste-button').addEventListener('click', async () => {
    document.querySelector('.shao-edit-paste-hint').setAttribute('hidden', '');

    const title = document.querySelector('.shao-paste-title').value;
    const alias = document.querySelector('.shao-paste-alias').value;
    let encryption = 0;
    let password = document.querySelector('.shao-paste-password').value;
    let is_keep = document.querySelector('.shao-paste-keep-password').checked;
    if (is_keep) {
        encryption = Number(window.resData.encryption);
        password = '';
    } else if (password !== '') {
        encryption = 1;
        password = md5(password);
    }
    const content = document.querySelector('.shao-paste-textarea').value;
    let resData = {};
    if (alias === '') {
        resData = await postData('pastebin.php', {
            token: localStorage.getItem('token'),
            id: document.querySelector('.shao-delete-paste-button').getAttribute('data-shao-pid'),
            title: title,
            text: content,
            encryption: encryption,
            password: password,
            type: 'update'
        });
    } else {
        resData = await postData('pastebin.php', {
            token: localStorage.getItem('token'),
            id: document.querySelector('.shao-delete-paste-button').getAttribute('data-shao-pid'),
            title: title,
            text: content,
            encryption: encryption,
            password: password,
            alias: alias,
            type: 'update'
        });
    }
    if (resData.code === 0) {
        location.reload();
    } else {
        document.querySelector('.shao-edit-paste-hint').textContent = resData.message;
        document.querySelector('.shao-edit-paste-hint').removeAttribute('hidden');
    }
});

document.querySelector('.shao-delete-paste-button').addEventListener('click', async () => {
    document.querySelector('.shao-edit-paste-hint').setAttribute('hidden', '');
    const resData = await postData('pastebin.php', {
        token: localStorage.getItem('token'),
        id: document.querySelector('.shao-delete-paste-button').getAttribute('data-shao-pid'),
        type: 'delete'
    });
    if (resData.code === 0) {
        location.assign('./list.html');
    } else {
        document.querySelector('.shao-edit-paste-hint').textContent = resData.message;
        document.querySelector('.shao-edit-paste-hint').removeAttribute('hidden');
    }
});

document.querySelector('.shao-modal-continue').addEventListener('click', async () => {
    document.querySelector('.shao-modal-hint').setAttribute('hidden', '');
    const password = document.querySelector('.shao-modal-password').value;

    if (location.search[1] === '@') {
        window.resData = await postData('pastebin.php', {
            password: md5(password),
            alias: location.search.substring(2),
            type: 'info'
        });
    } else {
        window.resData = await postData('pastebin.php', {
            password: md5(password),
            id: location.search.substring(1),
            type: 'info'
        });
    }

    if (window.resData.code !== 0) {
        document.querySelector('.shao-modal-hint').innerText = window.resData.message;
        document.querySelector('.shao-modal-hint').removeAttribute('hidden');
        return;
    }

    document.querySelector('.shao-paste-title').value = window.resData.title;
    document.querySelector('.shao-paste-alias').value = window.resData.alias;
    document.querySelector('.shao-paste-display').innerHTML = marked.parse(`# ${window.resData.title}\n` + DOMPurify.sanitize(window.resData.text));
    document.querySelector('.shao-paste-textarea').value = window.resData.text;
    if (resData.alias === '') {
        document.querySelector('.shao-copy-alias-link-button').setAttribute('hidden', '');
    }
    window.modal.hide();
});