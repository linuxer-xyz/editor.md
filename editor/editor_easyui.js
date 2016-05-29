/*  此文件用于初始化easyui相关的变量和接口 */

var m_easy_flobj = "";
var m_tab_cnt = 0;



// 创建新的标签
function easyui_tab_new() {
    m_tab_cnt++;
    a_title = "new" + m_tab_cnt;
    
    a_name = prompt("请输入文件名:");
    if (a_name) {
        if (a_name != "") {
            a_title = a_name;
        }
    } else {
        return;
    }
    
    $('#id-ui-table').tabs('add',{
        title: a_title,
        height: '800',
        content: '<iframe style="width:100%;" frameborder=0 height=800 src=' + g_editor_main + '&fsname=' + a_title + '></frame>',
        closable: true
    });		
    
            
}

// 打开已有标签
function easyui_tab_open(a_title) {    
	var a_tab = $('#id-ui-table').tabs('getTab', a_title);
	var a_sub = "";
	var a_page = "";
	
	// 如果当前tab已经被打开, 聚焦并返回
	if (a_tab) {
		$('#id-ui-table').tabs('select', a_title)
		return;
	}
	
	// 计算 sub
	a_index = a_title.lastIndexOf(".")
	if (a_index == -1) {
		a_sub = "";
	} else {
		a_sub = a_title.substr(a_index);
	}
	
	// 持续名对应的编辑器
	if (a_sub == ".md" ) {
		a_page = g_editor_main;
	}
	
	if (a_page == "") {
		if (!confirm("强制用markdown编辑器?")) {
			return;
		}
		
		a_page = g_editor_main;
	}
	
    $('#id-ui-table').tabs('add',{
        title: a_title,
        height: "auto",
        content: '<iframe style="width:100%;" frameborder=0 height=800 src=' + a_page + '&fsname=' + a_title + '></frame>',
        closable: true
    });
    
}


/* 文件列表模块 */
// 重新加载菜单
function easyui_tab_load() {
    var node = $('#id-ui-fl').tree('getSelected');
    var g_cur_id = "";
    
    if (node) {
        g_cur_id = node.id;
    }
    
    $.get(
        m_editor_flist + "?dataonly=1",
        function(md) {
            $('#id-ui-fl').tree({md});
            
            if (g_cur_id != "") {
                // @TODO 未完成，不能切换到此目录中
                node =  $('#id-ui-fl').tree('find', g_cur_id);
                par = $('#id-ui-fl').tree('getParent', node.target);
                 $('#id-ui-fl').tree('expandAll', par.target);
                 par.state = "open";
                 // $('#id-ui-fl').tree('reload');
                console.log(par.target);
            }           
        }
    );
}

// 文件列表树单击
function easyui_fltree_click(node) {
    if (node.id != "") {
        if (!node.dir) {
        	easyui_tab_open(node.id);
        }
    }
}


/* 面板模块 */
// 面板变化时候的处理
function easyui_event_frmchg(region)
{
     $('#id-ui-table').tabs('resize', {});
}

// 展开动作
function flmenu_do_expand() {
    var node = $('#id-ui-fl').tree('getSelected');
    $('#id-ui-fl').tree('expand',node.target);
}


// 折叠动作
function flmenu_do_collapse() {
    var node = $('#id-ui-fl').tree('getSelected');
    $('#id-ui-fl').tree('collapse',node.target);
}

// 刷新文件夹
function flmenu_do_refesh() {
    easyui_tab_load();  
}

// 通用的新增操作
function flmenu_do_newoper(type, dir, name) {

    var a_oper = {oper: type, curdir: dir, name: name};
    $.post (
    	m_editor_floper,
    	a_oper,
    	function (ret) {
    		if (ret.code == -2) {
    			// 未登录
    		}
    		
    		if (ret.code == 0) {
    			// 添加成功, 重新刷新
    			flmenu_do_refesh();
    		} 
    	}
    );
}


// 新增文件夹
function flmenu_do_newdir() {
    var node = $('#id-ui-fl').tree('getSelected');
    if (!node.dir) {
        return
    } 
    
    a_name = prompt("请输入文件夹名:");
    if (!a_name) {
    	return
    }
    
    if (a_name == "") {
    	return;
    	alert("文件空, 添加失败");
    }
    
    flmenu_do_newoper("adddir", node.dir, a_name);
}

// 新增markdown文件
function flmenu_do_newmd() {
    var node = $('#id-ui-fl').tree('getSelected');
    if (!node.dir) {
        return
    } 
    	
    a_name = prompt("请输入文件名:");
    if (!a_name) {
    	return
    }
    
    if (a_name == "") {
    	return;
    	alert("文件空, 添加失败");
    }
    
    console.log("addfile", node.dir, a_name + ".md");
    flmenu_do_newoper("addfile", node.dir, a_name + ".md");
}

// 删除文件
function flmenu_do_remove() {
    var node = $('#id-ui-fl').tree('getSelected'); 
    
    if (!node) {
        return;
    }
    
    console.log("del", node.dir, node.id);
    flmenu_do_newoper("del", node.dir, node.id);
   
}



/* 功能列表菜单模板 */
// 双击处理
function dlfun_menu_dlclick(index,field,value){
    if (index == 0){
        window.location.href = "login.html"
    }

    if (index == 1){
        window.location.href = "login.html"
    }
    
    if (index == 2) {
        window.open("login.html", value);
    }
}

// 初始化菜单
function dlfun_menu_init() {
	$('#id-ui-user').datalist({
	                            'title':'',
	                            'data': [
	                                        {"text":"切换用户"},
	                                        {"text":"退出登录"}, 
	                                        {"text":"新建登录"}
	                                     ],
	                            'onDblClickCell': dlfun_menu_dlclick
	                          });
}

/* 初始化模块 */
// 初始化easyui
function editor_easyui_init() 
{
	$('#id-ui-fl').tree({
		url: m_editor_flist + "?dataonly=1",
		// url: 'tree_data1.json',
		method: 'get',
		onDblClick: easyui_fltree_click,
        onContextMenu: function(e, node){
		    e.preventDefault();
		    // select the node
		    $('#id-ui-fl').tree('select', node.target);
		    // display context menu
		    $('#easyui-id-flmenu').menu('show', {
			    left: e.pageX,
			    top: e.pageY
		    });
	    }
	
	});
	
    dlfun_menu_init();
	$('#ui-id-frm').layout({'onExpand': easyui_event_frmchg});
    $('#ui-id-frm').layout({'onCollapse': easyui_event_frmchg});
}

        
$(editor_easyui_init)
