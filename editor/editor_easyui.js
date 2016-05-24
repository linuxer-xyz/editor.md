/*  此文件用于初始化easyui相关的变量和接口 */

var m_easy_flobj = "";
var m_tab_cnt = 0;

// 重新加载菜单
function easyui_tab_load() {
    $.get(
        m_editor_flist + "?dataonly=1",
        function(md) {
            $('#id-ui-fl').tree({md});
        }
    );
}

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
    
    /* 重新加载 */
    easyui_tab_load();
            
}

// 打开已有标签
function easyui_tab_open(a_title) {    
    $('#id-ui-table').tabs('add',{
        title: a_title,
        height: "auto",
        content: '<iframe style="width:100%;" frameborder=0 height=800 src=' + g_editor_main + '&fsname=' + a_title + '></frame>',
        closable: true
    });
    
}


/* 文件列表模块 */
// 文件列表树单击
function easyui_fltree_click(node) {
    if (node.id != "") {
    	easyui_tab_open(node.id);
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
    $.get(
        m_editor_flist + "?dataonly=1",
        function(md) {
            $('#id-ui-fl').tree({md});
        }
    );    
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

// 新增文件
function flmenu_do_newfile() {
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
    
    flmenu_do_newoper("addfile", node.dir, a_name);
}



/* 初始化模块 */
// 初始化easyui
function editor_easyui_init() 
{
	$('#id-ui-fl').tree({
		url: m_editor_flist + "?dataonly=1",
		// url: 'tree_data1.json',
		method: 'get',
		onClick: easyui_fltree_click,
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
	
	$('#ui-id-frm').layout({'onExpand': easyui_event_frmchg});
    $('#ui-id-frm').layout({'onCollapse': easyui_event_frmchg});
}

        
$(editor_easyui_init)
