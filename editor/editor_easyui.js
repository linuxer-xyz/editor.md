/*  此文件用于初始化easyui相关的变量和接口 */

var m_easy_flobj = "";
var m_tab_cnt = 0;

function easyui_tab_new() {
    m_tab_cnt++;
    a_title = "new" + m_tab_cnt;

    
    
    $('#id-ui-table').tabs('add',{
        title: a_title,
        height: '800',
        content: '<iframe style="width:100%;" frameborder=0 height=800 src=' + g_editor_main + '&fsname=' + a_title + '></frame>',
        closable: true
    });		
    
    alert(a_title);
            
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
	easyui_tab_addmd(node.id);
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

}

        
$(editor_easyui_init)
