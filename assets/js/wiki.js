"use strict";
/**
 * Loads XML content from wordpress's Ajax API
 * @async
 *
 * @author Mike Kühnapfel
 * @since 1.0.0
 * @version 1.0.0
 */
document.querySelectorAll('div.wp-block-piwi-wiki').forEach(function (it) {
    var form = {
        action: 'piratenwiki',
        page: it.dataset.page
    };
    fetch(piwi.ajax_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: Object.entries(form).map(function (it) { it[1] = encodeURIComponent(it[1]); return it.join('='); }).join('&')
    }).then(function (it) { return it.json(); }).then(function (it) { return parseWiki(it); }).then(function (_a) {
        var content = _a.content, last_edited = _a.last_edited, url = _a.url, title = _a.title;
        var container = document.createElement('div');
        container.classList.add('wiki-container');
        container.innerHTML = content;
        // Remove doubled line breaks
        Array.from(container.querySelectorAll('p, li, dt, dd, h2, h3, h4, h5, h6')).forEach(function (it) { return it.innerHTML = it.innerHTML.replace(/(?<!<br\/?>)\n(?!<br\/?>)/g, '<br>'); });
        // Remove placeholder elements
        Array.from(it.children).forEach(function (it) { return it.remove(); });
        it.prepend(container);
        // BEGIN FOOTER
        var foot = document.createElement('footer');
        foot.classList.add('piwi_wiki_footer');
        var status = document.createElement('p');
        status.innerText = 'Stand: ';
        var time = document.createElement('time');
        time.dateTime = last_edited.raw.toISOString();
        time.innerText = last_edited.formatted;
        foot.appendChild(status).appendChild(time);
        var link_wrapper = document.createElement('p');
        var link = document.createElement('a');
        link.classList.add('btn');
        link.classList.add('external-link-img-wrapper');
        link.rel = 'external';
        link.target = '_blank';
        link.href = url;
        link.title = "\"" + title + "\" im Piratenwiki ansehen";
        link.innerText = 'Im Piratenwiki ansehen';
        it.appendChild(foot).appendChild(link_wrapper).appendChild(link);
        // END FOOTER
    }).catch(function (e) { return console.error(e); });
});
/**
 * Parses the JSON object returned by the AJAX request
 * @param {{title: string, url: string, last_edited: {raw: string, formatted: string}, content: string}} input
 * @returns {Promise<{title: string, url: string, last_edited: {raw: Date, formatted: string}, content: string}>}
 * @async
 * @since 1.0.0
 * @author Mike Kühnapfel <mike.kuehnapfel@piraten-rek.de>
 */
function parseWiki(input) {
    return new Promise(function (resolve, reject) {
        try {
            var res_1 = {
                title: input.title,
                url: input.title,
                last_edited: {
                    // Create Date object from raw DateTime string
                    raw: new Date(input.last_edited.raw),
                    formatted: input.last_edited.formatted
                },
                // Remove span and noinclude tags
                content: input.content.replace(/<span id="[\w.]+">|<\/span>|<noinclude>[\s\S]*?<\/noinclude>|<br\s?\/?>|\[\[Kategorie:.*?]]/g, '')
            };
            // Create headings
            Array.from(res_1.content.matchAll(/^(=+)([\w-–§\s,ÄÖÜäöüß:()]+)\1$/gm)).forEach(function (_a) {
                var search = _a[0], type = _a[1], replacement = _a[2];
                var tagName = "h" + (type.length + 1);
                res_1.content = res_1.content.replace(search, "<" + tagName + ">" + replacement + "</" + tagName + ">");
            });
            // Create lists
            res_1.content = res_1.content.replace(/((?:^\*+ .+$\n)+)/gm, '<ul>\n$1\n</ul>\n')
                .replace(/((?:^\*{2,} .+$\n)+)/gm, '<ul>\n$1\n</ul>\n')
                .replace(/((?:^\*{3,} .+$\n)+)/gm, '<ul>\n$1\n</ul>\n')
                .replace(/((?:^\*{4,} .+$\n)+)/gm, '<ul>\n$1\n</ul>\n')
                .replace(/((?:^\*{5,} .+$\n)+)/gm, '<ul>\n$1\n</ul>\n')
                .replace(/((?:^#+ .+$\n)+)/gm, '<ol>\n$1\n</ol>\n')
                .replace(/((?:^#{2,} .+$\n)+)/gm, '<ol>\n$1\n</ol>\n')
                .replace(/((?:^#{3,} .+$\n)+)/gm, '<ol>\n$1\n</ol>\n')
                .replace(/((?:^#{4,} .+$\n)+)/gm, '<ol>\n$1\n</ol>\n')
                .replace(/((?:^#{5,} .+$\n)+)/gm, '<ol>\n$1\n</ol>\n')
                .replace(/(?:^[*#]+ (.+$))/gm, '<li>$1</li>')
                .replace(/((?:^[;:].+$\n)+)/gm, '<dl>\n$1\n</dl>\n')
                .replace(/(?:^;(.+$))/gm, '<dt>$1</dt>')
                .replace(/(?:^:(.+$))/gm, '<dd>$1</dd>')
                // Bold and italic
                .replace(/('{5})([\s\S]*?)\1/gm, '<strong><em>$2</em></strong>')
                .replace(/('{3})([\s\S]*?)\1/g, '<strong>$2</strong>')
                .replace(/('{2})([\s\S]*?)\1/g, '<em>$2</em>')
                // Paragrahs
                .replace(/^(?!<)((?:.+\n(?!<)|.+)+)/gm, '<p>$1</p>')
                // Anchors
                .replace(/\[\[(.+)\|(.+)]]/g, '<a href="https://wiki.piratenpartei.de/$1">$2</a>')
                .replace(/\[((?:https?:)?\/\/.+) (.+)]/g, '<a href="$1">$2</a>')
                .replace(/\[((?:https?:)?\/\/.+)]/g, '<a href="$1">$1</a>');
            // Filter empty lines
            res_1.content = res_1.content.split('\n').filter(function (e) { return !/^\s*$/.test(e); }).join('\n');
            resolve(res_1);
        }
        catch (e) {
            reject(e);
        }
    });
}
