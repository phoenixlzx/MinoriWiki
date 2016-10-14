title: SSH
category: Server Configuration
time: 1470000000000
---
#### Trust host key without /dev/tty

```
ssh -o StrictHostKeyChecking=no <username>@<server>
```

#### SSH Tunnel

##### Create New Tunnel Account

```
adduser --shell /usr/sbin/nologin --no-create-home --ingroup sshusers <username>
```

You may need to run the following command at first time.

```
addgroup sshusers
```

##### Open Local Socks Proxy

```
ssh <username>@<server> -N -D 7070 -v
```

##### Open Local Socks Proxy (The Plink Way)

```
plink <server> -N -ssh -2 -P 22 -l <username> -C -D 7070 -v -pw <password>
```

References:

1. [http://stackoverflow.com/a/15007556/646735](http://stackoverflow.com/a/15007556/646735)
