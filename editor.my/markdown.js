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

var g_md_load_cback = null;

// markdown扩展加载 
function md_ext_load() {
    g_md_editor = editormd("id-editor-md", 
        {
            width   : "90%",
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
            imageUploadURL : "./php/upload.php",
            
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
            
            path    : "editor.md/lib/",
            onload: function () {
                this.setMarkdown("hexxllo");

				this.addKeyMap(g_md_keymap);
				
				if (g_md_load_cback) g_md_load_cback();
            }
        }
    );
}


function md_ext_setdata(data) 
{
	g_md_editor.setMarkdown(data);
}


function md_ext_getdata() 
{
	return g_md_editor.getMarkdown();
}

$(md_ext_load())
