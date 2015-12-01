title: NAT
category: Network Configuration
---
#### Enable IP Forwarding First

```
sed -i 's/.*net\.ipv4\.ip_forward.*/net.ipv4.ip_forward = 1/' /etc/sysctl.conf
sysctl -p
```

#### NAT using iptables

##### Recommended Way (If IP is static)

```
iptables -t nat -A POSTROUTING -s 10.0.0.0/8 -j SNAT --to-source <IP>
```

##### Another Way (OpenVZ won't work this way)

```
iptables -t nat -A POSTROUTING -s 10.0.0.0/8 -j MASQUERADE
```

Or if you want to MASQUERADE all interfaces:

```
iptables -t nat -A POSTROUTING ! -o lo -j MASQUERADE
```
