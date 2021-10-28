const Alert = {
    show: function (html, selector) {
        document.body.insertAdjacentHTML('beforeend', html);
        $.fancybox.open($(selector));
    },
    showModal: function (html, selector) {
        document.body.insertAdjacentHTML('beforeend', html);
        $.fancybox.open({
            src: $(selector),
            type: 'inline',
            modal: true
        });
    },
    close: function (selector) {
        $.fancybox.close($(this).closest(selector));
    },
    __randomId: function (prefix = '') {
        let r, id;
        do {
            r = Math.random().toString(36).substr(3, 5);
            id = prefix.length ? `${prefix}-${r}` : r;
        } while (document.querySelectorAll(`#${id}`).length)
        return id;
    },
    __html: function (id, classHtml, iconURL, title, message, options, extra = '') {
        return `<div style="display: none">
        <div id="${id}" style="" class="${classHtml}">
            <img src="${iconURL}">
            <h4>${title}</h4>
            <p>${message}</p>
            <div class="flex-small flex-justify-between-xs tnd-mt-20-xs">
                ${options}
            </div>
            ${extra}
        </div>
    </div>`;
    },
    __htmlForm: function (id, classHtml, iconURL, title, message, form, options='', extra = '') {
        return `<div style="display: none">
        <div id="${id}" style="" class="${classHtml}">
            <img src="${iconURL}">
            <h4>${title}</h4>
            <p>${message}</p>
            ${form}
            <div class="flex-small flex-justify-between-xs tnd-mt-20-xs">
                ${options}
            </div>
             ${extra}
        </div>
    </div>`;
    },
    __rootURL: function() {
        if (typeof root === 'undefined' || root === null) {
            return 'https://catalogo.claro.com.ec/';
        }
        return root.charAt(root.length-1) == '/' ? root : `${root}/`;
    },
    __rootImgURL: function() {
        if (typeof rootImg === 'undefined' || rootImg === null) {
            return 'https://catalogo.claro.com.ec/';
        }
        return rootImg.charAt(rootImg.length-1) == '/' ? rootImg : `${rootImg}/`;
    },
    ok: function(iconURL, title, message, textPrimary = 'Aceptar') {
        let id = this.__randomId('alert-choice');
        let buttons = `<a href="#?" class="tnd-btn red tnd-mx-auto-xs max modalTienda-close" data-target="#${id}">${textPrimary}</a>`;
        let html = this.__html(id, 'modalTienda modalOneButton', iconURL, title, message, buttons);
        this.show(html, `#${id}`);
    },
    error: function(message, title = '¡Ups! Ocurrió un error', textPrimary = 'Aceptar') {
        this.ok(`${this.__rootImgURL()}images/iconos/ico-error.svg`, title, message, textPrimary);
    },
    oneOption: function (iconURL, title, message, textPrimary, urlPrimary, textSecundary) {
        let id = this.__randomId('alert-choice');
        let buttons = `<a href="${urlPrimary}" class="tnd-btn turquoise bordered tnd-mx-auto-xs max order-1-xs">${textPrimary}</a>
            <a href="#?" class="tnd-btn red tnd-mx-auto-xs max order-2-xs modalTienda-close" data-target="#${id}">${textSecundary}</a>`;
        let html = this.__html(id, 'modalTienda modalTwoButtons', iconURL, title, message, buttons);
        this.show(html, `#${id}`);
    },
    oneOptionRedirect: function (iconURL, title, message, textPrimary, urlPrimary) {
        let id = this.__randomId('alert-choice');
        let buttons = `<a href="${urlPrimary}" class="tnd-btn red tnd-mx-auto-xs max ">${textPrimary}</a>`;
        let html = this.__html(id, 'modalTienda modalOneButton', iconURL, title, message, buttons);
        this.showModal(html, `#${id}`);
    },
    twoOptions: function (iconURL, title, message, textPrimary, urlPrimary, textSecundary, urlSecundary) {
        let id = this.__randomId('alert-choices');
        let buttons = `<a href="${urlSecundary}" class="tnd-btn turquoise bordered tnd-mx-auto-xs max order-1-xs">${textSecundary}</a>
            <a href="${urlPrimary}" class="tnd-btn red tnd-mx-auto-xs max order-2-xs">${textPrimary}</a>`;
        let html = this.__html(id, 'modalTienda modalTwoButtons', iconURL, title, message, buttons);
        this.show(html, `#${id}`);
    },
    addCart: function (product, message, urlPrimary, title = '¡Añadido al carrito!', iconURL = 'images/iconos/ico_carritoCompra.svg', textPrimary = '¡Ir al carrito!', textSecundary = 'Seguir comprando') {
        let id = this.__randomId('alert-carrito');
        let buttons = `<a href="#?" class="tnd-btn turquoise bordered tnd-mx-auto-xs max order-1-xs modalTienda-close" data-target="#${id}">${textSecundary}</a>
            <a href="${urlPrimary}" class="tnd-btn red tnd-mx-auto-xs max order-2-xs">${textPrimary}</a>`;
        let html_extra = (product || '') ? `<div class="productoCarritoContainer"><p>Producto agregado al carrito:</p><div class="productoCarrito"><div class="imgContainer"><img src="${product.thumbnail}"></div><div><p>${product.name}</p><p>${product.section}</p></div></div></div>` : '';
        let html = this.__html(id, 'modalTienda modalTwoButtons', `${this.__rootImgURL()}${iconURL}`, title, message, buttons, html_extra);
        this.show(html, `#${id}`);
    },
    fullCart: function (title, message, newProduct, lastProduct, carritoType, carritoToken, textPrimary = 'Sí, deseo sustituirlo', textSecundary = 'No, deseo conservarlo') {
        let id = this.__randomId('alert-carrito');
        let buttons = `<a href="#!" class="tnd-btn turquoise bordered tnd-mx-auto-xs max order-1-xs modalTienda-close" data-target="#${id}">${textSecundary}</a>
            <a href="#?" class="tnd-btn red tnd-mx-auto-xs max order-2-xs modalCarrito-replace" data-target="${lastProduct.token}" data-toggle="${btoa(JSON.stringify(newProduct))}" data-type="${carritoType}" data-token="${carritoToken}">${textPrimary}</a>`;
        let html_extra = `<div class="productoCarritoContainer"><p>Último producto agregado al carrito:</p><div class="productoCarrito"><div class="imgContainer"><img src="${lastProduct.img}"></div><div><p>${lastProduct.nombreComercial}</p><p>${lastProduct.section}</p></div></div></div>`;
        let html = this.__html(id, 'modalTienda modalTwoButtons', `${this.__rootImgURL()}images/iconos/ico_pasaminutos.svg`, title, message, buttons, html_extra);
        this.show(html, `#${id}`);
    },
    form: function (title, message,iconURL,form) {
        let id = this.__randomId('modal-form');
        let html = this.__htmlForm(id, 'modalTienda', `${this.__rootImgURL()}${iconURL}`, title, message, form);
        this.show(html, `#${id}`);
    },
}
/*Object.preventExtensions(Alert);
Object.seal(Alert);*/
Object.freeze(Alert);


// (function() {
//     document.getElementsByClassName('modalTienda-close').forEach(function (button) {
//         button.addEventListener('click', function (e) {
//             e.preventDefault();
//             Alert.close($(this).data('.modalTienda'));
//         });
//     });
// })();


$(document).ready(function() {
    $('body').on("click", ".modalTienda-close", function(e) {
        e.preventDefault();
        Alert.close($(this).data('.modalTienda'));
    });

});