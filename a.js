(function () {
    AFRAME.registerComponent('update-html', {
        init: function () {
            this.yumeCharacters = Array.from([
                '夢，トイレに入るとBGMが流れる．人がいてもいなくてもBGMは流れているようだった．建物に様々なトイレがあり，それぞれに固有のBGMがある．ジャズが流れるトイレが一番気に入った．これはめっちゃいいなと思い，家でもやろうという気持ちになった．',
                '夢，意図せず家のベランダから道に飛び降りてしまう．どうしようと思って，その場でジャンプし続けていると，重力加速度のバグで，だんだん飛距離が上がってきて，最終的に2階まで到達してベランダから家に帰れた．',
            ].sort(() => Math.random > 0.5 ? 1 : -1).join(''));
            this.characterElements = document.querySelectorAll('.character-element');

            this.characterElements.forEach((element) => {
                this.setYume(element.components.material.shader);
            });
        },
        setYume: function (shader) {
            shader.__targetEl.innerHTML = this.yumeCharacters[0];
            this.yumeCharacters.push(this.yumeCharacters.shift());
            shader.__render();
        },
        tick: function (t, dt) {
            radius = 5.0;
            this.characterElements.forEach((element, i) => {
                const theta = (t / 3000.0 - (i / this.characterElements.length * Math.PI * 2)) % (Math.PI * 2.0);
                const newY = Math.tan(theta / 2.0);
                if (element.object3D.position.y > newY) {
                    this.setYume(element.components.material.shader);
                }
                element.object3D.position.set(Math.sin(theta) * radius, newY, Math.cos(theta) * radius);
                element.object3D.rotation.set(0, theta - Math.PI, 0);
            });
        },
    });
})();
