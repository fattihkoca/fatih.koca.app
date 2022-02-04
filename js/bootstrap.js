let xhr = function (fn) {
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status >= 200) {
                let response = JSON.parse(this.response);
                return fn(response);
            }
        };

        xhr.open("GET", url, true);
        xhr.withCredentials = true;
        xhr.send();
    },
    id = function (s) {
        return document.getElementById(s);
    },
    all = function (s) {
        return document.querySelectorAll(s);
    },
    createEl = function (tagName) {
        return document.createElement(tagName)
    },
    createText = function (text) {
        return document.createTextNode(text);
    };