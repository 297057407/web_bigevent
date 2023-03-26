$(function () {
    // 初始化文章列表
    function init_article_list() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('获取数据失败')
                }
                else {
                    // let data = res.data
                    // $('.layui-table tbody').html('')
                    // $.each(data, (index, value) => {
                    //     $('.layui-table tbody').append(`<tr>
                    //     <td>${value.name}</td>
                    //     <td>${value.alias}</td>
                    //     <td><button type="button" class="layui-btn layui-btn-xs">编辑</button>
                    //         <button type="button" class="layui-btn layui-btn-warm layui-btn-xs">删除</button>
                    //     </td>
                    // </tr>`)
                    // });
                    // 使用模板引擎渲染
                    let str = template('tpl-table',res)
                    $('.layui-table tbody').html(str)
                }
            }
        })
    }
    init_article_list()

    let open1 = null
    // 添加按钮弹出添加页面功能实现
    $('#btn_add').click(()=>{
        open1 = layer.open({
            title: '添加文章分类',
            type: 1,
            content: $('#cate_add').html(),
            area: ['500px', '250px']
          });   
    })   
    // 添加分类表单提交
    // 通过代理 为动态添加的DOM添加事件
    $('body').on('submit','#add_form',function(e) {
        e.preventDefault()
        $.ajax({
            method : 'POST',
            url : '/my/article/addcates',
            data : $(this).serialize(),
            success : (res) => {
                if(res.status !== 0) {
                    return layui.layer.msg('添加失败')
                }
                init_article_list()
                layui.layer.close(open1)
            }
        })
    })
    let open2 = null
    // 实现编辑按钮
    $('tbody').on('click','.btn_edit',function(e){
        open2 = layer.open({
            title: '修改文章分类',
            type: 1,
            content: $('#cate_edit').html(),
            area: ['500px', '250px']
          });  
        $.ajax({
            method : 'GET',
            url : '/my/article/cates/' + $(this).attr('data-id'),
            success : function(res){
                layui.form.val('edit',res.data)
            }
        })
    })
    // 确认修改表单提交
    $('body').on('submit','#edit_form',function(e){
        e.preventDefault()
        $.ajax({
            method : 'POST',
            url : '/my/article/updatecate',
            data : $(this).serialize(),
            success : function(res) {
                if(res.status !==0) {
                    return layui.layer.msg('修改失败')
                }
                layui.layer.msg('修改成功')
                init_article_list()
                layui.layer.close(open2)
            }
        })
    })
    // 删除功能
    $('tbody').on('click','.btn_del',function(e){
        layui.layer.confirm('确定删除?', {icon: 3, title:'提示'}, (index) => {
            $.ajax({
                method : 'GET',
                url : '/my/article/deletecate/' + $(this).attr('data-id'),
                success : (res) => {
                    if(res.status !==0) {
                        return layui.layer.msg('删除失败')
                    }
                    layui.layer.msg('删除成功')
                    init_article_list()
                    layui.layer.close(index);
                }
            })
          });
    })
})