$(function () {
    // 定义一个美化时间的template过滤器
    template.defaults.imports.dateFormat = (date) => {
        return ((new Date(date)).toLocaleString())
    }
    let p = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    // 渲染分页功能
    function render(total) {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'page_box', //注意，这里的 test1 是 ID，不用加 # 号 
            count: total,//数据总数，从服务端得到
            limit: p.pagesize,
            curr: p.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 6, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                p.pagenum = obj.curr
                p.pagesize = obj.limit
                //首次不执行 (如果通过点击的话就执行)
                if (!first) {
                    //do something
                    init_table()
                }
            }
        });
    }
    // 初始化内容
    function init_table() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: p,
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('获取内容失败')
                }
                let str = template('art_list', res)
                $('tbody').html(str)
                render(res.total)
            }
        })
    }
    init_table()
    // 初始化分类列表
    function init_list() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('获取分类失败')
                }
                let str = template('get_list', res)
                $('[name=cate_id]').html(str)
                // layui渲染后未发现动态添加的元素 所以重新渲染一下
                layui.form.render()
            }
        })
    }
    init_list()
    // 实现筛选功能
    $('#btn_sel').click((e) => {
        e.preventDefault()
        p.cate_id = $('[name=cate_id]').val()
        p.state = $('[name=state]').val()
        init_table()
    })
    // 实现删除功能
    $('body').on('click', '.del_article', function () {
        //eg1
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, (index) => {
            //do something
            // 根据删除按钮的个数判断页面是否还有数据
            let len = $('.del_article').length
            $.ajax({
                url: '/my/article/delete/' + $(this).attr('data-id'),
                method: 'GET',
                success: (res) => {
                    if (len === 1 && p.pagenum > 1) {
                        p.pagenum -= 1
                    }
                    init_table()
                    return layui.layer.msg(res.message)
                }
            })
            layer.close(index);
        });
    })
    // 实现编辑功能
    $('body').on('click', '.edit_article', function () {
        // 打开一个窗口
        let open1 = layer.open({
            type: 1,
            area: ['1200px', '600px'],
            content: $('.edit_open').html() //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        });

        // 初始化弹出框
        // 1. 初始化图片裁剪器
        var $image = $('.image')
        // 2. 裁剪选项
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
        $image.cropper(options)
        // 初始化富文本编辑器
        initEditor()
        // 要再渲染一下
        layui.form.render()

        // 初始化弹出框内容
        $.ajax({
            url: '/my/article/' + $(this).attr('data-id'),
            method: 'GET',
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layui.msg('数据获取失败')
                }
                let data = res.data
                // 给表单元素赋值
                layui.form.val('edit_open', {
                    Id: data.Id,
                    title: data.title,
                    content: data.content,
                    cate_id: data.cate_id,
                })
                // 初始化图片
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', 'http://api-breakingnews-web.itheima.net' + data.cover_img)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域

                // 1、如果当前页面只有一个富文本编辑器：
                // 获取内容：tinyMCE.activeEditor.getContent()
                // 设置内容：tinyMCE.activeEditor.setContent(“需要设置的编辑器内容”)

                // 2、如果当前页面有多个编辑器（下面的“[0]”表示第一个编辑器，以此类推）：
                // 获取内容：tinyMCE.editors[0].getContent()
                // 设置内容：tinyMCE.editors[0].setContent(“需要设置的编辑器内容”)
                // 初始化富文本编辑器内容
                tinyMCE.activeEditor.setContent(data.content)
                // tinyMCE.editors[0].setContent(data.content)
                // 将blob转化为图片
                // let binaryData = [];
                // binaryData.push(data.cover_img);
                // objectURL = window.URL.createObjectURL(new Blob(binaryData));
                // let newobjectURL = objectURL.slice(5)
            }
        })
        //初始化分类列表   
        init_list()
        // 编辑中选择封面按钮
        $('.img_choose').click(() => {
            $('.file_choose').click()
        })
        // 选择图片并更换
        $('.file_choose').change((e) => {
            var file = e.target.files[0]
            var newImgURL = URL.createObjectURL(file)
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
        })
        // 提交修改
        let state = '已发布'
        // 已发布或者存草稿
        $('.fabu').click(() => {
            state = '已发布'
        })
        $('.caogao').click(() => {
            state = '草稿'
        })
        $('.pub_form').submit((e) => {

            e.preventDefault()
            // 将表格内容转化为FormData数据
            let fd = new FormData($('.pub_form')[0])
            fd.append('state', state)
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                    fd.append('cover_img', blob)
                    // 提交数据
                    post_data(fd, open1)
                })
        })
    })
    // 编辑功能时向服务器提交数据
    function post_data(fd, open) {
        $.ajax({
            url: '/my/article/edit',
            method: 'POST',
            data: fd,
            // 向服务器提交FormData格式数据 要加下面两个配置项
            contentType: false,
            processData: false,
            success: (res) => {
                layui.layer.close(open)
                if (res.status !== 0) {
                    return layui.layer.msg('修改失败')
                }
                // 重新渲染内容
                init_table()
                return layui.layer.msg('修改成功')
            }
        })
    }
})
