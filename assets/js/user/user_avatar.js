$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 上传按钮功能实现
    $('#btn_choose').click(() => {
        $('#btn_choose_img').click()
    })
    // 更新上传后的照片
    $('#btn_choose_img').change((e) => {
        let files = e.target.files

        if (files.length === 0) {
            return layui.layer.msg('请选择图片')
        }
        // 拿到用户选择的文件
        let file = files[0]
        // 将文件转化为地址
        var newImgURL = URL.createObjectURL(file)
        // 重新设置路径并初始化
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 将头像上传到服务器
    $('#btn_updata').click(() => {
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            //  base64 格式的字符串可以避免不必要的图片请求 但代码体积变大 小图片适合用
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar : dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新头像失败')
                }
                // 若成功则调用父级的更新信息方法
                window.parent.getInfo()
                layui.layer.msg('更新头像成功')
            }
        })
    })
})
