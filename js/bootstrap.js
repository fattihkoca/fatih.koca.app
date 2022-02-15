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
    },
    mmd = function (src) {
        let h = '';

        function escape(t) {
            return new Option(t).innerHTML;
        }

        function inlineEscape(s) {
            return escape(s)
                .replace(/!\[([^\]]*)]\(([^(]+)\)/g, '<img alt="$1" src="$2">')
                .replace(/\[([^\]]+)]\(([^(]+?)\)/g, '<a href="$2" target="_blank" rel="nofollow">$1</a>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g, '<strong>$2</strong>')
                .replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g, '<em>$2</em>');
        }

        src
            .replace(/^\s+|\r|\s+$/g, '')
            .replace(/\t/g, '    ')
            .split(/\n\n+/)
            .forEach(function (b, f, R) {
                f = b[0];
                R =
                    {
                        '*': [/\n\* /, '<ul><li>', '</li></ul>'],
                        '1': [/\n[1-9]\d*\.? /, '<ol><li>', '</li></ol>'],
                        ' ': [/\n    /, '<pre><code>', '</code></pre>', '\n'],
                        '>': [/\n> /, '<blockquote>', '</blockquote>', '\n']
                    }[f];
                h +=
                    R ? R[1] + ('\n' + b)
                        .split(R[0])
                        .slice(1)
                        .map(R[3] ? escape : inlineEscape)
                        .join(R[3] || '</li>\n<li>') + R[2] :
                        f === '#' ? '<h' + (f = b.indexOf(' ')) + '>' + inlineEscape(b.slice(f + 1)) + '</h' + f + '>' :
                            f === '<' ? b :
                                '<p>' + inlineEscape(b) + '</p>';
            });

        return h;
    };