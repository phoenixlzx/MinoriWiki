title: Install ArchLinux onto loopback filesystem
category: Arch Linux
---

```
mkdir /host
ntfs-3g /dev/sda5 /host
truncate -s 8G /host/diskimg/archlinux.img
mkfs -t ext4 -F /host/diskimg/archlinux.img
modprobe loop # You need this if not using official installation media
mount -o loop /host/diskimg/archlinux.img /mnt
mkdir -p /mnt/var/lib/pacman
vi /etc/pacman.d/mirrorlist
pacman -Sy
pacman -Syr /mnt
pacman -Sr /mnt base ntfs-3g net-tools wireless_tools
vi /mnt/etc/rc.conf
vi /mnt/etc/mkinitcpio.conf
mv /mnt/boot /host/diskimg/archboot
ln -s /host/diskimg/archboot /mnt/boot
```

`/mnt/lib/initcpio/hooks/looproot`

```
# vim:set ft=sh:
run_hook ()
{
	# Now mount the host filesystem
	mkdir /host
	# mount -t ntfs /dev/sda5 /host
	ntfs-3g /dev/sda5 /host

	# And the loop filesystem
	losetup /dev/loop0 /host/diskimg/archlinux.img
	mount -t ext4 /host/diskimg/archlinux.img /new_root
	mount --bind /host /new_root/host
}
```

`/mnt/lib/initcpio/install/looproot`

```
build() {
	    SCRIPT="looproot"
}

help() {
	    cat <<HELPEOF
		HELPEOF
}

# vim: set ft=sh ts=4 sw=4 et:
```

`/mnt/etc/rc.d/functions.d/omitntfs`

```
omitntfs() {
	sync
	add_omit_pids $(fuser /dev/sda5 2>/dev/null | awk '-F ' '{ print $1 }')
}

# remove fuseblk from the original NETFS variable
NETFS="nfs,nfs4,smbfs,cifs,codafs,ncpfs,shfs,fuse,glusterfs,davfs,fuse.glusterfs"

add_hook shutdown_prekillall omitntfs
add_hook single_prekillall omitntfs
```

`/mnt/etc/mkinitcpio.conf` (diff)

```
7c7
< MODULES=""
---
> MODULES="loop fuse"
14c14
< BINARIES=""
---
> BINARIES="/usr/bin/ntfs-3g"
59c59
< HOOKS="base udev autodetect pata scsi sata filesystems usbinput fsck"
---
> HOOKS="base udev autodetect pata scsi sata filesystems usbinput looproot fsck"
```

`/mnt/etc/fstab`

```
# 
# /etc/fstab: static file system information
#
# <file system> <dir>   <type>  <options>       <dump>  <pass>
/dev/loop0      /       ext4    loop            0       1
/dev/sda5       /host   ntfs    defaults        0       0
```

```
mkdir /mnt/host
for i in dev proc sys host; do mount --bind /$i /mnt/$i; done
modprobe dm-mod # You need this if you want to install GRUB
chroot /mnt
passwd
mkinitcpio -p linux
```

(Install the bootloader)

After installing the bootloader

```
exit
umount /mnt/dev /mnt/proc /mnt/sys /mnt/host /mnt /host
reboot
```

After reboot

```
exit
```

