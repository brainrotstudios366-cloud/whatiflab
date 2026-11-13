import re
s=open('/home/claude/magnets/world.html').read()
i=s.index("// ======================================================================\n// ============================ CITY SCENE")
eng=re.sub(r"const T_GONE=3\.0,T_ENGINE.*?;\n","const T_GONE=3.0,T_OCEAN=27.0,T_CRUST=34.0,T_BACK=42.0,T_RAIN=48.75,T_END=56;\n",s[:i],count=1)
a=s.index("R=rng(7);\nconst bcols");b=s.index("const lamps=",a);b=s.index("\n",b)+1
block=s[a:b]
def fn(name):
    k=s.index("function "+name+"(");j=s.index("{",k);d=0
    for p in range(j,len(s)):
        if s[p]=='{':d+=1
        elif s[p]=='}':
            d-=1
            if d==0:return s[k:p+1]+"\n"
for nm in ['drawCitySky','cityGround','drawBuilding','drawTower','carObj','lampObj','treeObj']:block+=fn(nm)
for line in s.split('\n'):
    if line.startswith('const carCols=') or line.startswith('const shirts=') or line.startswith('const pants='):block+=line+'\n'
pf=open('/home/claude/friction/part_f.js').read()
helpers=pf[:pf.index("// ======================================================================\n// ============================ CITY (POV)")]
open('oxygen.html','w').write(eng+block+helpers+open('part_o_scenes.js').read())
