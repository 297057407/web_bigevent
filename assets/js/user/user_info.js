$(function() {
    // 表单格式验证
    layui.form.verify({
        nickname : [/^[\S]{1,6}$/,'昵称为1~6个字符']
    })
    // 获取用户信息
    function init_info() {
        $.ajax({
         url : '/my/userinfo',
         method : 'GET',
         success : (res) => {
            if(res.status !== 0) {
                return layui.layer.mes(res.message,{icon : 2})
            }
            // layui提供的表单赋值
            layui.form.val('user_info',res.data)
            // $('input[name=username]').val(res.data.username)
            // $('input[name=nickname]').val(res.data.nickname)
            // $('input[name=email]').val(res.data.email)
         } 
        })
    }
    init_info()
    // 重置按钮功能实现
    $('button[type=reset]').click((e) => {
        e.preventDefault()
        init_info()
    })
    // 更新信息功能
    $('.layui-form').submit(function(e) {
        e.preventDefault()
        // 发起更新请求
        $.ajax({
            url : '/my/userinfo',
            method : 'POST',
            data : $(this).serialize(),
            success : (res) => {
                if(res.status !== 0) {
                    return layui.layer.msg('更新失败')
                }
                layui.layer.msg('更新成功')
                // 同步页面的昵称等信息
                // 调用父级的获取并更新昵称头像的方法
                // iframe调用父级的方法
                window.parent.getInfo()
            }
        })
    })
})