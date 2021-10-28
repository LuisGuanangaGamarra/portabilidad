var string = function(array) { return array.join('\n'); };

function ObjectLength_Modern( object ) {
    return Object.keys(object).length;
}

function ObjectLength_Legacy( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
}

var ObjectLength =
    Object.keys ? ObjectLength_Modern : ObjectLength_Legacy;


/*
$('#tnd-cart-header,#btncart').click(function () {
    previewTienda('#formCarritoPreview');
});*/

(function() {

    /*MENU*/

    var menu = document.querySelector('#menu');
    var nav = document.querySelector('#bottom nav');
    var top = document.querySelector('#top');
    var menuItems = Array.from(document.querySelectorAll('#bottom .has-children'));
    var bottomMenu = document.querySelector('#bottom .menu');
    var bottomNav = document.querySelector('#bottom');
    var header = document.querySelector('#header');

// Change + for x, slide down the nav

    menu.onclick = function(ev) {
        menu.classList.toggle('open');
        nav.classList.toggle('open');
    };

// When one clicked, toggle it and close the others

    menuItems.forEach(function(el) {
        el.onclick = function() {
            menuItems.forEach(function(el_) {
                if (el == el_) {
                    el_.classList.toggle('open');
                } else {
                    el_.classList.remove('open');
                }
            });
        };
    });

// Hide top header and move nav up if scrolled

    addEventListener('scroll', function() {

        if (scrollY <= 36) {
            top.style.display = 'flex';
            nav.classList.remove('down');
        } else {
            top.style.display = 'none';
            nav.classList.add('down');
        }

    });

// Close desktop menu at mouse leave

    if (innerWidth > 960) {
        bottomMenu.onmouseleave = function() {
            menuItems.forEach(function(el) {
                el.classList.remove('open');
            });
        };
    }

})();
