title: PHP
category: Server Configuration
---
#### PHP-FPM Installation on Ubuntu Server

```
apt-get install python-software-properties

add-apt-repository ppa:nginx/stable
add-apt-repository ppa:ondrej/php5-oldstable

apt-get update
apt-get install nginx

apt-get install php5-cgi php5-mysql php5-fpm php5-curl php5-gd php5-idn php-pear php5-imap php5-mcrypt php5-mhash php5-pspell php5-recode php5-snmp php5-sqlite php5-tidy php5-xmlrpc php5-xsl
```

#### PHP-FPM 5.3 Co-Installation on Ubuntu Server

```
PHP_VERSION=5.3.29
wget http://in1.php.net/distributions/php-$PHP_VERSION.tar.bz2
tar xvf php-$PHP_VERSION.tar.bz2
cd php-$PHP_VERSION

sudo apt-get install libxml2-dev libcurl4-openssl-dev libbz2-dev libjpeg-dev libpng12-dev libxpm-dev libfreetype6-dev libpq-dev libmariadbclient-dev pkg-config libssl-dev libmcrypt-dev

# imap not working on Ubuntu 14.04
./configure --prefix=/opt/php-5.3 --with-pdo-pgsql --with-zlib-dir --enable-mbstring --with-libxml-dir=/usr --enable-soap --enable-calendar --with-curl --with-mcrypt --with-zlib --with-gd --with-pgsql --disable-rpath --enable-inline-optimization --with-bz2 --with-zlib --enable-sockets --enable-sysvsem --enable-sysvshm --enable-pcntl --enable-mbregex --with-mhash --enable-zip --with-pcre-regex --with-mysql --with-pdo-mysql --with-mysqli --with-jpeg-dir=/usr --with-png-dir=/usr --enable-gd-native-ttf --with-openssl --with-fpm-user=www-data --with-fpm-group=www-data --enable-ftp --without-imap --without-imap-ssl --with-kerberos --with-gettext --enable-fpm --with-libdir=/lib/x86_64-linux-gnu --with-libdir=lib
make

sudo make install
```

#### PHP-FPM Installation on Debian Server

```
wget http://www.dotdeb.org/dotdeb.gpg -O - | apt-key add -

# For US-based machines
tee /etc/apt/sources.list.d/dotdeb.list << EOF
deb http://mirror.us.leaseweb.net/dotdeb/ wheezy all
deb-src http://mirror.us.leaseweb.net/dotdeb/ wheezy all
EOF

# For China-based machines:
tee /etc/apt/sources.list.d/dotdeb.list << EOF
deb http://dotdeb.90g.org/ stable all
deb-src http://dotdeb.90g.org/ stable all
EOF

apt-get update; apt-get install nginx -y

apt-get install php5-cgi php5-mysql php5-fpm php5-curl php5-gd php5-idn php-pear php5-imap php5-mcrypt php5-mhash php5-pspell php5-recode php5-snmp php5-sqlite php5-tidy php5-xmlrpc php5-xsl -y
```

#### PHP-FPM Nginx Integration

```
tee /etc/nginx/conf.d/php.conf << EOF
upstream php {
    server unix:/var/run/php5-fpm.sock;
}
EOF
```

In any site configurations:

```
    location ~ \.php?$ {
        include /etc/nginx/fastcgi_params;
        fastcgi_index index.php;
        fastcgi_pass php;
    }
```

#### Restart Server

```
service nginx restart
service php5-fpm restart
```

#### FPM Tuning

##### For Low Memory Server

```
pm = dynamic              ;Dynamic allocate child-processes for php-fpm
pm.max_children = 5       ;Limit number of child-processes
pm.start_servers = 2      ;Start 2 child-processes when server starts
pm.min_spare_servers = 2  ;Remain at least 2 when spare
pm.max_spare_servers = 5  ;Remain at most 5 when spare
pm.max_requests = 300     ;300 requests the most per child-process(and then exit and start new one)
```

(The config file is at `/etc/php5/fpm/pool.d/www.conf` by default)

#### Nginx Tuning For Fastcgi

```
fastcgi_connect_timeout 60;
fastcgi_send_timeout 180;
fastcgi_read_timeout 180;
fastcgi_buffer_size 128k;
fastcgi_buffers 4 256k;
fastcgi_busy_buffers_size 256k;
fastcgi_temp_file_write_size 256k;
fastcgi_intercept_errors on;
```

#### Remove ::ffff: From IPv4 Compatible Addresses

```
set $remote_addr_new $remote_addr;
if ($remote_addr ~* ^::ffff:(.*))
{
 set $remote_addr_new $1;
}

fastcgi_param   REMOTE_ADDR        $remote_addr_new;
```

#### Increase POST Size Limit

Edit `/etc/php5/fpm/php.ini`:

```
upload_max_filesize = 100M
post_max_size = 100M
```

References:

1. [http://apt-blog.net/best-practise-nginx-php-via-php-fpm-on-ubuntu](http://apt-blog.net/best-practise-nginx-php-via-php-fpm-on-ubuntu)
2. [http://wiki.beyondhosting.net/PHP-FPM_and_Nginx](http://wiki.beyondhosting.net/PHP-FPM_and_Nginx)
3. [http://wiki.ptsang.net/Debian%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE](http://wiki.ptsang.net/Debian%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE)
4. [http://www.wenzk.com/archives/1239](http://www.wenzk.com/archives/1239)
5. [http://hi.baidu.com/lizhm/blog/item/6c7e359bcfd515a2c8eaf434.html](http://hi.baidu.com/lizhm/blog/item/6c7e359bcfd515a2c8eaf434.html)
6. [http://rtcamp.com/wordpress-nginx/tutorials/php/increase-file-upload-size-limit/](http://rtcamp.com/wordpress-nginx/tutorials/php/increase-file-upload-size-limit/)