
// 全局函数
var g_mdext_set = null;
var g_mdext_get = null;

// 文件名字
var m_file_name = null;
var m_file_data = {name: m_file_name, last: "", data: ""};
var m_file_list = {items: []};

// 数据url
var m_url_fileget = "/editor/file_get";
var m_url_filesave = "/editor/file_save";
var m_url_filelist = "/editor/file_list";


// 兼容node-wikit
var m_url_base = getQueryString('url_base');
// m_url_base = "http://192.168.193.123:10000"
if (m_url_base) {
	m_url_fileget = m_url_base + m_url_fileget;
	m_url_filesave = m_url_base + m_url_filesave;
	m_url_filelist = m_url_base + m_url_filelist;	
}

/* 登录处理流程 */
function editor_proc_login() {
    href = 'login.html?pop=1';
    var win = window.open(href, 'login_window', 'height=450,width=780,resizable=yes,scrollbars=yes');
    win.focus();            
}

/* 获取数据流程 */
function editor_proc_getdata() {
    if (!m_file_name) {
        return
    }
	$.get(m_url_fileget + "?name=" + m_file_name, function(md){
		m_file_data = md;
		
		/* 未认证 */
		if (md.code == -2) {
		    editor_proc_login();
		}
		
		if (g_mdext_set) {
			g_mdext_set(m_file_data['data']);
		} else {
			alert(m_file_data['data']);
		}
		
		m_file_name = md.name;
		$("title").html(m_file_name);
            		
	});
}


/* 保存数据流程 */
function editor_proc_filesave() {
	a_new = false;
	/* @TODO 判断数据是否一样, 如果不一样,才保存, 减少对服务器的请求 */
	if (!m_file_name) {
	    m_file_name = prompt("请输入文件名:");
	    a_new = true;
	}
	
	if (!m_file_name) {
	    return;
	}
	
	/* 判断文件是否存在 */
	m_file_data['name'] = m_file_name;
	$("title").html(m_file_name); 
	if (g_mdext_get) {
		m_file_data['data'] = g_mdext_get();
	}
	$.post (
		m_url_filesave, 
		m_file_data,
		function (md) {
			/* 未认证 */
			if (md.code == -2) {
				editor_proc_login();
			}
			
			/* 文件系统被修订 */
			if (md.code == -1) {
				a_ret = confirm("文件已经被修订, 是否强制保存");
				if (a_ret) { 
					m_file_data['last'] = md.last; 
					editor_proc_filesave();
				}
			}
			
			if (md.code == 0) {		
		    	/* 保存成功 */
		    	editor_proc_filelist();
		    	m_file_data['last'] = md.last;
		    }
	        // @TODO: 处理保存结果
		}
	);
}

/* 新文件处理流程 */
function editor_proc_filenew() {
    if (m_file_name) {
    	if (g_mdext_get) {
	        a_editor_data = g_mdext_get();
    	}
    	
        if (a_editor_data != m_file_data['data']) {
            a_ret = confirm("文件已经变动，是否要保存?");
            
            /* 只在文件 */
            if (a_ret) {
                editor_proc_filesave();
            }
        }
    }
    a_name = prompt("请输入文件名:");
    if ((a_name != null) && (a_name != m_file_name)) {
        m_file_name = a_name;
        $("title").html(m_file_name);
        if (g_mdext_set) {
        	g_mdext_set("")
        }
        
        // 打开数据
        editor_proc_getdata();
    }
}


var m_ui_filelist = null;
function editor_file_list(data) {
    Std.main(function(){
        if (m_ui_filelist) {
            m_ui_filelist.clear();
        }
        m_ui_filelist = Std.ui("Tree",{
            renderTo:"#id-editor-list",
            width:300,
            height:'99%',
            checkable:false,
            editable:false,
            droppable:false,
            selectionMode:"item",
            items: data,
            plugins:{
                contextMenu:{
                    items:[
                        {text:"add"},
				        {text:"del"}
                    ]
                }
            }
        });
        
        m_ui_filelist.on("itemClick", function(node,e) { 
            // editor_proc_filesave();
			 if (m_file_name) {
			 	if (g_mdext_get) {
			 		a_editor_data = g_mdext_get();
			 	}
				if (a_editor_data != m_file_data['data']) {
				    a_ret = confirm("文件已经变动，是否要保存?");
				    
				    /* 只在文件 */
				    if (a_ret) {
				        editor_proc_filesave();
				    }
				}
			}
		
            m_file_name = node['opts'].text;
            editor_proc_getdata();
            

        /*@TODO*/});
        
    });
}

// 获取文件列表
function editor_proc_filelist() {
    $.post (
        m_url_filelist,
        m_file_list,
        function (md) {
			/* 未认证 */
			if (md.code == -2) {
				editor_proc_login();
			}
		    
            if (md.code == 0) {
            	editor_file_list(md['data']);
            }

        }
    );
}

function extmd_load_cback() {
	
	
	/* 触发保存数据流程 */
	$("#id-editor-save").click(editor_proc_filesave);
	
	/* 触发打开文件的流程 */
	$("#id-editor-new").click(editor_proc_filenew);
	
	g_mdext_set = md_ext_setdata;
	g_mdext_get = md_ext_getdata;

}

/* 编辑器加载流程 */
function extmd_osload_proc() {	
	editor_proc_filelist();
	g_md_load_cback = extmd_load_cback;
}

$(extmd_osload_proc);
