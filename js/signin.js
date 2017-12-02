/*
	注册系统
*/

var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var path = require("path");
var infs = [];

http.createServer(function(req, res){
	var dataPost = '';

	var params = url.parse(req.url, true).query;
	var username = params.username;



	/*读取文件*/
	fs.readFile('data.json',function(err,data){
		if(err){
			return console.error(err);
		} else {
			infs = JSON.parse(data);
			console.log("read file successfully");	
		}	
	});

	console.log(req.url);

	if(req.method === 'GET')
	{
		switch(req.url)
		{
			case '/':
			case '/index.html':
					fs.readFile(path.join(__dirname, "../files/signin.html"), function(err, data){
						if(err) {
							res.write("404");
						}
						else {
							res.write(data);
						}
						res.end();
					});
				break;
			case '/style.css':
				fs.readFile(path.join(__dirname, "../files/style.css"), function(err, data){
					if(err) {
						res.write("404");
					}
					else {
						res.write(data);
					}
					res.end();
				});
				break;
			case "/bg3.jpg":
				fs.readFile(path.join(__dirname, "../files/bg3.jpg"), function(err, data){
					if(err) {
						res.write("404");
					}
					else {
						res.write(data);
					}
					res.end();
				});
				break;
			default:
				if(username == "undefined")
				{
					fs.readFile(path.join(__dirname, "../files/signin.html"), function(err, data){
						if(err) {
							res.write("404");
						}
						else {
							res.write(data);
						}
						res.end();
					});
					break;
				}
				else {
					var index = false;
					for(var i = 0; i < infs.length; i++) {
						if(infs[i].name == username) {
							res.write("<!DOCTYPE html>");
							res.write("<html>");
							res.write("<head>");
							res.write("<title>详情</title>");
							res.write("<meta http-equiv='Content-Type' content='text/html;charset=UTF-8'>");
							res.write("<link rel='stylesheet' type='text/css' href='style.css'>");
							res.write("</head>");
							res.write("<body>");
							res.write("<h1>注册成功</h1>");
							res.write("<h2>用户详情</h2>");
							res.write("<div id='inf_block'>");
							res.write("<div id='inf_inline_block'>");
							res.write("<p>用户名: "+infs[i].name+"</p>");
							res.write("<p>学号: "+infs[i].id+"</p>");
							res.write("<p>电话: "+infs[i].phone+"</p>");
							res.write("<p>邮箱: "+infs[i].mail+"</p>");
							res.write("</div>");
							res.write("</div>");
							res.write("</body>");
							res.write("</html>");
							res.end();

							index = true;
							break;
						}
					}
					if(!index) {
						fs.readFile(path.join(__dirname, "../files/signin.html"), function(err, data){
							if(err) {
								res.write("404");
							}
							else {
								res.write(data);
							}
							res.end();
						});
					}
				}
				break;
		}
	}
	else if(req.method === 'POST')
	{
		req.on('data', function(chunck){
			dataPost += chunck;
		});
		req.on('end', function(){
			var inf = qs.parse(dataPost);

			var err = "";
			var err_name = "";
			var err_id = "";
			var err_phone = "";
			var err_mail = "";

			var eng_regex = /[a-zA-Z]/;
			var num_regex = /[1-9]/;
			var name_regex = /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/;
			var id_regex = /^[1-9][0-9]{7}$/;
			var phone_regex = /^[1-9][0-9]{10}$/;
			var mail_regex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;;
			
			if(inf.name == "") err_name = "用户名不能为空！<br>";
			else if(!eng_regex.test(inf.name[0])) err_name = "用户名必须以英文字母开头！<br>";
			else if(!name_regex.test(inf.name)) err_name = "用户名必须为6~18位英文字母、数字或下划线！<br>";

			if(inf.id == "") err_id = "学号不能为空！ <br>";
			else if(!num_regex.test(inf.id[0])) err_id = "学号必须以非零数字开头！<br>";
			else if(!id_regex.test(inf.id)) err_id = "学号必须为8位数字！<br>";

			if(inf.phone == "") err_phone = "电话不能为空！<br>";
			else if(!num_regex.test(inf.phone[0])) err_phone = "电话必须以非零数字开头！<br>";
			else if(!phone_regex.test(inf.phone)) err_phone = "电话必须为11位数字！<br>";

			if(inf.mail == "") err_mail = "邮箱不能为空！<br>";
			else if(!mail_regex.test(inf.mail)) err_mail = "邮箱格式错误！<br>";

			for(var i = 0; i < infs.length; i++)
			{
				if(infs[i].name == inf.name)
				{
					err_name= "用户名 " + inf.name + " 已经被注册！<br>";
				}
				if(infs[i].id == inf.id)
				{
					err_id = "学号 " + inf.id + " 已经被注册！<br>";
				}
				if(infs[i].phone == inf.phone)
				{
					err_phone = "电话号码 " + inf.phone + " 已经被注册！<br>";
				}
				if(infs[i].mail == inf.mail)
				{
					err_mail += "邮箱 " + inf.mail + " 已经被注册！<br>";
				}
			}

			if(err_name != "" || err_id != "" || err_phone != "" || err_mail != "")
			{
				res.write("<!DOCTYPE html>");
				res.write("<html>");
				res.write("<head>");
				res.write("<title错误</title>");
				res.write("<meta http-equiv='Content-Type' content='text/html;charset=UTF-8'>");
				res.write("<link rel='stylesheet' type='text/css' href='style.css'>");
				res.write("</head>");
				res.write("<body>");
				res.write("<h1>注册</h1>");
				res.write("<form action='/' method='post'>");
				res.write("<div id='err_block'>");
				res.write("<div id='err_inline_block'>");
				res.write("<p>用户名: <input type='text' name='name' id='name' maxlength='18' value placeholder='  请设置用户名' /></p>");
			  	if (err_name != "") {
			  		res.write("<p class='err_inf' id='err_name'>"+err_name+"</p>");
			  	}
			  	res.write("<p>学号:   <input type='text' name='id' id = 'id' maxlength='8' value placeholder='  请输入学号'/></p>");
			  	if (err_id != "") {
			  		res.write("<p class='err_inf' id='err_id'>"+err_id+"</p>");
			  	}
			  	res.write("<p>电话:   <input type='text' name='phone' id = 'phone' maxlength='11' value placeholder='  可用于登陆和找回密码'/></p>");
			  	if (err_phone != "") {
			  		res.write("<p class='err_inf' id='err_phone'>"+err_phone+"</p>");
			  	}			  	
			  	res.write("<p>邮箱:   <input type='text' name='mail' id = 'mail' value placeholder='  请输入邮箱'/></p>");
			  	if (err_mail != "") {
			  		res.write("<p class='err_inf' id='err_mail'>"+err_mail+"</p>");
			  	}			  	
			  	res.write("<p class='err_inf'>部分信息错误，请重新填写</p>");
				res.write("</div>"); 
			  	res.write("<input type='reset' value='重置'' id = 'reset'/>");
			  	res.write("<input type='submit' value='提交'' id = 'submit'/>");
			  	res.write("</div>");
				res.write("</form>");
				res.write("</body>");
				res.write("</html>");
				res.end();
			}
			else {

				infs.push(inf);
				res.write("<!DOCTYPE html>");
				res.write("<html>");
				res.write("<head>");
				res.write("<title>详情</title>");
				res.write("<meta http-equiv='Content-Type' content='text/html;charset=UTF-8'>");
				res.write("<link rel='stylesheet' type='text/css' href='style.css'>");
				res.write("</head>");
				res.write("<body>");
				res.write("<h1>注册成功</h1>");
				res.write("<h2>用户详情</h2>");
				res.write("<div id='inf_block'>");
				res.write("<div id='inf_inline_block'>");
				res.write("<p>用户名: "+inf.name+"</p>");
				res.write("<p>学号: "+inf.id+"</p>");
				res.write("<p>电话: "+inf.phone+"</p>");
				res.write("<p>邮箱: "+inf.mail+"</p>");
				res.write("</div>");
				res.write("</div>");
				res.write("</body>");
				res.write("</html>");
				res.end();

				/*写入文件*/
				fs.writeFile('data.json', JSON.stringify(infs),function(err){
					if (err) {
						console.error(err);
					} else {
						console.log("write file successfully");
					}
				});
			}

			//服务器端显示
			console.log(inf.name);
			console.log(inf.id);
			console.log(inf.phone);
			console.log(inf.mail);
		});
	}
}).listen(8000);