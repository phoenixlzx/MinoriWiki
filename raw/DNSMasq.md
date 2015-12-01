title: DNSMasq
category: Server Configuration
---

#### DNS Server

```
no-resolv
no-poll
conf-dir=/etc/dnsmasq.d
server=8.8.4.4
server=8.8.8.8
```

#### Bogus NXDOMAIN for OpenDNS

```
#blocked nxdomain opendns.com site 67.215.65.132
bogus-nxdomain=67.215.65.132
```

#### DHCP Server

```
dhcp-range=192.168.0.100,192.168.0.200,12h
dhcp-option=option:router,192.168.0.1
dhcp-option=option:dns-server,192.168.0.1
```

#### DHCP Whitelist

```
dhcp-ignore=net:!whitelist
dhcp-host=<MAC-ADDRESS>,net:whitelist
```

#### Auto DNS Configuration For Websites Located in China

Moved to github: <https://github.com/felixonmars/dnsmasq-china-list>


