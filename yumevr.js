//(function () {
class YumeEntry {
  parser = new DOMParser();
  constructor(sourceEntry) {
    this.sourceEntry = sourceEntry;
  }
  published() {
    return new Date(this.sourceEntry.querySelector('published').textContent);
  }
  body() {
    const entryBody = this.sourceEntry.querySelector('content').textContent;
    const body = this.parser.parseFromString(entryBody, "text/html").body.textContent;
    return body.replace(/\s+/g, ' ');
  }
  formattedText() {
    const date = this.published();
    const body = this.body();
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日の夢 ${body}  `;
  }
}
class OnMemoryEntry {
  constructor(published, body) {
    this.published = published;
    this.body = body;
  }

  formattedText() {
    const date = this.published;
    const body = this.body;
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日の夢 ${body}  `;
  }
}
class YumeRepository {
  parser = new DOMParser();
  constructor() {
    this.entries = [];
  }

  crawl(page) {
    let query = '';
    if (page) {
      query = `?page=${page}`;
    }
    fetch('https://blog.sushi.money/feed/category/' + encodeURIComponent('夢日記') + query)
      .then(res => res.text())
      .then(text => this.parser.parseFromString(text, "text/xml"))
      .then(feed => {
        const sourceEntries = Array.from(feed.querySelectorAll('entry'));
        sourceEntries.forEach(entry => {
          this.entries.push(new YumeEntry(entry));
        });
        if (sourceEntries.length === 30) {
          this.crawl(Math.floor(this.getOldestEntry().published().getTime() / 1000));
        }
      });
  }

  getOldestEntry() {
    return this.entries[this.entries.length - 1];
  }

  getRandomEntry() {
    return this.entries[Math.floor(Math.random() * this.entries.length)] || this.getOnMemoryEntry();
  }

  getOnMemoryEntry() {
    const list = [
      new OnMemoryEntry(new Date(2018, 8, 25), '夢，意図せず家のベランダから道に飛び降りてしまう．どうしようと思って，その場でジャンプし続けていると，重力加速度のバグで，だんだん飛距離が上がってきて，最終的に2階まで到達してベランダから家に帰れた．'),
      new OnMemoryEntry(new Date(2018, 5, 14), '夢、家にIoTボタンを設置する。押すと爆音でノイズが流れる。作りが甘いので音を止めることはできない。'),
    ]
    return list[Math.floor(Math.random()*list.length)];
  }
}

AFRAME.registerComponent('update-html', {
  init: function () {
    this.yumeRepository = new YumeRepository();
    this.yumeRepository.crawl();
    this.yumeCharacters = [];
    this.characterElements = document.querySelectorAll('.character-element');

    this.characterElements.forEach((element) => {
      this.setYume(element.components.material.shader);
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
    radius = 5.0;
    this.characterElements.forEach((element, i) => {
      const theta = (t / 1500.0 - (i / this.characterElements.length * Math.PI * 2)) % (Math.PI * 2.0);
      const newY = Math.tan(theta / 2.0);
      if (element.object3D.position.y > newY) {
        this.setYume(element.components.material.shader);
      }
      element.object3D.position.set(Math.sin(theta) * radius, newY, Math.cos(theta) * radius);
      element.object3D.rotation.set(0, theta - Math.PI, 0);
    });
  },
});
//})();
