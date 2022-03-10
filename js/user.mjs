import { isValidEmail, postData } from './include.mjs'


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
        } else {
            document.querySelector('.shao-avatar-view').setAttribute(
                'src',
                `https://cravatar.cn/avatar/${md5(resData.email)}?s=256`
            );
            document.querySelector('.shao-username-view').textContent = resData.username;
            document.querySelector('.shao-email-view').textContent = resData.email;
            document.querySelector('.shao-email-view').setAttribute(
                'href',
                `mailto:${resData.email}`
            );
            if (resData.level === '-1') {
                document.querySelector('.shao-verify-email-form').classList.remove('d-none');
            }
        }
    });


document.querySelector('.shao-logout-button').addEventListener('click', async () => {
    const resData = await postData('user.php', {
        token: localStorage.getItem('token'),
        type: 'logout'
    });
    if (resData.code === 0) {
        localStorage.removeItem('token');
        location.assign('./');
    }
});

document.querySelector('.shao-send-button').addEventListener('click', async (event) => {
    event.preventDefault();
    const resData = await postData('user.php', {
        token: localStorage.getItem('token'),
        type: 'confirm_email_sendmail'
    });
    document.querySelector('.shao-send-button').setAttribute('disabled', '');
    document.querySelector('.shao-send-button').classList.remove('btn-outline-primary');
    document.querySelector('.shao-send-button').classList.add('btn-outline-secondary');
    document.querySelector('.shao-send-button').textContent = 'Sent';
});

document.querySelector('.shao-verify-email-button').addEventListener('click', async (event) => {
    event.preventDefault();
    document.querySelector('.shao-verify-email-hint').setAttribute('hidden', '');
    const resData = await postData('user.php', {
        token: localStorage.getItem('token'),
        access_key: document.querySelector('.shao-access-key').value,
        type: 'confirm_email'
    });
    if (resData.code === 0) {
        document.querySelector('.shao-verify-email-form').classList.add('d-none');
    } else {
        document.querySelector('.shao-verify-email-hint').textContent = resData.message;
        document.querySelector('.shao-verify-email-hint').removeAttribute('hidden');
    }
});

document.querySelector('.shao-change-password-button').addEventListener('click', async (event) => {
    event.preventDefault();
    document.querySelector('.shao-new-password').classList.remove('is-invalid');
    document.querySelector('.shao-change-password-hint').setAttribute('hidden', '');
    if (document.querySelector('.shao-new-password').value.length < 8) {
        document.querySelector('.shao-new-password').classList.add('is-invalid');
        return;
    }
    const resData = await postData('user.php', {
        token: localStorage.getItem('token'),
        old_password: md5(document.querySelector('.shao-old-password').value),
        new_password: md5(document.querySelector('.shao-new-password').value),
        type: 'change_passwd'
    });
    if (resData.code === 0) {
        document.querySelector('.shao-logout-button').click();
    } else {
        document.querySelector('.shao-change-password-hint').textContent = resData.message;
        document.querySelector('.shao-change-password-hint').removeAttribute('hidden');
    }
});

document.querySelector('.shao-change-email-button').addEventListener('click', async (event) => {
    event.preventDefault();
    document.querySelector('.shao-email').classList.remove('is-invalid');
    document.querySelector('.shao-change-email-hint').setAttribute('hidden', '');
    if (!isValidEmail(document.querySelector('.shao-email').value)) {
        document.querySelector('.shao-email').classList.add('is-invalid');
        return;
    }
    const resData = await postData('user.php', {
        token: localStorage.getItem('token'),
        new_email: document.querySelector('.shao-email').value,
        type: 'change_email'
    });
    if (resData.code === 0) {
        location.reload();
    } else {
        document.querySelector('.shao-change-email-hint').textContent = resData.message;
        document.querySelector('.shao-change-email-hint').removeAttribute('hidden');
    }
});