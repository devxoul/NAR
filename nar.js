//
// NAR
// - Nginx Auto Reloader
//
// Author : Su-Yeol Jeon
// NAR is under MIT License.
//

var daemon = require( "daemon" );
var exec = require( "child_process" ).exec;
var puts = require( "util" ).puts;
var argv = process.argv;
var dir = "/etc/nar/queue/";
var interval;
var reloading;


//
// Entry
//
if( option( "-h" ) || option( "--help" ) )
{
	puts( "USAGE : nar [option]" );
	puts( "Without option, nar makes a empty file at /etc/nar/queue." );
	puts( "-d, --daemon : Start nar daemon. (Needs root permission)" );
	puts( "-i, --interval : Interval for checking directory. (With -d option)" );
	puts( "-h, --help : See this usage." );
	return;
}

if( argv.length <= 2 )
{
	enqueue();
}
else if( option( "-d" ) || option( "--daemon" ) )
{
	interval = option( "-i" ) || option( "--interval" ) || 1000;
	startDaemon();
}
else if( option( "-t" ) || option( "--terminate" ) )
{
	terminateDaemon();
}

function option( opt )
{
	var index = argv.indexOf( opt );
	if( index > -1 )
		return argv[index + 1] || true;
	return false;
}


//
// Enqueue
//

function enqueue()
{
	var cmd = "touch " + dir + getFileName();
	puts( cmd );
	exec( cmd );
}

function getFileName()
{
	var now = new Date();
	var name = now.getFullYear().toString()
		 + now.getMonth()
		 + now.getDate()
		 + now.getHours()
		 + now.getMinutes()
		 + now.getSeconds()
		 + now.getMilliseconds();
	puts( name );
	return name;
}


//
// Daemon
//
function startDaemon()
{
	var pid = daemon.start();
	setInterval( checkDir, interval );
}

function checkDir()
{
	if( reloading ) return;
	
	// Excute ls command.
	var cmd = "ls " + dir;
	puts( cmd );
	exec( cmd, function( error, stdout, stderr )
	{
		var files = stdout.split( "\n" );
		if( files.length > 1 )
			reload();
	} );
}

function reload()
{
	// Reload nginx.
	reloading = true;
	var cmd = "service nginx reload";
	puts( cmd );
	exec( cmd, function( error, stdout, stderr )
	{
		// Reloading error. (Maybe because of permission)
		if( stdout.indexOf( "nginx." ) == -1 )
		{
			puts( stdout );
			return;
		}

		puts( "reload success at " + new Date().toString() );
		
		// Remove all files at /etc/nar/queue.
		var cmd = "rm " + dir + "*";
		puts( cmd );
		exec( cmd );
		
		reloading = false;
	} );
}


//
// Terminate
//

function terminateDaemon()
{
	var cmd = "ps ax | grep 'node nar -d'";
	exec( cmd, function( error, stdout, stderr )
	{
		var pid = parseInt( stdout.split( " " )[0] );
		var cmd = "kill -9 " + pid;
		exec( cmd );
		puts( "Terminated." );
	} );
}
