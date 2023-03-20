$(function () {
    getInfo()
    // 退出按钮功能实现
    $('#btn_logout').click(() => {
        layui.layer.confirm('确定退出?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 将本地token删除
            localStorage.removeItem('token')
            // 跳转到登录页面
            location.href = './login.html'
            layer.close(index);
          });
    })
})
// 获取用户信息
function getInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        // (已写在ajax配置文件中)
        // headers : {
        //     Authorization : localStorage.getItem('token') || '',
        // },
        success: (res) => {
            if (res.status !== 0) {
                return layui.layer.msg(res.message, { icon: 2 })
            }
            // 渲染头像和昵称
            renderTandN(res.data)
        },
        // 防止用户不登陆直接访问主页(已写在ajax配置文件中)
        // complete : (res) => {
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空token
        //         localStorage.removeItem('token')
        //         // 强制跳转到登录页
        //         location.href = './login.html'
        //     }
        // }
    })
}
// 渲染头像和昵称
function renderTandN(user) {
    // 昵称
    let name = user.nickname || user.username
    $('.welcome_span').html(`欢迎  ${name}`)
    // 头像
    if (user.user_pic !== null) {
        $('.touxiang').html(`<img src="${user.user_pic}"> `)
    }
    else {
        $('.touxiang').html(name[0].toUpperCase())

    }

}