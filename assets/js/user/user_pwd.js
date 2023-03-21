$(function () {
    layui.form.verify({
        pwd: [/^[\S]{6,12}$/, '密码应为6~12位且不包含空格'],
        newPwd: (str) => {
            let pwdStr = $('input[name=oldPwd]').val()
            if (str === pwdStr) {
                return '新密码不能和原密码一致'
            }
        },
        rePwd: (str) => {
            let pwdStr = $('input[name=newPwd]').val()
            if (str !== pwdStr) {
                return '两次输入的新密码不一致'
            }
        }
    })
    // 表单提交更新密码功能实现
    $('.layui-form').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url : '/my/updatepwd',
            method : 'POST',
            data : $(this).serialize(),
            success : (res)=> {
                if(res.status !== 0 ) {
                    return layui.layer.msg(res.message) 
                }
                layui.layer.msg(res.message) 
                // 重置表单 原生dom有reset()方法
                $(this)[0].reset()
            }
        })
    })
})