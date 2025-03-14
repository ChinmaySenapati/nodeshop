exports.get404 = (req,res,next) => {
    //res.status(404).render('404', {pageTitle: 'Page Not Found',  path:"error"}); sameoutput no change with below path change
    res.status(404).render('404', {pageTitle: 'Page Not Found',  path:"/path"});
};