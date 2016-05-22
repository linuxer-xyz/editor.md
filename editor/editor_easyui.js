/*  此文件用于初始化easyui相关的变量和接口 */

var m_easy_flobj = "";
var m_tab_cnt = 0;

function easyui_tab_load() {
    $.get(
        m_editor_flist + "?dataonly=1",
        function(md) {
            $('#id-ui-fl').tree({md});
        }
    );
}

function easyui_tab_new() {
    m_tab_cnt++;
    a_title = "new" + m_tab_cnt;
    
    a_name = prompt("请输入文件名:");
    if (a_name) {
        a_title = a_name;
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


function easyui_tab_addmd(a_title) {    
    $('#id-ui-table').tabs('add',{
        title: a_title,
        height: "auto",
        content: '<iframe style="width:100%;" frameborder=0 height=800 src=' + g_editor_main + '&fsname=' + a_title + '></frame>',
        closable: true
    });
    
}

function easyui_event_click(node) {
    if (node.id != "") {
    	easyui_tab_addmd(node.id);
    }
}

// 面板变化时候的处理
function easyui_event_frmchg(region)
{
     $('#id-ui-table').tabs('resize', {});
}

// 初始化easyui
function editor_easyui_init() 
{
	$('#id-ui-fl').tree({
		url: m_editor_flist + "?dataonly=1",
		// url: 'tree_data1.json',
		method: 'get',
		onClick: easyui_event_click
	});
	
	$('#ui-id-frm').layout({'onExpand': easyui_event_frmchg});
    $('#ui-id-frm').layout({'onCollapse': easyui_event_frmchg});
}

        
$(editor_easyui_init)
