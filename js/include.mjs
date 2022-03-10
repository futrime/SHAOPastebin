const config = await (async () => {
    const res = await fetch('config.json');
    const obj = await res.json();
    let config = {
        backendURL: obj.backendURL
    };
    if (config.backendURL.substr(config.backendURL.length - 1) !== '/') {
        config.backendURL += '/';
    }
    return config;
})();

/**
 * Check if an email address is valid
 * 
 * @param {String} email The email address
 * @returns True if valid otherwise false
 */
function isValidEmail(email) {
    const re = /^\S+@([-a-z0-9]+\.)+[-a-z0-9]+$/;
    return re.test(email);
}

/**
 * Get a GET query variable
 * 
 * @param {String} variable The query variable
 * @returns {String?} The value of the query variable, null if not exist
 */
function getQueryVariable(variable) {
    const vars = location.search.substring(1).split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    vars.forEach(element => {
        const pair = element.split('=');
        if (decodeURIComponent(pair[0]) === variable && pair.length === 2) {
            return decodeURIComponent(pair[1]);
        }
    });
    return null;
}

/**
 * Go to a path if no forward query is specified, otherwise the specified path
 * 
 * @param {String} defaultPath 
 */
function goForward(defaultPath) {
    if (getQueryVariable('forward') === null) {
        location.assign(defaultPath);
    } else {
        location.assign(getQueryVariable('forward'));
    }
}

/**
 * Post an object to path of the backend and return the return value as an object.
 * 
 * @param {String} path The path of the backend to post.
 * @param {Object} obj The object to post.
 * @returns {Object} The return value of the response.
 */
async function postData(path, obj) {
    let data = new FormData();
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            let element = obj[key];
            if (element === null) {
                element = '';
            }
            data.append(key, element);
        }
    }
    const res = await fetch(config.backendURL + path, {
        method: 'POST',
        cache: 'no-cache',
        body: data
    });
    const resData = await res.json();
    return resData;
}


export { getQueryVariable, goForward, isValidEmail, postData };
