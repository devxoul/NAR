## NAR - Nginx Auto Reloader

### Description:
NAR allows to reload nginx without an administrator. When vhost file has changed, if users have their own vhost files, server needs to be reloaded to apply the changes. But reloading a server needs administrator's permission, so users have to wait until a server has reloaded by administrator. With NAR, these annoying tasks would be gone.    

Users can notify to NAR daemon that their vhost file has changed just by using `nar` command. Receiving a notification, NAR daemon reloads nginx automatically.

### Requirements:
* NAR is written in Node.js, so Node.js must be installed to use NAR.

### How-To:
1. First, start a NAR daemon with `$sudo node nar -d`. You can set interval by using `-i` option.
2. When vhost file has changed, run `$node nar` to notify a change.
3. If you want to terminate NAR daemon, use `$sudo node nar -t`.

### Author:
* [Su-Yeol Jeon](http://xoul.kr/)

### License:
* NAR is under MIT License.
