let url = "data.json",
    data = {
        image: null,
        name: null,
        knows: null,
        title: null,
        career: {},
        social: {},
        posts: {
            title: null,
            provider: null
        },
    },
    cph = "data-cph",
    toggle = "data-visible",
    init = function () {
        socialCph();
        setTimeout(loadData, 500);
    },
    removeCph = function () {
        let sel = all("[" + cph + "]");

        for (let i in sel) {
            let el = sel[i];
            if (el instanceof HTMLElement) {
                el.removeAttribute(cph);
            }
        }

        id("intro").setAttribute("data-loaded", "true");
    },
    socialCph = function () {
        let item = "<li><a data-cph><i></i></a></li>",
            items = "";

        for (let i = 1; i <= 7; i++) {
            items += item;
        }

        id("social").innerHTML = items;
    },
    loadData = function () {
        xhr(function (r) {
            data = r;
            id("image").setAttribute("src", data.image);
            id("image").setAttribute("alt", data.name);
            id("name").innerHTML = data.name;
            id("knows").innerHTML = data.knows;
            id("title").innerHTML = data.title;
            id("posts-title").innerHTML = data.posts.title;
            id("career").innerHTML = null;
            id("social").innerHTML = null;

            for (let i in data.career) {
                let c = data.career[i],
                    item = createEl("span"),
                    title = createText(c.title + " "),
                    company = createEl("a"),
                    companyName = createText(c.company),
                    comma = createText(", ");

                if (i > 0) {
                    id("career").appendChild(comma);
                }

                company.setAttribute("href", c.url);
                company.setAttribute("target", "_blank");
                company.setAttribute("rel", "noreferrer");
                company.appendChild(companyName);

                item.appendChild(title);
                item.appendChild(company);

                id("career").appendChild(item);
            }

            for (let i in data.social) {
                let item = createEl("li"),
                    link = createEl("a"),
                    icon = createEl("i");

                link.setAttribute("href", data.social[i]);
                link.setAttribute("title", i.charAt(0).toUpperCase() + i.slice(1));
                link.setAttribute("target", "_blank");
                link.setAttribute("rel", "noreferrer");
                icon.setAttribute("class", "sprite-before social-" + i);

                link.appendChild(icon);
                item.appendChild(link);

                id("social").appendChild(item);
            }

            removeCph();
        });
    },
    togglePosts = function (bool) {
        if (bool)
            loadCurator();

        id("intro").setAttribute(toggle, !bool);
        id("posts").setAttribute(toggle, bool);
    },
    loadCurator = function () {
        if (curatorLoaded) {
            var curatorFeedField = window.document.querySelector('.crt-feed');

            if (curatorFeedField) {
                curatorFeedField.setAttribute('style', 'display:none');

                setTimeout(function () {
                    curatorFeedField.setAttribute('style', 'display:block');
                }.bind(curatorFeedField), 200);

                return;
            }
        }

        curatorLoaded = true;
        (function () {
            var i, e, d = document, s = "script";
            i = d.createElement("script");
            i.async = 1;
            i.src = "https://cdn.curator.io/published/fa18d8c4-2ff9-453e-85c0-7b15c4a60733.js";
            e = d.getElementsByTagName(s)[0];
            e.parentNode.insertBefore(i, e);

            i.onload = function () {
                id("posts-provider").innerText = data.posts.title + " - " + data.posts.provider;
            };
        })();
    },
    curatorLoaded = false;

init();

id("open-posts-handle").addEventListener("click", function () {
    togglePosts(true);
});

id("close-posts-handle").addEventListener("click", function () {
    togglePosts(false);
});