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
badd +32 src/app/utils/shroom-share-api.service.ts
badd +32 ~/Documents/Prog/shroomshare-front/src/app/layout/mushrooms/mushrooms.page.ts
badd +32 ~/Documents/Prog/shroomshare-front/src/app/filters/picker/picker.component.ts
badd +1 ~/Documents/Prog/shroomshare-front/src/app/filters/filters.module.ts
badd +32 ~/Documents/Prog/shroomshare-front/src/app/filters/filters-modal/filters-modal.component.ts
badd +4 ~/Documents/Prog/shroomshare-front/src/app/filters/picker/picker.component.spec.ts
badd +11 ~/Documents/Prog/shroomshare-front/src/app/filters/picker/basepicker.component.ts
badd +21 ~/Documents/Prog/shroomshare-front/src/app/filters/filters-modal/filters-modal.component.spec.ts
argglobal
%argdel
$argadd ./
edit ~/Documents/Prog/shroomshare-front/src/app/filters/filters.module.ts
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
exe 'vert 1resize ' . ((&columns * 30 + 75) / 151)
exe 'vert 2resize ' . ((&columns * 120 + 75) / 151)
argglobal
enew
file NvimTree_1
balt ~/Documents/Prog/shroomshare-front/src/app/filters/picker/picker.component.ts
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
balt ~/Documents/Prog/shroomshare-front/src/app/filters/picker/picker.component.spec.ts
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
let s:l = 5 - ((4 * winheight(0) + 20) / 40)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 5
normal! 015|
wincmd w
2wincmd w
exe 'vert 1resize ' . ((&columns * 30 + 75) / 151)
exe 'vert 2resize ' . ((&columns * 120 + 75) / 151)
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
nohlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
