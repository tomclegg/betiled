var home = {
    controller: function Controller() {
        this.q = m.prop(m.route.param('q'))
    },
    view: function view(ctrl) {
        return m('div', [
            m('nv.navbar.navbar-default.navbar-static-top',
              m('.container-fluid',
                m('.navbar-header.navbar-left',
                  m('a.navbar-brand[href="#"]', 'betiled!')))),
            m('.container',
              m('form',
                m('.form-group',
                  m('input.form-control', {size: 80,
                                           value: ctrl.q(),
                                           name: 'q',
                                           oninput: m.withAttr('value', ctrl.q)}))),
              m('canvas', {config: home.drawCanvas(ctrl.q), width: '100%'})),
        ]);
    },
    drawCanvas: function(q) {
        return function(el, isInitialized, mctx) {
            var ctx=el.getContext('2d');
            var s=q();
            var w=10, h=10;
            ctx.width = el.parentElement.getBoundingClientRect().width
            el.setAttribute('width', ctx.width)
            console.log(ctx.width)
            ctx.clearRect(0, 0, ctx.width, ctx.height)
            for (var x=0; x<s.length; x++) {
                var c=s.charCodeAt(x);
                for (var y=0; y<8; y++) {
                    if ((c >> y) & 1) {
                        ctx.fillRect(x*w, y*h, w, h)
                    }
                }
            }
        }
    },
};

m.route.mode = 'hash';
m.route(document.body, "/", {
    "/": home,
    "/:q": home,
});
