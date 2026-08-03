---
author: Jeff Yang
pubDatetime: 2026-01-20T20:58:52.737Z
modDatetime: 2026-01-26T09:25:46.734Z
title: How to configure battery charge thresholds on Arch Linux for a Dell XPS 13 using tlp to extend battery lifespan
tags:
  - arch
  - archlinux
  - linux
  - opensource
  - dell
  - battery
  - threshold
  - simple
description: How to configure battery charge thresholds on Arch Linux for a Dell XPS 13 using tlp to extend battery lifespan.
featured: false
---

## Background

- I like Arch for the “keep it simple and know what’s installed” vibe.
- This XPS 13 is plugged in most of the time, so I want the battery to **work less** and last longer. The main trick: don’t keep it sitting at 100% charge forever.
- Everything is **open source**.

## `fastfetch` Output

```sh
[jeff@dell ~]$ fastfetch 
                  -`                     jeff@dell
                 .o+`                    ---------
                `ooo/                    OS: Arch Linux x86_64
               `+oooo:                   Host: XPS 13 9360
              `+oooooo:                  Kernel: Linux 6.18.6-arch1-1
              -+oooooo+:                 Uptime: 1 hour, 4 mins
            `/:-:++oooo+:                Packages: 567 (pacman)
           `/++++/+++++++:               Shell: bash 5.3.9
          `/++++++++++++++:              Display (SHP1449): 1920x1080 in 13", 60 Hz [Built-in]
         `/+++ooooooooooooo/`            Terminal: /dev/pts/1
        ./ooosssso++osssssso+`           CPU: Intel(R) Core(TM) i7-8550U (8) @ 4.00 GHz
       .oossssso-````/ossssss+`          GPU: Intel UHD Graphics 620 @ 1.15 GHz [Integrated]
      -osssssso.      :ssssssso.         Memory: 1012.50 MiB / 15.50 GiB (6%)
     :osssssss/        osssso+++.        Swap: 0 B / 7.75 GiB (0%)
    /ossssssss/        +ssssooo/-        Disk (/): 4.45 GiB / 912.85 GiB (0%) - ext4
  `/ossssso+/:-        -:/+osssso+-      Local IP (wlan0): 10.91.119.166/24
 `+sso+:-`                 `.-/+oso:     Battery (DELL TP1GT61): 77% [AC Connected]
`++:.                           `-/+/    Locale: en_US.UTF-8
.`                                 `/
```

## Install Arch Linux

I installed via `archinstall`. Pretty standard, just a couple choices worth calling out:

- **Disk**: `luks` encryption enabled on `/` (root partition)
- **Desktop**: `hyprland`

## Manage Battery

- Stop and mask `power-profiles` daemon, and let `tlp` manage the power (avoid two things fighting over power settings):

```sh
sudo systemctl mask --now power-profiles-daemon.service
```

- Install + enable `tlp`:

```sh
sudo pacman -S tlp
sudo systemctl enable --now tlp.service
```

- Edit `/etc/tlp.conf` and set charge thresholds:

```sh
...
# Battery charge level below which charging will begin.
START_CHARGE_THRESH_BAT0=50
# Battery charge level above which charging will stop.
STOP_CHARGE_THRESH_BAT0=60
...
```

This means charging starts when the battery drops below **50%**, and stops at **60%**. Adjust to whatever you prefer (e.g., 70→80 if you still want decent unplugged time).


- Check status:

```sh
sudo tlp-stat -b
```

On Dell laptops you should see the `dell` battery care plugin and the active threshold values (via `/sys/class/power_supply/BAT0/...`).
