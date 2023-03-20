$(function () {
    // 登录注册切换
    $('.reg_box').hide()
    $('#link_reg').click(() => {
        $('.log_box').hide()
        $('.reg_box').show()
    })
    $('#link_log').click(() => {
        $('.reg_box').hide()
        $('.log_box').show()
    })
    // 增加表单验证规则 
    // 获取form中的对象
    let form = layui.form
    let layer = layui.layer
    form.verify({
        // 自定义一个校验规则
        uname: [/^[\S]{6,12}$/, '账号应为6~12位且不包含空格'],
        pwd: [/^[\S]{6,12}$/, '密码应为6~12位且不包含空格'],
        repwd: (value) => {
            // 比较两次密码是否正确
            let pwdStr = $('.reg_box [name=password]').val()
            if (pwdStr !== value) {
                return '两次密码不一致'
            }
        }
    })
    // 实现注册功能
    $('#form_reg').submit((e) => {
        e.preventDefault()
        let name = $('#form_reg [name=username]').val()
        let word = $('#form_reg [name=password]').val()
        $.post('/api/reguser', {
            username: name, password: word
        }, (res) => {
            if (res.status !== 0) {
                return layer.msg(res.message, { icon: 2 });
            }
            layer.msg(res.message, { icon: 1 });
            $('#link_log').click()
            $('#form_reg [name=username]').val('')
            $('#form_reg [name=password]').val('')
            $('#form_reg [name=repassword]').val('')
        })
    })
    // 实现登录功能
    $('#form_log').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 2 });
                }
                layer.msg(res.message, { icon: 1 ,time : 2000},() => {
                    localStorage.setItem('token',res.token)
                    location.href = './index.html'
                })
                
            }
        })
    })
})