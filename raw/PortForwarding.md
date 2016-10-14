title: PortForwarding
category: Network Configuration
time: 1470000000000
---
#### Port forwarding using iptables

```
iptables -t nat -A PREROUTING -p tcp -m tcp --dport <port> -j DNAT --to-destination <host>:<port>
```
