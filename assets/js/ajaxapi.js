// ajax配置对象
// 注意：每次调用$.get()或$.post()或$.ajax()的时候
// 会先调用ajaxPrefilter这个函数,可以通过这个函数得到ajax的配置对象
// 便于维护 简化代码
$.ajaxPrefilter(function (options) {

    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // 为有权限的接口统一加headers
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
        options.complete = (res) => {
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 强制清空token
                localStorage.removeItem('token')
                // 强制跳转到登录页
                location.href = './login.html'
            }
        }
    }
})