title: Linux Security
category: Server Configuration
time: 1470000000000
---

#### Reset Root Password

Add this to your (grub's kernel line or grub2's linux line) and boot:

```
init=/bin/bash
```

Then remount the filesystem and just use passwd to reset the root password:

```
mount -o remount,rw /
passwd
```

#### Sudo Without Password

`/etc/sudoers`

```
username ALL=(ALL) NOPASSWD: ALL
```


