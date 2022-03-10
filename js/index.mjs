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