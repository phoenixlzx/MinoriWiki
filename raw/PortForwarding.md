title: PortForwarding
category: Network Configuration
---
#### Port forwarding using iptables

```
iptables -t nat -A PREROUTING -p tcp -m tcp --dport <port> -j DNAT --to-destination <host>:<port>
```
