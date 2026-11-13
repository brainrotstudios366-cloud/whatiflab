import sys
from PIL import Image
out=sys.argv[1]; ts=sys.argv[2:]; w=300; h=533; cols=5; rows=(len(ts)+cols-1)//cols
S=Image.new('RGB',(w*cols,h*rows))
for i,t in enumerate(ts):
    im=Image.open(f'rt_{t}.jpg').resize((w,h)); S.paste(im,((i%cols)*w,(i//cols)*h))
S.save(out,quality=85)
