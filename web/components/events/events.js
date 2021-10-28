window.dataLayer = window.dataLayer || [];

const EventProduct = function (id, name, price, brand, category, sku = null, section = null, quantity = 1) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.brand = brand;
    this.category = category;
    this.sku = sku;
    this.section = section;
    this.quantity = quantity;
}

const EventPlan = function (id, name,  price, category, sku = null, section = null, quantity = 1) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.brand = 'CLARO';
    this.category = category;
    this.sku = sku;
    this.section = section;
    this.quantity = quantity;
}

const EventGtmHandler = {
    products: [],
    addProduct: function(item) {
        if(item.constructor.name == 'EventProduct' || item.constructor.name == 'EventPlan') {
            this.products.push(item);
        } else {
            throw new Error('invalid type');
        }
    },
    refresh: function() {
        this.products.splice(0, this.products.length);
    },
    gtagTrigger: function (eventName, eventCategory, products = []) {
        try {
            products = products.length > 0 ? products : this.products;
            if(products.length) {
                $(products).each(function (i, item) {
                    gtag('event', eventName, {
                        'event_category': eventCategory,
                        'event_label': `Producto: ${item.constructor.name == 'EventProduct' ? item.name : '(ninguno)'} | Plan: ${item.constructor.name == 'EventPlan' ? item.name : '(ninguno)'} | Tipo: ${item.category ? item.category : '(no especificado)'}  | Detalle: ${item.sku ? item.sku : '(ninguno)'}`,
                        'value': item.price
                    });
                });
            } else {
                gtag('event', eventName, {
                    'event_category': eventCategory
                });
            }
        } catch (e) {   }
    },
    dlTrigger: function(eventName, purchaseToken = null, products = []) {
        let ids = [], contents = [], ga4Items = [], prodNombres = '', categoria = '';
        let total = 0;
        products = products.length > 0 ? products : this.products;
        $(products).each(function (i, product) {
            ids.push(product.id);
            contents.push({
                id: product.id,
                item_price: product.price,
                quantity: product.quantity
            });
            ga4Items.push({
                id: product.id,
                item_id: product.id,
                google_business_vertical: 'retail',
                item_name: product.name,
                item_category: product.category,
                item_brand: product.brand,
                price: product.price,
                currency: 'USD',
                quantity: product.quantity
            });
            categoria += (product.category + (i>0 && i!=products.length-1 ? ' | ' : ''));
            prodNombres += (product.name + (i>0 && i!=products.length-1 ? ' + ' : ''));
            total += Number.parseFloat(product.price);
        });
         try {
            let data = {
                event: eventName,
                content_ids: ids,
                content_name: products.map(function(product) {return product.name;}).join(' | '),
                content_category: products.map(function(product) {return product.category;}).join(' | '),
                content_type: "product",
                value: total,
                currency: "USD",
                contents: contents,
                google_items: ga4Items
            };
            if(purchaseToken)
                data['transaction_id'] = 'purchaseToken';
            if(eventName == 'CompleteRegistration')
                data['status'] = 'complete';
            window.dataLayer.push(data);
            return true;
         } catch (e) {
             return false;
         }
    }
}
Object.freeze(EventProduct);
Object.freeze(EventPlan);
Object.freeze(EventGtmHandler);