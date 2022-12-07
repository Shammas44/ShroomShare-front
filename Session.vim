let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/Documents/Prog/shroomshare-front
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +10 ~/Documents/Prog/ShroomShare/app.js
badd +3 src/app/layout/layout.page.html
badd +1 src/app/layout/camera/camera-routing.module.ts
badd +1 src/app/layout/map/map.page.html
badd +5 src/app/auth/auth.guard.ts
badd +19 src/app/app.module.ts
badd +1 src/app/layout/camera/camera.page.html
badd +55 src/app/auth/auth.service.ts
badd +4 src/app/models/user.ts
badd +1 src/app/models/auth-request.ts
badd +32 ~/Documents/Prog/ShroomShare/src/schemas/user.js
badd +9 src/app/app.component.ts
badd +14 node_modules/rxjs/src/internal/operators/delayWhen.ts
badd +1 ~/Documents/Prog/shroomshare-front/src/app/layout/mushrooms/mushrooms.page.html
badd +3 ~/Documents/Prog/shroomshare-front/src/app/layout/wiki/wiki.page.html
badd +1 ~/Documents/Prog/shroomshare-front/src/app/layout/layout.page.scss
badd +24 ~/Documents/Prog/shroomshare-front/src/global.scss
argglobal
%argdel
$argadd ./
edit ~/Documents/Prog/shroomshare-front/src/global.scss
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 30 + 86) / 173)
exe 'vert 2resize ' . ((&columns * 142 + 86) / 173)
argglobal
enew
file NvimTree_1
balt ~/Documents/Prog/shroomshare-front/src/app/layout/layout.page.scss
setlocal fdm=manual
setlocal fde=
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal nofen
wincmd w
argglobal
balt ~/Documents/Prog/shroomshare-front/src/app/layout/layout.page.scss
setlocal fdm=manual
setlocal fde=
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 29 - ((28 * winheight(0) + 20) / 41)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 29
normal! 0
wincmd w
2wincmd w
exe 'vert 1resize ' . ((&columns * 30 + 86) / 173)
exe 'vert 2resize ' . ((&columns * 142 + 86) / 173)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
