$(function () {
    let layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);

    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    // 为文件选择框绑定 change 事件
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        let filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择照片')
        }

        // 1拿到用户选择的文件
        let file = e.target.files[0];
        // 2.将文件,转化为路径
        // 这是一个临时URL地址是js通过获取到的文件转换的临时url地址提供给内部调用的
        let newImgURL = URL.createObjectURL(file);
        console.log(newImgURL);
        // 3.重新初始化剪裁区域
        $image
            .cropper('destroy') //销毁就得裁剪区域
            .attr('src', newImgURL)//重新设置图片路径
            .cropper(options)//重新初始化裁剪区域
    })

    // 为确定按钮,绑定点击事件
    $('#btnUpload').on('click', function () {
        console.log(123);
        // 1.要拿到用户裁剪之后的头像
        var dataURL = $image.cropper('getCroppedCanvas', {
            width: 100,
            heigeht: 100
        }).toDataURL('image/png') //将 Canavs 画布上的内容,转化为 base64 格式的字符串
        // 2.调用接口,把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avater: dataURL
            },

            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更改头像失败')
                }
                layer.msg('更改头像成功')
                window.parent.getUserInfo()
            }
        })
    })

})