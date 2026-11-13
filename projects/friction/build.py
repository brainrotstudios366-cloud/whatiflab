import re
s=open('/home/claude/magnets/world.html').read()
i=s.index("// ======================================================================\n// ============================ CITY SCENE")
eng=s[:i]
eng=re.sub(r"const T_GONE=3\.0,T_ENGINE.*?;\n","const T_GONE=3.0,T_COLL=13.4,T_COLLB=11.5,T_SF=19.0,T_HW=27.0,T_ALPS=34.0,T_AVAL=36.4,T_BACK=42.0,T_STOP=46.75,T_RUB=48.75,T_END=56;\n",eng,count=1)
assert 'T_COLL=' in eng
a=s.index("R=rng(7);\nconst bcols");b=s.index("const lamps=",a);b=s.index("\n",b)+1
block=s[a:b]
def fn(name):
    k=s.index("function "+name+"(");j=s.index("{",k);d=0
    for p in range(j,len(s)):
        if s[p]=='{':d+=1
        elif s[p]=='}':
            d-=1
            if d==0:return s[k:p+1]+"\n"
for nm in ['drawCitySky','cityGround','drawBuilding','drawTower','carObj','lampObj','smokeObj','treeObj']:
    block+=fn(nm)
for line in s.split('\n'):
    if line.startswith('const carCols=') or line.startswith('const shirts=') or line.startswith('const pants='):block+=line+'\n'
out=eng+block+open('part_f.js').read()
open('friction.html','w').write(out)
print(len(out))
