(function () {
    (function () {

    })();

    const parser = new DOMParser();
    const createElement = (source, tag) => {
        return parser.parseFromString(source, "text/html").querySelector(tag);
    };

    AFRAME.registerComponent('update-html', {
        init: function () {
            this.canvasElements = document.querySelectorAll('.character-renderer');
            this.characterElements = document.querySelectorAll('.character-element');

            const characters = Array.from('勤怠打刻しませんか');
            this.canvasElements.forEach((element, i) => {
                console.log(characters[i]);
                element.innerHTML = characters[i % characters.length];
            });
        },
        tick: function (t, dt) {
            this.characterElements.forEach((element, i) => {
                element.setAttribute('position', { x: -Math.cos(t / 1000 - i/3)*5, y: 2, z: -Math.sin(t / 1000 - i/3) * 5 - 4 });
            });
        },
    });
})();
