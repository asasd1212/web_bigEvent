$(function () {
    let layer = layui.layer
    let form = layui.form

    initCate()
    //  初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败!')
                }
                // 调用模板引擎,渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                console.log(res);
                // 一定要记得调用 form.render()方法
                form.render();
            }
        })
    }

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');

    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 400 / 592,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);


    // 为选择封面的按钮,绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        let files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件,创建对应的 URL 地址
        let newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') //销毁就得裁剪区域
            .attr('src', newImgURL)//重新设置图片路径
            .cropper(options)//重新初始化裁剪区域
    })


    // 定义文章的发布状态
    let art_state = '已发布';

    // 为存为草稿按钮,绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })


    // 为表单绑定submit 提交事件
    $('#form-pub').on('submit', function (e) {
        // 1.阻止表达你的默认提交行为
        e.preventDefault();
        // 2.基于 form 表单, 快速创建一个 FromData 对象
        let fd = new FormData($(this)[0])//[0]表示转换为原生的 dom 元素对象
        fd.append('state', art_state);
        // 4.将封面裁剪过后的图片,输出为一个文件对象
        $image
            // 通过.cropper('getCroppedCanvas') 方法获得的画布对象可以被认为是一个裁剪后的图像副本，你可以基于这个副本进行各种操作，以满足你的需求。
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容,转化为文件对象
                // 得到文件对象后,进行后续的操作
                // 5.将文件对象,存储到 fd 中
                fd.append('conver_img', blob);
                // 发起 ajax 数据请求
                publishArticle(fd);
            })
        // FormData 对象并不是一个普通的对象，而是一种特殊的对象类型。FormData 对象用于封装表单数据，以便于通过 AJAX 提交表单数据。它提供了一些特殊的方法和属性来处理表单数据。
        // 所以FormData 具有 forEach 方法

        // 定义一个发布文章的方法
        function publishArticle(fd) {
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: fd,
                // 注意:如果想服务器提交的是 FromData 格式的数据,
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('发布文章失败!')
                    }
                    layer.msg('发布文章成功!');
                    // 发布文章成功后,跳转到文章列表页面
                    location.href = '/article/art_list.html'
                }
            })
        }
    })
})