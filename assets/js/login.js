$(function () {
    // 点击"去注册账号"的链接
    $('#link-signup').on('click', function () {
        $('.login-box').hide();
        $('.signup-box').show();
    })

    // 点击"去登录"的链接
    $('#link-login').on('click', function () {
        $('.login-box').show();
        $('.signup-box').hide();
    })

    // 从 layui 中获取form 对象
    let form = layui.form;
    let layer = layui.layer;
    // 通过 form.verify()函数 自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,切不能出现空格'],
        // 校验两次密码是否一直的规则
        repwd: function (value) {
            // 通过心肝拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            let pwd = $('.signup-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致!'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_signup').on('submit', function (e) {
        e.preventDefault();
        let data = { username: $('.signup-box [name=username]').val(), password: $('.signup-box [name=password]').val() }
        $.post('/api/reguser', data, function (res) {
            console.log($('.signup-box [name=username]').val());
            if (res.status !== 0) {
                return layer.msg(res.message);

            }
            layer.msg('注册成功');
            $('#link-login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        console.log('123');
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功');
                // 将登录成功得到的 token 字符串,保存到localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})