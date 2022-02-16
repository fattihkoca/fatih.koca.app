var pWeb = (function () {
    return {
        id: "pWeb",
        dataUrl: function () {
            return this.id + ".json"
        },
        data: {
            name: null,
            title: null,
            image: null,
            video: null,
            contents: {},
            social: {},
            posts: {
                title: null,
                provider: null
            },
            "google-tracking-id": null,
            "curator-id": null
        },
        loadingFx: "data-loading-fx",
        toggleVisible: "data-visible",
        head: document.getElementsByTagName("head")[0],
        theme: "light",
        rid: function (s = false) {
            return !s ? this.id : this.id + "-" + s;
        },
        init: function () {
            document.getElementById(this.rid()).setAttribute('data-pWeb-theme', this.theme);
            this.insertStyleAsset("assets/pWeb.css");
            this.insertScriptAsset("assets/pWeb-icon.js");
            this.createDOMElements(this.elements(), document.getElementById(this.rid()));
            this.startSocialLoadingFx();
            this.loadData();
            this.initEvents();
            this.detectDarkMode();
        },
        createDOMElements: function (sources, parent) {
            for (var i in sources) {
                var s = sources[i],
                    e = document.createElement(s.tag);

                for (var a in s.attr) {
                    e.setAttribute(a, s.attr[a]);
                }

                if (s.text)
                    e.innerText = s.text;

                if (s.loadingfx)
                    e.setAttribute(this.loadingFx, "");

                this.createDOMElements(s.children, e);
                parent.appendChild(e);
            }
        },
        insertStyleAsset: function (url) {
            if (!url)
                return;

            var l = document.createElement("link");
            l.rel = "stylesheet";
            l.type = "text/css";
            l.href = url;
            this.head.appendChild(l);
        },
        insertScriptAsset: function (url, async = false) {
            if (!url)
                return;

            var l = document.createElement("script");
            l.src = url;

            if (async)
                l.setAttribute("async", "");

            this.head.appendChild(l);
        },
        insertGoogleTracking: function () {
            var u = "https://www.googletagmanager.com/gtag/js?id=" + this.data["google-tracking-id"];
            this.insertScriptAsset(u, true);

            window.dataLayer = window.dataLayer || [];
            gtag("js", new Date());
            gtag("config", this.data["google-tracking-id"]);

            function gtag() {
                dataLayer.push(arguments);
            }
        },
        loadData: function () {
            var this_ = this;

            setTimeout(function () {
                this_.xhr(this_.dataUrl(), function (r) {
                    this_.data = r;
                    document.getElementById(this_.rid("img")).setAttribute("src", this_.data.image);
                    document.getElementById(this_.rid("img")).setAttribute("alt", this_.data.name);
                    document.getElementById(this_.rid("name")).innerHTML = this_.mmd(this_.data.name);
                    document.getElementById(this_.rid("title")).innerHTML = this_.mmd(this_.data.title);
                    document.getElementById(this_.rid("posts-title")).innerHTML = this_.mmd(this_.data.posts.title);
                    this_.addVideo();
                    this_.addContents();
                    this_.addSocials();
                    this_.removeLoadingFx();
                    this_.insertGoogleTracking();
                });
            }, 500);
        },
        addVideo: function () {
            if (!this.data.video) {
                return document.getElementById(this.rid("video")).remove();
            }

            var v = document.createElement("iframe"),
                attr = [
                    ["src", this.data.video],
                    ["title", this.data.name],
                    ["frameborder", "0"],
                    ["allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"],
                ];

            for (var a in attr) {
                v.setAttribute(attr[a][0], attr[a][1]);
            }

            document.getElementById(this.rid("video")).innerHTML = null;
            document.getElementById(this.rid("video")).appendChild(v);
        },
        addContents: function () {
            document.getElementById(this.rid("contents")).innerHTML = null;

            for (var k in this.data.contents) {
                var d = this.data.contents[k],
                    i = document.createElement("ul");
                i.className = this.rid("content") + " " + this.rid("content-" + k);

                for (var di in d) {
                    var si = document.createElement("li");
                    si.innerHTML = this.mmd(d[di]);
                    i.appendChild(si);
                }

                document.getElementById(this.rid("contents")).appendChild(i);
            }
        },
        addSocials: function () {
            document.getElementById(this.rid("social")).innerHTML = null;

            for (var s in this.data.social) {
                var l = document.createElement("li"),
                    a = document.createElement("a"),
                    t = [
                        ["href", this.data.social[s]],
                        ["title", this.data.name + " - " + s.charAt(0).toUpperCase() + s.slice(1)],
                        ["target", "_blank"],
                        ["rel", "noreferrer"]
                    ];

                for (var ti in t) {
                    a.setAttribute(t[ti][0], t[ti][1]);
                }

                a.innerHTML = pWebIcon.render(s);
                l.appendChild(a);

                document.getElementById(this.rid("social")).appendChild(l);
            }
        },
        detectDarkMode: function () {
            this.theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark' : 'light';

            document.getElementById(this.rid()).setAttribute("data-pWeb-theme", this.theme);
            this.setThemeHandle();
        },
        setThemeHandle: function () {
            var this_ = this;
            setTimeout(function () {
                var e = document.getElementById(this_.rid("theme-handle")),
                    i = document.createElement("i"),
                    t = this_.theme === "light" ? "dark" : "light";

                e.innerHTML = null;
                i.innerHTML = pWebIcon.render(t);
                e.appendChild(i);
            }, 100);
        },
        toggleTheme: function () {
            this.theme = this.theme === "light" ? "dark" : "light";
            document.getElementById(this.rid()).setAttribute("data-pWeb-theme", this.theme);
            this.setThemeHandle();
        },
        startSocialLoadingFx: function () {
            var li = "<li><a " + this.loadingFx + "><i></i></a></li>",
                lis = "";

            for (var i = 1; i <= 7; i++) {
                lis += li;
            }

            document.getElementById(this.rid("social")).innerHTML = lis;
        },
        removeLoadingFx: function () {
            var sel = document.querySelectorAll("[" + this.loadingFx + "]");

            for (var i in sel) {
                var el = sel[i];
                if (el instanceof HTMLElement) {
                    el.removeAttribute(this.loadingFx);
                }
            }

            document.getElementById(this.rid("intro")).setAttribute("data-loaded", "true");
        },
        toggleVisiblePosts: function (b) {
            if (b)
                this.loadCurator();

            document.getElementById(this.rid("intro")).setAttribute(this.toggleVisible, !b);
            document.getElementById(this.rid("posts")).setAttribute(this.toggleVisible, b);
        },
        initEvents() {
            var this_ = this;

            document.getElementById(this.rid("open-posts-handle")).addEventListener("click", function () {
                this_.toggleVisiblePosts(true);
            });

            document.getElementById(this.rid("close-posts-handle")).addEventListener("click", function () {
                this_.toggleVisiblePosts(false);
            });

            document.getElementById(this.rid("theme-handle")).addEventListener("click", function () {
                this_.toggleTheme();
            });

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
                this_.detectDarkMode();
            });
        },
        curatorLoaded: false,
        loadCurator: function () {
            if (this.curatorLoaded) {
                var curatorFeedField = window.document.querySelector(".crt-feed");

                if (curatorFeedField) {
                    curatorFeedField.setAttribute("style", "display:none");

                    setTimeout(function () {
                        curatorFeedField.setAttribute("style", "display:block");
                    }.bind(curatorFeedField), 200);

                    return;
                }
            }

            this.curatorLoaded = true;
            var this_ = this;
            (function () {
                var i, e, d = document, s = "script";
                i = d.createElement("script");
                i.async = 1;
                i.charset = "UTF-8";
                i.src = "https://cdn.curator.io/published/" + this_.data["curator-id"] + ".js";
                e = d.getElementsByTagName(s)[0];
                e.parentNode.insertBefore(i, e);

                i.onload = function () {
                    document.getElementById(this_.rid("posts-provider")).innerText = this_.mmd(this_.data.posts.title + " - " + this_.data.posts.provider);
                };
            })();
        },
        elements: function () {
            return [
                {
                    tag: "section", attr: {id: this.rid("intro"), "data-visible": "true"}, children: [
                        {
                            tag: "div", attr: {id: this.rid("section-container")}, children: [
                                {
                                    tag: "div",
                                    attr: {id: this.rid("img-container"), class: "fit-img"},
                                    children: [
                                        {tag: "img", attr: {id: this.rid("img"), alt: ""}}
                                    ],
                                    loadingfx: true,
                                },
                                {tag: "h1", attr: {id: this.rid("name")}, loadingfx: true, text: "..."},
                                {tag: "h2", attr: {id: this.rid("title")}, loadingfx: true, text: "..."},
                                {tag: "div", attr: {id: this.rid("video")}, loadingfx: true},
                                {tag: "div", attr: {id: this.rid("contents")}, loadingfx: true},
                                {tag: "ul", attr: {id: this.rid("social")}},
                                {
                                    tag: "button",
                                    loadingfx: true,
                                    text: "Show Posts",
                                    attr: {id: this.rid("open-posts-handle"), title: "Show posts"}
                                }
                            ]
                        },
                    ]
                },
                {
                    tag: "section", attr: {id: this.rid("posts"), "data-visible": "false"}, children: [
                        {
                            tag: "div", attr: {id: this.rid("section-container")}, children: [
                                {tag: "button", attr: {id: this.rid("close-posts-handle"), "title": "Hide posts"}},
                                {tag: "h6", attr: {id: this.rid("posts-title")}},
                                {
                                    tag: "div",
                                    attr: {id: "curator-feed"},
                                    children: [
                                        {
                                            tag: "a",
                                            attr: {
                                                id: this.rid("posts-provider"),
                                                href: "https://curator.io",
                                                target: "_blank",
                                                rel: "noreferrer",
                                                class: "crt-logo crt-tag"
                                            }
                                        }
                                    ]
                                },
                            ]
                        },
                    ]
                },
                {tag: "button", attr: {id: this.rid("theme-handle")}}
            ]
        },
        xhr: function (url, cb) {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (this.readyState === 4 && this.status >= 200) {
                    var response = JSON.parse(this.response);
                    return cb(response);
                }
            };

            xhr.open("GET", url, true);
            xhr.withCredentials = true;
            xhr.send();
        },
        mmd: function (src) {
            var h = '';

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
        }
    };
})();

pWeb.init();