/**
 * CartProduct
 */
const CartProduct = function (section, product, sku, token, img, accesories = [], quantity = 1) {
    this.section = section;
    this.name = product;
    this.sku = sku;
    this.token = token;
    this.thumbnail = img;
    this.quantity = quantity;
    this.accesories = accesories;
}

/**
 * CartAccesory
 */
const CartAccesory = function (name, thumbnail, price = 0, quantity = 1) {
    this.name = name;
    this.thumbnail = thumbnail;
    this.price = price;
    this.quantity = quantity;
}

/**
 * CartItem
 */
const CartItem = function (section, thumbnail, product, sku, plan = null, price = 0, discount = 0, tax = 0, accesories = [], quantity = 1) {
    this.section = section;
    this.thumbnail = thumbnail;
    this.product = product;
    this.sku = sku;
    this.plan = plan;
    this.price = price;
    this.discount = discount;
    this.tax = tax;
    this.accesories = accesories;
    this.quantity = quantity;
}

/**
 * CartPlan
 */
const CartPlan = function (section, thumbnail, id, slug, name, type, transaction = 'linea-nueva', price = 0, tax = 0, discount = 0, quantity = 1) {
    this.section = section;
    this.thumbnail = thumbnail;
    this.id = id;
    this.slug = slug;
    this.name = name;
    this.type = type;
    this.transaction = transaction;
    this.price = price;
    this.tax = tax;
    this.discount = discount;
    this.quantity = quantity;
}

/**
 * Cart
 */
