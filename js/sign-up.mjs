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