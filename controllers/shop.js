const fs = require('fs');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  const itemsPerPage = ITEMS_PER_PAGE;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(
      numProducts => {
        totalItems = numProducts;
      return Product.find()
       .skip((page - 1) * itemsPerPage)
       .limit(itemsPerPage)
      })
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        totalProducts: totalItems,
        currentPage: page,
        hasNextPage: page * itemsPerPage < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / itemsPerPage)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  const itemsPerPage = ITEMS_PER_PAGE;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(
      numProducts => {
        totalItems = numProducts;
      return Product.find()
       .skip((page - 1) * itemsPerPage)
       .limit(itemsPerPage)
      })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        totalProducts: totalItems,
        currentPage: page,
        hasNextPage: page * itemsPerPage < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / itemsPerPage)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    //.execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  req.user
    .populate('cart.items.productId')
    //.execPopulate()
    .then(user => {
      products = user.cart.items;
      total = 0;
      products.forEach(product => {
        total += product.quantity * product.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(product => {
          return {
            name: product.productId.title,
            description: product.productId.description,
            amount: product.productId.price * 100,
            //currency: 'usd',
            currency: 'inr',
            quantity: product.quantity
          };
        }),
        success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
        //cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
      });

    })
    .then(session => {  
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total,
        sessionId: session.id
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  req.user.populate('cart.items.productId')
    //.execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.postOrder = (req, res, next) => {
  req.user.populate('cart.items.productId')
    //.execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
   .then(order => {
      if (!order) {
        return next(new Error('Order not found.'));
      }
      if (order.user.userId.toString()!== req.user._id.toString()) {
        return next(new Error('Unauthorized Access.'));
      }
  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join('data', 'invoices', invoiceName);
  
  //PDF generation on fly starts here
  const pdfDoc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);

  pdfDoc.fontSize(23).text('Invoice', { align: 'center', underline: true });
  pdfDoc.text(`------------------------------------------------------`);
  pdfDoc.fontSize(21).text(`Order Number: ${order._id}`);
  //pdfDoc.text(`Date: ${order.createdAt.toISOString().split('T')[0]}`);
  let totalPrice = 0;
  order.products.forEach(product => {
    totalPrice += product.quantity * product.product.price;
    pdfDoc.fontSize(16).text(`${product.product.title} - ${product.quantity} x $${product.product.price}`);
  });
  pdfDoc.fontSize(20).text(`Total: $${totalPrice}`);

  pdfDoc.end();
  //For Small file size preloading data of a file (like less than 1MB)
  // fs.readFile(invoicePath, (err, data) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   res.setHeader('Content-Type', 'application/pdf');
  //   res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`); //will show the pdf file inline in the browser
  //   //res.setHeader('Content-Disposition', `attachment; filename=${invoiceName}`);
  //   res.send(data);
  //   });

  //For Large file size used streaming of data of a file (like more than 1MB)
  // const file = fs.createReadStream(invoicePath);
  // res.setHeader('Content-Type', 'application/pdf');
  // res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
  // file.pipe(res);
  })
   .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  });
};