const Cart = {
    __carType: 'cart',
    __rootURL: function() {
        if (typeof root === 'undefined' || root === null) {
            return 'https://catalogo.claro.com.ec/mi-carrito/';
        }
        return root.charAt(root.length-1) == '/' ? `${root}mi-carrito/` : `${root}/mi-carrito/`;
    },
    __rootImgURL: function() {
        if (typeof rootImg === 'undefined' || rootImg === null) {
            return 'https://catalogo.claro.com.ec/';
        }
        return rootImg.charAt(rootImg.length-1) == '/' ? rootImg : `${rootImg}/`;
    },
    __content: {
        currency: '$',
        token: '',
        products: [],
        quantity: 0,
        subtotal: 0,
        impuestos: 0,
        total: 0,
        limite: {
            quantity: 1,
            total: 2500
        }
    },
    __hidePreview: function() {
        try {
            $('#content-general').show();
            window.scrollTo(0, 0);
            $('#previewsContainer, #formCarritoPreview').hide();
        } catch (e) { }
    },
    __addPlan: function(plan) {
        let carrito = this;
        $.ajax({
            url: `${carrito.__rootURL()}api/add/${carrito.__carType}/plan`,
            type: 'POST',
            data: {
                token: carrito.__content.token,
                plan: plan,
            },
            beforeSend: function () {
                // console.log('Agregando plan...');
                try {
                    load();
                } catch (e) { }
            },
            success: function (data) {
                try {
                    // console.log('Cart obtenido:');
                    // console.log(data.content.cart);
                    carrito.__content.token = data.content.cart.token;
                    carrito.__content.products = data.content.cart.productos;
                    carrito.__content.quantity = data.content.cart.cantidad;
                    carrito.__content.subtotal = data.content.cart.subtotal;
                    carrito.__content.impuestos = data.content.cart.impuestos;
                    carrito.__content.total = data.content.cart.total;
                    $('.tnd-cart-cantity').html(carrito.__content.quantity);
                } catch (e) { }
                if(!data.error) {
                    // Alert.addCart(plan, 'Tu plan ha sido agregado con éxito. Puedes seguir tu proceso de compra o ver más productos.',`${Cart.__rootURL()}proceso-de-compra?utm_source=catalogo&utm_medium=modal-agregar-producto&utm_campaign=agregar-producto&utm_content=carrito`);
                    Alert.addCart(plan, 'Tu plan ha sido agregado con éxito. Puedes seguir tu proceso de compra o ver más productos.',`${Cart.__rootURL()}proceso-de-compra`);
                } else {
                    switch (data.code) {
                        case 0:
                            Alert.error(data.message);
                            break;
                        case 1:
                            //let product = new CartProduct (plan.section, plan.name, null, null, plan.thumbnail);
                            Alert.fullCart('¡Lo sentimos!', `${data.message}</p><p>¿Deseas sustituir tu último producto agregado por el <strong>${plan.name}</strong>?</p>`, plan, carrito.__content.products[carrito.__content.products.length - 1], 'cart', carrito.__content.token);
                            break;
                        case 2:
                            // Alert.addCart(null, data.message,`${Cart.__rootURL()}proceso-de-compra?utm_source=catalogo&utm_medium=modal-limite-monto&utm_campaign=agregar-producto&utm_content=carrito`, '¡Lo sentimos!', 'images/iconos/ico-error.svg');
                            Alert.addCart(null, data.message,`${Cart.__rootURL()}proceso-de-compra`, '¡Lo sentimos!', 'images/iconos/ico-error.svg');
                            break;
                    }
                    carrito.__hidePreview();
                }
            },
            complete: function () {
                try {
                    loaded();
                    $('.tnd-cart-cantity').html(carrito.__content.quantity);
                } catch (e) { }
            },
            error: function () {
                Alert.error('Parece que se ha presentado un problema al agregar tus planes al carrito de compras. Por favor, intenta nuevamente luego de unos minutos.');
                carrito.__hidePreview();
            }
        });
    },
    __addProduct: function(product) {
        let carrito = this;
        $.ajax({
            url: `${carrito.__rootURL()}api/add/${carrito.__carType}/product`,
            type: 'POST',
            data: {
                token: carrito.__content.token,
                product: product,
            },
            beforeSend: function () {
                //console.log('Agregando producto...');
                try {
                    load();
                } catch (e) { }
            },
            success: function (data) {
                try {
                    // console.log('Cart obtenido:');
                    // console.log(data.content.cart);
                    carrito.__content.token = data.content.cart.token;
                    carrito.__content.products = data.content.cart.productos;
                    carrito.__content.quantity = data.content.cart.cantidad;
                    carrito.__content.subtotal = data.content.cart.subtotal;
                    carrito.__content.impuestos = data.content.cart.impuestos;
                    carrito.__content.total = data.content.cart.total;
                    $('.tnd-cart-cantity').html(carrito.__content.quantity);
                } catch (e) { }
                if(!data.error) {
                    // Alert.addCart(product, 'Tu producto ha sido agregado con éxito. Puedes seguir tu proceso de compra o ver más productos.',`${Cart.__rootURL()}proceso-de-compra?utm_source=catalogo&utm_medium=modal-agregar-producto&utm_campaign=agregar-producto&utm_content=carrito`);
                    Alert.addCart(product, 'Tu producto ha sido agregado con éxito. Puedes seguir tu proceso de compra o ver más productos.',`${Cart.__rootURL()}proceso-de-compra`);
                } else {
                    switch (data.code) {
                        case 0:
                            Alert.error(data.message);
                            break;
                        case 1:
                            Alert.fullCart('¡Lo sentimos!', `${data.message}</p><p>¿Deseas sustituir tu último producto agregado por el <strong>${product.name}</strong>?</p>`, product, carrito.__content.products[carrito.__content.products.length - 1], 'cart', carrito.__content.token);
                            break;
                        case 2:
                            // Alert.addCart(null, data.message,`${Cart.__rootURL()}proceso-de-compra?utm_source=catalogo&utm_medium=modal-limite-monto&utm_campaign=agregar-producto&utm_content=carrito`, '¡Lo sentimos!', 'images/iconos/ico-error.svg');
                            Alert.addCart(null, data.message,`${Cart.__rootURL()}proceso-de-compra`, '¡Lo sentimos!', 'images/iconos/ico-error.svg');
                            break;
                    }
                    carrito.__hidePreview();
                }
            },
            complete: function () {
                try {
                    loaded();
                    $('.tnd-cart-cantity').html(carrito.__content.quantity);
                } catch (e) { }
            },
            error: function () {
                Alert.error('Parece que se ha presentado un problema al agregar tus productos al carrito de compras. Por favor, intenta nuevamente luego de unos minutos.');
                carrito.__hidePreview();
            }
        });
    },
    __addItem: function(item) {
        console.log('Item agregado');
        console.dir(item);
    },
    load: function() {
        let carrito = this;
        $.ajax({
            url: `${carrito.__rootURL()}api/show/${carrito.__carType}`,
            type: 'POST',
            beforeSend: function () { },
            success: function (data) {
                // console.log(data);
                if(!data.error) {
                    carrito.__content.token = data.content.token;
                    carrito.__content.products = data.content.productos;
                    carrito.__content.quantity = data.content.cantidad;
                    carrito.__content.subtotal = data.content.subtotal;
                    carrito.__content.impuestos = data.content.impuestos;
                    carrito.__content.total = data.content.total;
                    try {
                        // console.log('Actualizando cantidad: ' + carrito.__content.quantity);
                        /*$('.tnd-cart-cantity').html(carrito.__content.quantity);*/
                        $('.tnd-cart-cantity').each(function () {
                            $(this).html(carrito.__content.quantity);
                            // console.log('Cantidad actualizada: ' + $(this).html());
                        });

                    } catch (e) { }
                } else {
                    Alert.error('Parece que se ha presentado un problema al cargar tus productos del carrito de compras. Por favor, intenta nuevamente luego de unos minutos.');
                }
            },
            complete: function () {
                /*console.log('Cantidad actualizada: ' + carrito.__content.quantity);
                console.log($('.tnd-cart-cantity'));*/
                //try {
                //$('.tnd-cart-cantity').html(carrito.__content.quantity);
                //} catch (e) { }
            },
            error: function () {
                Alert.error('Parece que se ha presentado un problema al cargar tus productos del carrito de compras. Por favor, intenta nuevamente luego de unos minutos.');
                try {
                    $('.tnd-cart-cantity').html(0);
                } catch (e) { }
            }
        });
    },
    add: function(product) {
        if (typeof product === 'object') {
            switch (product.constructor.name) {
                case 'CartProduct':
                    this.__addProduct(product);
                    break;
                case 'CartPlan':
                    this.__addPlan(product);
                    break;
                case 'CartItem':
                    this.__addItem(product);
                    break;
                default:
                    Alert.error('No se pudo agregar el producto. Su clase no es válida.');
                    console.dir(typeof product);
                    break;
            }
        }
        // console.log(`Cantidad: ${this.__content.quantity}`);
    },
    destroy: function(callbackSuccess) {
        let carrito = this;
        $.ajax({
            url: `${carrito.__rootURL()}api/empty/${carrito.__carType}`,
            type: 'POST',
            beforeSend: function () {
                try {
                    load();
                } catch (e) { }
                //console.log('Vaciando carrito');
            },
            success: function (data) {
                if(!data.error) {
                    carrito.__content.token = data.token;
                    carrito.__content.products = data.productos;
                    carrito.__content.quantity = data.cantidad;
                    carrito.__content.subtotal = data.subtotal;
                    carrito.__content.impuestos = data.impuestos;
                    carrito.__content.total = data.total;
                    callbackSuccess();
                } else {
                    Alert.error('Parece que se ha presentado un problema mientras se vaciaba el carrito de compras. Por favor, intenta nuevamente luego de unos minutos.');
                }
            },
            complete: function () {
                try {
                    $('.tnd-cart-cantity').html(carrito.__content.quantity);
                } catch (e) { }
            },
            error: function () {
                Alert.error('Parece que se ha presentado un problema mientras se vaciaba el carrito de compras. Por favor, intenta nuevamente luego de unos minutos.');
                try {
                    $('.tnd-cart-cantity').html(0);
                } catch (e) { }
            }
        });
    },
    print: function () {
        console.dir(this);
    }
}
Object.freeze(Cart);

