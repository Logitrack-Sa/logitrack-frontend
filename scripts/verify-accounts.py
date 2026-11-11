"""Prueba cuentas y roles con datos sintéticos; no imprime claves ni JWT."""
import json,secrets
from pathlib import Path
from urllib.request import Request,urlopen
from urllib.error import HTTPError
root=Path('/srv/apps/logitrack')
e=dict(l.split('=',1) for l in (root/'.env').read_text().splitlines() if l and not l.startswith('#'))
base=e['LOGITRACK_PUBLIC_URL'];checks=[]
def call(method,path,body=None,token=None,status=200):
 headers={'Accept':'application/json'}
 if token:headers['Authorization']='Bearer '+token
 if body is not None:headers['Content-Type']='application/json'
 try:r=urlopen(Request(base+path,data=json.dumps(body).encode() if body is not None else None,headers=headers,method=method),timeout=25)
 except HTTPError as ex:r=ex
 assert r.status==status,f'{method} {path}: {r.status}, esperado {status}'
 data=r.read();checks.append({'method':method,'path':path,'status':r.status})
 return json.loads(data) if data else None
admin=call('POST','/api/v1/auth/login',{'email':e['SECURITY_ADMIN_EMAIL'],'password':e['SECURITY_ADMIN_PASSWORD']})['accessToken']
page=call('GET','/api/v1/users?size=5',token=admin);assert page['size']==5 and all('passwordHash' not in u and 'password' not in u for u in page['content'])
call('GET','/api/v1/users?size=101',token=admin,status=400)
run=secrets.token_hex(6);password=secrets.token_urlsafe(22)
customer=call('POST','/api/v1/customers',{'name':'Integración '+run,'email':run+'@example.test','phone':'123456'},admin,201)
courier=call('POST','/api/v1/couriers',{'name':'Integración '+run,'dni':str(secrets.randbelow(90000000)+10000000),'vehicleType':'MOTO'},admin,201)
client_user=call('POST','/api/v1/users',{'name':'Cliente '+run,'email':'client-'+run+'@example.test','password':password,'roles':['CLIENTE'],'customerId':customer['id']},admin,201)
courier_user=call('POST','/api/v1/users',{'name':'Repartidor '+run,'email':'courier-'+run+'@example.test','password':password,'roles':['REPARTIDOR'],'courierId':courier['id']},admin,201)
client=call('POST','/api/v1/auth/login',{'email':client_user['email'],'password':password})['accessToken']
rider=call('POST','/api/v1/auth/login',{'email':courier_user['email'],'password':password})['accessToken']
assert call('GET','/api/v1/auth/me',token=client)['customerId']==customer['id']
assert call('GET','/api/v1/auth/me',token=rider)['courierId']==courier['id']
address={'street':'Prueba','number':'123','city':'Jujuy','postalCode':'4600'}
body={'customerId':customer['id'],'origin':address,'destination':address,'weightKg':2,'widthCm':20,'heightCm':20,'lengthCm':20}
shipment=call('POST','/api/v1/shipments',body,client,201);route='/api/v1/shipments/'+shipment['id']
call('PUT',route+'/courier',{'courierId':courier['id']},admin)
assert call('GET',route,token=rider)['courierId']==courier['id']
call('PATCH',route+'/status',{'status':'EN_RUTA','observation':'Integración de roles'},rider)
call('PATCH',route+'/status',{'status':'ENTREGADO'},rider)
assert call('GET',route,token=client)['status']=='ENTREGADO'
call('GET',route+'/history',token=client)
for token,path in [(client,'/api/v1/users'),(rider,'/api/v1/users'),(rider,'/api/v1/customers'),(rider,'/api/v1/couriers')]:call('GET',path,token=token,status=403)
call('PUT',route+'/courier',{'courierId':courier['id']},client,403)
other=call('POST','/api/v1/customers',{'name':'Otro '+run,'email':'other-'+run+'@example.test','phone':'123456'},admin,201)
other_body={**body,'customerId':other['id']}
call('POST','/api/v1/shipments',other_body,client,403)
other_shipment=call('POST','/api/v1/shipments',other_body,admin,201)
call('GET','/api/v1/shipments/'+other_shipment['id'],token=client,status=403)
call('GET','/api/v1/shipments/'+other_shipment['id'],token=rider,status=403)
call('POST','/api/v1/users',{'email':'duplicate-'+run+'@example.test','password':password,'roles':['CLIENTE'],'customerId':customer['id']},admin,409)
(root/'backups/accounts-integration-verification.json').write_text(json.dumps({'passed':True,'requestCount':len(checks),'checks':checks,'roles':['ADMIN','CLIENTE','REPARTIDOR']},indent=2)+'\n')
print(f'Integración completa de cuentas y roles: {len(checks)} solicitudes aprobadas.')
