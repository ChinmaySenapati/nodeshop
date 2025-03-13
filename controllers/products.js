const products = [];

exports.getAddProduct = (req,res,next) => {
    res.render(
        'add-product', 
        { pageTitle: "Add Product", 
        path: '/admin/add-product', 
        activeAddProduct: true, 
        productCSS: true, 
        formCSS: true
    });
};

exports.postAddProduct = (req, res, next) => {
    console.log(req.body)
    products.push({ title: req.body.title });
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    // console.log('shop.js', adminData.products);
    // const products = adminData.products;
    res.render(
        'shop', 
        { prods: products, 
        pageTitle: 'Shop', 
        path: '/', 
        hasProducts: products.length > 0, 
        activeShop: true, 
        productCSS: true 
    });
};