$(document).ready(function() {
    Cart.load();
    $('body').on('click', 'a.modalCarrito-replace', function(e) {
        e.preventDefault();
        let product = null;
        let request = $(this).attr('data-target');
        let carritoType = $(this).attr('data-type');
        let carritoToken = $(this).attr('data-token');
        try {
            product = JSON.parse(atob($(this).attr('data-toggle')));
        } catch (e) {
            Alert.error('Parece que se ha presentado un problema mientras se reemplazaba el producto. Por favor, intenta nuevamente luego de unos minutos.');
        }
        $.ajax({
            url: `${Cart.__rootURL()}api/replace/${carritoType}/product`,
            type: 'POST',
            data: {
                token: carritoToken,
                lastProduct: request,
                product: product,
            },
            beforeSend: function () {
                try {
                    load();
                } catch (e) { }
            },
            success: function (data) {
                if(!data.error) {
                    Cart.load();
                    // Alert.addCart(product, 'Tu producto ha sido agregado con éxito. Puedes seguir tu proceso de compra o ver más productos.',`${Cart.__rootURL()}proceso-de-compra?utm_source=catalogo&utm_medium=modal-agregar-producto&utm_campaign=agregar-producto&utm_content=carrito`);
                    Alert.addCart(product, 'Tu producto ha sido agregado con éxito. Puedes seguir tu proceso de compra o ver más productos.',`${Cart.__rootURL()}proceso-de-compra`);
                } else {
                    Alert.error('Parece que se ha presentado un problema mientras se reemplazaba el producto. Por favor, intenta nuevamente luego de unos minutos.');
                }
            },
            complete: function () {
                try {
                    loaded();
                    $('.tnd-cart-cantity').html(carrito.__content.quantity);
                } catch (e) { }
            },
            error: function () {
                Alert.error('Parece que se ha presentado un problema mientras se vaciaba el carrito de compras. Por favor, intenta nuevamente luego de unos minutos.');
                try {
                    $('.tnd-cart-cantity').html(0);
                } catch (e) { }
            }
        });

        Cart.destroy(function () {
            switch (request.clase) {
                case 'CartProduct':
                    Cart.add(new CartProduct(request.producto.section, request.producto.product, request.producto.sku, request.producto.token, request.producto.quantity));
            }
        });
        Alert.close($(this).data('.modalTienda'));
    });
    $('header').on("click", ".tnd-cart, .tnd-cart-header", function(e) {
        e.preventDefault();
        let url = $(this).attr('data-target') || '';
        window.location.href = url.length ? url : `${Cart.__rootURL()}proceso-de-compra`;
    });
    $('header').on("click", ".tnd-tracking", function(e) {
        e.preventDefault();
        let url = $(this).attr('data-target') || '';
        window.location.href = url.length ? url : 'https://miclaro.com.ec/trackingclaro?utm_source=claro_tienda&utm_medium=tienda&utm_campaign=tracking';
    })

});