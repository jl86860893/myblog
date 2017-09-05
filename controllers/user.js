"use strict";

exports.showRegister = function (req, res, next) {
    // 权限校验，已经登录的用户，就不要再访问这个页面了，直接跳转到首页就行了
    if (req.session.user) {
        return res.redirect('/');
    }

    res.render('register',);
};

exports.doRegister = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let vcode = req.body.vcode;

    let session_vcode = req.session.vcode;

    let regexp0 =  /[A-Za-z0-9_\-\u4e00-\u9fa5]+/;
    if(!regexp0.test(username)){
        return res.json({
            code: '0',
            msg: '用户名不符合规范'
        });
    }

    let regexp1 = /[0-9]{6-9}/;
    if(!regexp1.test(password)){
        return res.json({
            code: '0',
            msg: '密码不符合规范，请输入6-9位数字密码'
        });
    }

    if(session_vcode.toLowerCase() != vcode.toLowerCase()){
        return res.json({
           code: 0,
           msg: '验证码不正确，请重新输入'
        });
    }

    User.getByUsername(username,function (err, result) {
        if (err) {
            return next(err);
        }
        if(result){
            return res.json({
                code: '0',
                msg: '用户名已存在'
            });
        }
        password = `${utility.md5(utility.md5(password+req.app.locals.config.secret))}`;

        let user = new User({
            username,
            password,
            email
        });

        user.save(function (err, result) {
            if (err) {
                return next(err);
            }
            let uid = result.insertId;
            if(uid == 0){
                return res.json({
                    code: '0',
                    msg: '创建失败'
                });
            }
            user.id = uid;

            req.session.user = user;

            res.json({
                code: '1',
                msg: 'success'
            });
        });
    });

    res.redirect('back');
};

exports.showLogin = function (req, res, next) {
    res.render('login');
};

exports.doLogin = function (req, res, next) {
    let username = req.body.username.trim();
    let password = req.body.password.trim();


    let regexp0 =  /[A-Za-z0-9_\-\u4e00-\u9fa5]+/;
    if(!regexp0.test(username)){
        return res.json({
            code: '0',
            msg: '用户名不符合规范'
        });
    }

    let regexp1 = /[0-9]{6-9}/;
    if(!regexp1.test(password)){
        return res.json({
            code: '0',
            msg: '密码不符合规范，请输入6-9位数字密码'
        });
    }

    if(session_vcode.toLowerCase() != vcode.toLowerCase()){
        return res.json({
            code: 0,
            msg: '验证码不正确，请重新输入'
        });
    }

    User.getByUsername(username,function (err, result) {
        if(err){
            return next(err);
        }
        if(!result){
            return res.json({
                code: '0',
                msg: '该用户不存在'
            });
        }
        password = `${utility.md5(utility.md5(password+req.app.locals.config.secret))}`;
        if(result.password != password){
            return res.json({
                code: '0',
                msg:'fail'
            });
        }
        req.session.user = result;
        res.json({
            code: '1',
            msg: 'success'
        });
    });
};

exports.getCaptcha = function (req, res, next) {
    let ary = ccap.get();
    var txt = ary[0];
    var buf = ary[1];
    req.session.vcode = txt;
    res.end(buf);
};

exports.doLogout = function (req, res, next) {
    req.session.user = null;
    res.redirect('/');
};