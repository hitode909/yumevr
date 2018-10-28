"use strict";
(function () {
    var YumeEntry = /** @class */ (function () {
        function YumeEntry(sourceEntry) {
            this.parser = new DOMParser();
            this.sourceEntry = sourceEntry;
        }
        YumeEntry.prototype.published = function () {
            return new Date(this.sourceEntry.querySelector('published').textContent);
        };
        YumeEntry.prototype.body = function () {
            var entryBody = this.sourceEntry.querySelector('content').textContent;
            var body = this.parser.parseFromString(entryBody, "text/html").body.textContent;
            return body.replace(/\s+/g, ' ');
        };
        YumeEntry.prototype.formattedText = function () {
            var date = this.published();
            var body = this.body();
            return date.getFullYear() + "\u5E74" + (date.getMonth() + 1) + "\u6708" + date.getDate() + "\u65E5\u306E\u5922 " + body + "  ";
        };
        return YumeEntry;
    }());
    var OnMemoryEntry = /** @class */ (function () {
        function OnMemoryEntry(published, body) {
            this.published = published;
            this.body = body;
        }
        OnMemoryEntry.prototype.formattedText = function () {
            var date = this.published;
            var body = this.body;
            return date.getFullYear() + "\u5E74" + (date.getMonth() + 1) + "\u6708" + date.getDate() + "\u65E5\u306E\u5922 " + body + "  ";
        };
        return OnMemoryEntry;
    }());
    var YumeRepository = /** @class */ (function () {
        function YumeRepository() {
            this.parser = new DOMParser();
            this.entries = [];
        }
        YumeRepository.prototype.crawl = function (page) {
            var _this = this;
            var query = '';
            if (page) {
                query = "?page=" + page;
            }
            fetch('https://blog.sushi.money/feed/category/' + encodeURIComponent('夢日記') + query)
                .then(function (res) { return res.text(); })
                .then(function (text) { return _this.parser.parseFromString(text, "text/xml"); })
                .then(function (feed) {
                var sourceEntries = Array.prototype.slice.apply(feed.querySelectorAll('entry'));
                sourceEntries.forEach(function (entry) {
                    _this.entries.push(new YumeEntry(entry));
                });
                if (sourceEntries.length === 30) {
                    _this.crawl(Math.floor(_this.getOldestEntry().published().getTime() / 1000));
                }
            });
        };
        YumeRepository.prototype.getOldestEntry = function () {
            return this.entries[this.entries.length - 1];
        };
        YumeRepository.prototype.getRandomEntry = function () {
            return this.entries[Math.floor(Math.random() * this.entries.length)] || this.getOnMemoryEntry();
        };
        YumeRepository.prototype.getOnMemoryEntry = function () {
            var list = [
                new OnMemoryEntry(new Date(2018, 8, 25), '夢，意図せず家のベランダから道に飛び降りてしまう．どうしようと思って，その場でジャンプし続けていると，重力加速度のバグで，だんだん飛距離が上がってきて，最終的に2階まで到達してベランダから家に帰れた．'),
                new OnMemoryEntry(new Date(2018, 5, 14), '夢、家にIoTボタンを設置する。押すと爆音でノイズが流れる。作りが甘いので音を止めることはできない。'),
            ];
            return list[Math.floor(Math.random() * list.length)];
        };
        return YumeRepository;
    }());
    window.AFRAME.registerComponent('update-html', {
        init: function () {
            var _this = this;
            this.yumeRepository = new YumeRepository();
            this.yumeRepository.crawl();
            this.yumeCharacters = [];
            this.characterElements = document.querySelectorAll('.character-element');
            this.characterElements.forEach(function (element) {
                _this.setYume(element.components.material.shader);
            });
        },
        setYume: function (shader) {
            if (!this.yumeCharacters.length) {
                this.yumeCharacters = this.yumeRepository.getRandomEntry().formattedText().split('');
                console.log(this.yumeCharacters);
            }
            shader.__targetEl.innerHTML = this.yumeCharacters.shift();
            shader.__render();
        },
        tick: function (t, dt) {
            var _this = this;
            var radius = 5.0;
            this.characterElements.forEach(function (element, i) {
                var theta = (t / 1500.0 - (i / _this.characterElements.length * Math.PI * 2)) % (Math.PI * 2.0);
                var newY = Math.tan(theta / 2.0);
                if (element.object3D.position.y > newY) {
                    _this.setYume(element.components.material.shader);
                }
                element.object3D.position.set(Math.sin(theta) * radius, newY, Math.cos(theta) * radius);
                element.object3D.rotation.set(0, theta - Math.PI, 0);
            });
        },
    });
})();
