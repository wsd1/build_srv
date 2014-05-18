var url = require('url'),
	http = require('http'),
	fs = require('fs'),
	formidable = require('formidable'),
	spawn = require('child_process').spawn,
    exec = require('child_process').exec,
    express = require('express'),
	app = express();

var build_dir = "/mnt/tmp/"

// Convenience for allowing CORS on routes - GET only
app.all('*', function (req, res, next) {
//	res.header('Access-Control-Allow-Origin', '*');
//	res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
//	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});


app.get('/', function(req, res) {
	console.log('req /');
	res.writeHead(200, {'content-type': 'text/html'});
	res.end(
        '<h1>Select and upload addon source</h1>' +
		'<form action="/upload" enctype="multipart/form-data" method="post">'+
//		'<input type="text" name="title"><br>'+
		'<input type="file" name="upload" multiple="multiple">'+
		'<input type="submit" value="Upload">'+
		'</form>'
	);
});




app.post('/upload', function(req, res) {
	console.log('--------------------\r\n');

    var output = '';

	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		var src = files.upload.name;

        console.log('1.submit ' + src + '\r\n');

        output =  src.split('.')[0] + '.add';
		var params = [];

        params.push('/usr/local/src/build_srv/build.sh');   //cmd

		params.push(build_dir + output);  //out
		params.push('/usr/local/src/build_srv/addon_sdk_v1');   //include
		params.push('/usr/local/src/build_srv/addon_sdk_v1/addlite.ld');    //ld
		params.push(build_dir + src);



        /*

         var build_info = '', build_err = '';
         builder = spawn('/usr/local/src/build_srv/build.sh', params);
         builder.stdout.on('data', function (data) {
         build_info += data;
         });
         builder.stderr.on('data', function (data) {
         build_err += data;
         });
         builder.on("exit", function(code) {
         console.log('build result: ' + code);
         });
        */

        var cmd = params.join(' ');
        console.log('2.Issue ' + cmd);
        exec(cmd, function(err, stdout, stderr) {
            if (err) {
                res.writeHead(200, {'content-type': 'text/html'});
                res.end(err.message);
            } else {
                res.writeHead(200, {'content-type': 'text/html'});
                res.write('<p>build_info: ' + stdout + '</p>');
                res.write('<p>build_warn: ' + stderr + '</p>');
                res.end('<h3>Success!! <a href="/build/' + output + '"> download it.</a></h3>');
            }
        });
	});

	//save to build_dir
	form.on('fileBegin', function(name, file) {
		file.path = build_dir + file.name;
	});

    /*
	//err
	form.on('error', function(err) {console.error(err);	});

	form.on('end', function(){
        res.writeHead(200, {'content-type': 'text/html'});
        res.write('build_info:' + build_info);
        res.write('build_err:' + build_err);
        res.end('<a href="/build/' + output + '"> download it.<a>')
    });
    */
});


/*
app.get('/build/:filename', function(req, res) {
 res.end('downloading: ' + req.params.filename)
 });
 */

app.use('/build', express.static(build_dir));


/*
app.get('/authenticate/:code', function(req, res) {
	console.log('authenticating code:' + req.params.code);
	authenticate(req.params.code, function(err, token) {
		var result = err || !token ? {"error": "bad_code"} : { "token": token };
		console.log(result);
		res.json(result);
	});
});
*/

app.listen(8081, null, function (err) {
	console.log('addon builder, at your service: http://localhost:' + 8081);
});


