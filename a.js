(function () {
    (function () {

    })();

    const parser = new DOMParser();
    const createElement = (source, tag) => {
        return parser.parseFromString(source, "text/html").querySelector(tag);
    };

    const choise = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };

    AFRAME.registerComponent('update-html', {
        init: function () {
            this.yumeCharacters = Array.from('夢，トイレに入るとBGMが流れる．人がいてもいなくてもBGMは流れているようだった．建物に様々なトイレがあり，それぞれに固有のBGMがある．ジャズが流れるトイレが一番気に入った．これはめっちゃいいなと思い，家でもやろうという気持ちになった．');
            this.elementsShouldUpdate = [];
            this.canvasElements = document.querySelectorAll('.character-renderer');
            this.characterElements = document.querySelectorAll('.character-element');
            setYume = () => {
                const characters = Array.from(choise([
                    '夢，アルミ箔みたいな日本刀で宮本武蔵と戦うことになって焦る',
                    '速い自転車乗る，速すぎて曲るのが困難',
                    '夢，トイレに入るとBGMが流れる．人がいてもいなくてもBGMは流れているようだった．建物に様々なトイレがあり，それぞれに固有のBGMがある．ジャズが流れるトイレが一番気に入った．これはめっちゃいいなと思い，家でもやろうという気持ちになった．',
                ]));
                this.canvasElements.forEach((element, i) => {
                    element.innerHTML = characters[i % characters.length];
                });
                this.characterElements.forEach((element, i) => {
                    element.components.material.shader.__render();
                });
            };
            setYume();
            // setInterval(setYume, 6000);
        },
        tick: function (t, dt) {
            this.characterElements.forEach((element, i) => {
                const theta = (t / 3000.0 - (i / this.characterElements.length * Math.PI * 2)) % (Math.PI * 2.0);
                radius = 5.0;
                const newY = Math.tan(theta / 2.0);
                if (element.object3D.position.y > newY) {
                    element.components.material.shader.__targetEl.innerHTML = this.yumeCharacters[0];
                    console.log(this.yumeCharacters[0]);
                    this.yumeCharacters.push(this.yumeCharacters.shift());
                    element.components.material.shader.__render();
                }
                element.object3D.position.set(Math.sin(theta) * radius, newY, Math.cos(theta) * radius);
                element.object3D.rotation.set(0, theta-Math.PI, 0);
            });
        },
    });
})();
