// 获取地址栏的get字符串
function url_get_query(name)
{
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";	// 默认返回空
}

// 定义路径, 目的能够兼容node-webkit
function url_path_def(path) 
{
    a_base = url_get_query('fssrv');
    
    return a_base + path;
}

// login相关配置
var g_login_main = "editor_main.html" + "?fssrv=" + url_get_query('fssrv');
var g_editor_main = "editor-md.html" + "?fssrv=" + url_get_query('fssrv');

// 获取文件列表
var g_login_auth = url_path_def("/auth/login");
var m_editor_flist = url_path_def("/editor/file_list");
var m_editor_floper = url_path_def("/editor/flist_oper");	// 文件列表操作
var m_url_fileget = url_path_def("/editor/file_get");
var m_url_filesave = url_path_def("/editor/file_save");
var m_url_imgsave = url_path_def("/editor/img_save");
