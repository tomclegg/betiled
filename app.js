var home = {
    controller: function Controller() {
        this.q = m.prop(m.route.param('q') || '/*Hello*/')
        this.grout = m.prop(m.route.param('grout') || '#ddd')
        this.zero = m.prop(m.route.param('zero') || '#fff')
        this.one = m.prop(m.route.param('one') || '#000')
        this.dropbits = m.prop(m.route.param('dropbits') || '')
    },
    view: function view(ctrl) {
        return m('div', [
            m('nav.navbar.navbar-default.navbar-static-top',
              m('.container-fluid',
                m('.collapse.navbar-collapse',
                  m('.navbar-header.navbar-left',
                    m('a.navbar-brand[href="#"]', {onclick: home.falsy}, 'betiled!'))))),
            m('.container',
              m('form', {onsubmit: home.falsy},
                m('.form-group',
                  m('input.form-control', {value: ctrl.q(),
                                           name: 'q',
                                           oninput: m.withAttr('value', ctrl.q)}))),
              m('form.form-inline', {onsubmit: home.falsy},
                m('.form-group',
                  m('.input-group',
                    m('.input-group-addon', 'grout'),
                    m('input.form-control#grout', {value: ctrl.grout(),
                                                   name: 'grout',
						   size: 4,
                                                   oninput: m.withAttr('value', ctrl.grout)})),
                  m.trust('&nbsp'),
                  m('.input-group',
                    m('.input-group-addon', 'zero'),
                    m('input.form-control#zero', {value: ctrl.zero(),
                                                  name: 'zero',
						  size: 4,
                                                  oninput: m.withAttr('value', ctrl.zero)})),
                  m.trust('&nbsp'),
                  m('.input-group',
                    m('.input-group-addon', 'one'),
                    m('input.form-control#one', {value: ctrl.one(),
                                                 name: 'one',
						 size: 4,
                                                 oninput: m.withAttr('value', ctrl.one)})),
                  m.trust('&nbsp'),
                  m('.input-group',
                    m('.input-group-addon', 'dropbits'),
                    m('input.form-control#dropbits', {value: ctrl.dropbits(),
                                                      name: 'dropbits',
						      size: 4,
                                                      oninput: m.withAttr('value', ctrl.dropbits)})),
		 ))),
            m('.container',
              m('div', {style: {margin: '1em -20em 1em -20em'}},
                m('canvas', {style: {marginTop: '1em'},
                             config: home.drawCanvas(ctrl.q, ctrl.grout, ctrl.zero, ctrl.one, ctrl.dropbits),
                             height: '500px',
                             width: '100%'}))),
        ]);
    },
    drawCanvas: function(q, grout, zero, one, dropbits) {
        return function(el, isInitialized, mctx) {
            var ctx=el.getContext('2d');
            var s=q();
            var w=15, h=15;
            var ox, oy=16;
            var x, y;
	    var lines=s.split('\u2193');
	    var ones=[];

            window.history.replaceState({}, '', '/#/'+[s,grout(),zero(),one(),dropbits()].map(encodeURIComponent).join('/'))
            var parentRect = el.parentElement.getBoundingClientRect()
            ctx.width = parentRect.width
            fullheight = Math.floor(el.getBoundingClientRect().height/h)*h
            el.setAttribute('width', ctx.width)
            ctx.clearRect(0, 0, ctx.width, parentRect.height)
            ctx.fillStyle = grout()
            ctx.fillRect(0, 0, ctx.width, fullheight+1)
            ox = Math.floor((ctx.width-s.length*w)/2)
	    var row=0;
	    for (var line=0; line<lines.length; line++) {
		for (var bit=0; bit<8; bit++) {
		    if (dropbits().indexOf(bit) < 0) {
			row++;
			ones[row] = [];
			for (x=0; x<lines[line].length; x++) {
			    ones[row][x] = (lines[line].charCodeAt(x) >> bit) & 1;
			}
		    }
		}
	    }
            for (x=-Math.floor(ox/w); x<=ctx.width/w; x++) {
                for (y=-Math.floor(oy/h); y*h<fullheight; y++) {
                    if (ones[y] && ones[y][x])
                        ctx.fillStyle = one()
                    else
                        ctx.fillStyle = zero()
                    ctx.fillRect(ox+x*w, oy+y*h, w-1, h-1)
                }
            }
        }
    },
    falsy: function falsy() { return false },
};

m.route.mode = 'hash';
m.route(document.body, "/", {
    "/": home,
    "/:q/:grout/:zero/:one/:dropbits": home,
});
