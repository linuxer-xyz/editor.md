// markdown编辑器
var g_md_editor = null;

// markdown键盘映射
var g_md_keymap =  {
    "Ctrl-S": function(cm) {
        $("#id-editor-save").click();
    },

    "Ctrl-N": function(cm) {
        $("#id-editor-new").click();
    },        
};


function md_ext_setdata(data) 
{
	g_md_editor.setMarkdown(data);
	
}


function md_ext_getdata() 
{
	return g_md_editor.getMarkdown();
}

function extmd_load_cback() {
	/* 触发保存数据流程 */
	$("#id-editor-save").click(editor_proc_filesave);
	
	/* 触发打开文件的流程 */
	$("#id-editor-new").click(editor_proc_filenew);
	
	g_mdext_set = md_ext_setdata;
	g_mdext_get = md_ext_getdata;
	
	/* 默认打开文件  */
	var a_name = url_get_query("fsname");
	if (a_name != "") {
	    editor_ajax_getfile(a_name);
	}
}


function md_paste_event(e) {
	var clipboardData = e.clipboardData,//谷歌
		i = 0,
		items, item, types;

	if( clipboardData ){
		items = clipboardData.items;
		if(!items){
		    return;
		}
		types = clipboardData.types || [];
		for( ; i < types.length; i++ ){
		    if( types[i] === 'Files' ){

		        item = items[i];
				if( item && item.kind === 'file' && item.type.match(/^image\//i) ){
					var reader = new FileReader();
					reader.onload = function(e){
						a_data = {paste : 1, 'editormd-image-file': e.target.result};
						var img = new Image();
						img.src = e.target.result;
						console.log(img);
						$.post(
							m_url_imgsave,
							a_data,
							function(ret) {
								g_md_editor.insertValue("![" + "" + "](" + ret.url + ")");
								
							}
						);
					};
					reader.readAsDataURL(item.getAsFile());
				}				        
		        break;
		    }
		}
	 }
}

var g_md_load_cback = extmd_load_cback;

// markdown扩展加载 
function md_ext_load() {
    g_md_editor = editormd("id-editor-md", 
        {
            maximize: true,
            width   : "100%",
            height  : "750",
            // autoHeight : true,
            syncScrolling : "single",
            saveHTMLToTextarea : true,    // 保存 HTML 到 Textarea
            editorTheme : "pastel-on-dark",
            codeFold : true,
            saveHTMLToTextarea : true,    // 保存 HTML 到 Textarea
            searchReplace : true,
            htmlDecode : "style,script,iframe|on*",            // 开启 HTML 标签解析，为了安全性，默认不开启    
            emoji : true,
            taskList : true,
            tocm            : true,         // Using [TOCM]
            tex : true,                   // 开启科学公式TeX语言支持，默认关闭
            flowChart : true,             // 开启流程图支持，默认关闭
            sequenceDiagram : true,       // 开启时序/序列图支持，默认关闭,
            imageUpload : true,
            imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
            imageUploadURL : m_url_imgsave,
            imageShowUrl		: m_url_imgget + "?name=",
                    
            /* 自定义工具栏 */
            toolbarIcons : function() {
                a_tool_cust = ['fnew', "|", 'fsave', "|"];
                a_tool_bar = a_tool_cust.concat(editormd.toolbarModes['full']);

                return a_tool_bar;
            },
            
            toolbarCustomIcons: {
                fnew : '<i id="id-editor-new" ">N</i>',
                fsave : '<i id="id-editor-save" ">S</i>'
            },
            
            path    : "libs/editor.md/lib/",
            onload: function () {
                this.setMarkdown("hexxllo");

				this.addKeyMap(g_md_keymap);
				
				if (g_md_load_cback) g_md_load_cback();
            }
        }
    );
    
    // $("#id-editor-md").on('paste', md_paste_event);
    document.getElementById('id-editor-md').addEventListener('paste', md_paste_event);
}




$(md_ext_load)
