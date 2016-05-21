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
	return url_get_query('url_base') + path;
}

// login相关配置
var g_login_auth = url_path_def("/auth/login");
var g_login_main = url_path_def("editor_main.html");

// 获取文件列表
m_editor_flist = url_path_def("/editor/file_list");

