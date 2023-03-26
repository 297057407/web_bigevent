$(function () {
    // 请求分类列表
    $.ajax({
        url: '/my/article/cates',
        method: 'GET',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取分类列表失败')
            }
            // 模板引擎渲染下拉列表
            let str = template('get_list', res)
            $('[name=cate_id]').html(str)
            // 动态渲染 需要让layui监听到
            layui.form.render()
        }
    })
    // 初始化富文本编辑器 只要导入html结构和相应的js 即可挂载此函数
    initEditor()
    // 实现图片基本裁剪
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
    // 选择图片
    $('#img_choose').click(() => {
        $('#file_choose').click()
    })
    // 获取文件选择 的change事件
    $('#file_choose').change(function (e) {
        if (e.target.files.length === 0) {
            return layui.layer.msg('请选择图片')
        }
        let file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 发布文章
    function publish(fd) {
        $.ajax({
            url: '/my/article/add',
            method: 'POST',
            data: fd,
            // 向服务器提交FormData格式数据 要加下面两个配置项
            contentType: false,
            processData: false,
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                console.log(res);
                layui.layer.msg(res.message,{time : 2000},()=> {
                    location.href = './article_list.html'
                })
                // 发布成功后跳转到文章列表
                
            },
        })
    }
    let state = undefined
    $('#fabu').click((e) => {
        state = '已发布'
    })
    $('#caogao').click((e) => {
        state = '草稿'
    })
    $('#pub_form').submit(function (e) {
        let t = undefined
        e.preventDefault()
        let fd = new FormData($(this)[0])
        fd.append('state', state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob)
                publish(fd)
            })
    })

})