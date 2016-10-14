title: Nginx
category: Server Configuration
time: 1470000000000
---
#### Installation on Ubuntu Server

```
apt-get install software-properties-common

add-apt-repository ppa:nginx/stable

apt-get update; apt-get install nginx -y
```

#### Installation on Debian Server

```
wget http://www.dotdeb.org/dotdeb.gpg -O - | apt-key add -

tee /etc/apt/sources.list.d/dotdeb.list << EOF
deb http://mirror.us.leaseweb.net/dotdeb/ wheezy all
deb-src http://mirror.us.leaseweb.net/dotdeb/ wheezy all
EOF

apt-get update; apt-get install nginx -y
```

#### Proxy

```
resolver 8.8.4.4;
server {
	listen 3128;
	location / {
		proxy_pass http://$http_host$request_uri;
	}
}
```

#### Reverse Proxy

```
server {
    listen 80;
    server_name new-site.com;

    location / {
        proxy_pass http://origin-site.com/;
        proxy_redirect default;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        port_in_redirect    on;
        server_name_in_redirect off;
        proxy_connect_timeout 300;
    }
}
```

#### Cached Reverse Proxy

Make directories for cache:

```
mkdir -p /var/cache/nginx/cache
mkdir -p /var/cache/nginx/temp
```

Paste below `log_format` directive in `nginx.conf`:

```
client_body_buffer_size  512k;
proxy_connect_timeout    5;
proxy_read_timeout       60;
proxy_send_timeout       5;
proxy_buffer_size        16k;
proxy_buffers            4 64k;
proxy_busy_buffers_size 128k;
proxy_temp_file_write_size 128k;
proxy_temp_path   /var/cache/nginx/temp;
proxy_cache_path  /var/cache/nginx/cache levels=1:2 keys_zone=cache_one:500m inactive=7d max_size=30g;
```

Add to vhost configuration:

```
proxy_cache cache_one;
proxy_cache_valid  200 304 3d;
proxy_cache_key $host$uri$is_args$args;
expires 10d;
```

#### Set Expires Headers For Static Content

```
location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires 1y;
    log_not_found off;
}
```

#### Increase HTTP Post Size Limit

```
http {
    #...
    client_max_body_size 100m;
    #...
}
```

#### Set Correct Files/Folders Permissions

```
chown -R www-data:www-data .
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
```

References:

1. [http://wiki.ptsang.net/Debian%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE](http://wiki.ptsang.net/Debian%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE)
2. [http://nicholaskuechler.com/2011/04/24/nginx-how-to-set-expires-headers-for-images/](http://nicholaskuechler.com/2011/04/24/nginx-how-to-set-expires-headers-for-images/)
3. [http://www.vpsmm.com/blog-2522.html](http://www.vpsmm.com/blog-2522.html)
4. [http://rtcamp.com/wordpress-nginx/tutorials/php/increase-file-upload-size-limit/](http://rtcamp.com/wordpress-nginx/tutorials/php/increase-file-upload-size-limit/)
