$(function () {
    let form = layui.form;
    form.verify({
        pwd: [/^\S{6,12}$/, '密码必须6到12位,且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=prePwd]').val()) {
                console.log(123);
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致!'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.msg('更新密码失败')
                }
                layui.msg('更新密码成功!')
                // 重置表单
                // [0]将 这个jquery元素转换为 原生DOM 元素
                // 转换成原生DOM 元素后就可以调用form表单的 reset方法
                // 只有原生BOM DOM 对象才有这个方法
                $('.layui-form')[0].reset()
            }
        })
    })

})