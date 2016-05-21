
// 处理登录流程
function login_submit_proc(){
	var uname = $.trim($("#username").val());
	var pwd = $.trim($("#password").val());
	
	if (uname == "" || pwd == "") {
		alert("用户名或密码不能为空!");
		return;
	}
	
	serialize_form = $("#manager_login").serialize();
	$.ajax({
		url: g_login_auth,
		type: "POST",
		data: serialize_form,
		success: function(data){
			if (data.code ==0) {
				var m_next = url_get_query('next');
				var m_pop = url_get_query('pop');
				if (m_next) {
					window.location.href = m_next;
				}else if(m_pop){
					window.close();
				}
				else {
					window.location.href = g_login_main;
				}
			}
			else {
				$("#password").val('').focus();
				alert("用户名或密码不正确!");
			}
		}
	});
}
