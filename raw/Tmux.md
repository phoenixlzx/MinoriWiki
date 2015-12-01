title: Tmux
category: Desktop Related
---
#### My Configuration

```
set -g prefix ^a
unbind ^b
bind a send-prefix
unbind '"'
bind - splitw -v # horizontal split
unbind %
bind | splitw -h # vertical split
bind k selectp -U # select upper pane
bind j selectp -D # select lower pane
bind h selectp -L # select left pane
bind l selectp -R # select right pane
bind ^k resizep -U 10
bind ^j resizep -D 10
bind ^h resizep -L 10
bind ^l resizep -R 10
bind ^u swapp -U # swap with upper pane
bind ^d swapp -D # swap with lower pane

set -g status-right "#[fg=green]#(date)#[default] • #[fg=green]#(cut -d ' ' -f 1-3 /proc/loadavg)#[default]"
set -g status-bg black
set -g status-fg yellow
setw -g mode-keys vi
setw -g mode-mouse off
set -g terminal-overrides 'xterm*:smcup@:rmcup@'
set -g base-index 1
#set -s escape-time 0
setw -g aggressive-resize on

unbind r
bind r source-file ~/.tmux.conf

set -g history-limit 25000

#T-Mobile G2 workarounds
bind Q send-keys F1
bind W send-keys F2
bind E send-keys F3
bind R send-keys F4
bind T send-keys F5
bind Y send-keys F6
bind U send-keys F7
bind I send-keys F8
bind O send-keys F9
bind P send-keys F10
bind A send-keys F11
bind S send-keys F12

bind / send-keys |

unbind t
bind t send-keys Tab

unbind N
bind N clock-mode

unbind @
bind @ send-keys Escape

unbind H
bind H send-keys Home

unbind L
bind L send-keys End

unbind J
bind J send-keys PageDown

unbind K
bind K send-keys PageUp

#Alt-n window switching
unbind M-1
unbind M-2
unbind M-3
unbind M-4
unbind M-5
unbind M-6
unbind M-7
unbind M-8
unbind M-9
bind-key -n M-1 select-window -t :1
bind-key -n M-2 select-window -t :2
bind-key -n M-3 select-window -t :3
bind-key -n M-4 select-window -t :4
bind-key -n M-5 select-window -t :5
bind-key -n M-6 select-window -t :6
bind-key -n M-7 select-window -t :7
bind-key -n M-8 select-window -t :8
bind-key -n M-9 select-window -t :9

bind-key -n ^PageDown next-window
bind-key -n ^PageUp previous-window

#set -g default-terminal "screen-256color"
#For compatibility
set -g default-terminal "xterm-color"

##CLIPBOARD selection integration
##Requires prefix key before the command key
#Copy tmux paste buffer to CLIPBOARD
bind C-c run -b "tmux show-buffer | xclip -i -selection clipboard"
#Copy CLIPBOARD to tmux paste buffer and paste tmux paste buffer
bind C-v run "tmux set-buffer \"$(xclip -o -selection clipboard)\"; tmux paste-buffer"
```
