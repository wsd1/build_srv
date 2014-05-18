var spawn = require('child_process').spawn;

		var src = 'ir.c';
		var out =  src.split('.')[0] + '.add';
		var params = [];
		params.push(/tmp/' + out);
		params.push('/usr/local/src/build_srv/addon_sdk_v1');
		params.push('/usr/local/src/build_srv/addon_sdk_v1/addlite.ld');
		params.push('/tmp/' + src);

		console.log(params);

		builder = spawn('/usr/local/src/build_srv/build.sh', params);
		
		builder.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
		});

		builder.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
		});
		
		builder.on('close', function (code) {
		console.log('child process exited with code ' + code);
		});