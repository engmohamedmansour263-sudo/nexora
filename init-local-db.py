from pathlib import Path
import re, sqlite3, json, uuid, shutil, zipfile
root=Path(__file__).resolve().parents[1]
src=(root/'supabase/migrations/0001_initial_schema.sql').read_text()
# Remove PostgreSQL-only extension, enum declarations, RLS/policies and trigger/function tail.
src=re.sub(r'create extension if not exists pgcrypto;\s*','',src,flags=re.I)
src=re.sub(r'create type public\.\w+ as enum \([^;]+;\s*','',src,flags=re.I)
src=re.sub(r'-- RLS is enabled.*', '', src, flags=re.S)
src=src.replace('public.', '')
src=src.replace('auth.users', 'local_users')
# Portable SQLite type/default conversions.
src=re.sub(r'\b(uuid|timestamptz|jsonb|bigint|smallint)\b', lambda m: {'uuid':'text','timestamptz':'text','jsonb':'text','bigint':'integer','smallint':'integer'}[m.group(1).lower()], src, flags=re.I)
src=re.sub(r'\bchar\(\d+\)', 'text', src, flags=re.I)
src=src.replace('default gen_random_uuid()', "default (lower(hex(randomblob(16))))")
src=re.sub(r'default now\(\)', "default (datetime('now'))", src, flags=re.I)
src=re.sub(r'::(?:jsonb|text)', '', src, flags=re.I)
# SQLite requires referenced table to exist first.
pre='''PRAGMA foreign_keys = ON;\nCREATE TABLE IF NOT EXISTS local_users (id text primary key, email text unique, created_at text not null default (datetime('now')));\n'''
sql=pre+src
(root/'database/local-schema.sql').write_text(sql)
db=root/'database/nexora-dev.sqlite'
if db.exists(): db.unlink()
con=sqlite3.connect(db)
try:
    con.executescript(sql)
except Exception as e:
    print('SCHEMA ERROR',e)
    raise
# Demo data only; all records are clearly non-production fixtures.
langs=[('en','English','English','ltr'),('ar','Arabic','العربية','rtl'),('hi','Hindi','हिन्दी','ltr'),('bn','Bengali','বাংলা','ltr'),('es','Spanish','Español','ltr'),('pt','Portuguese','Português','ltr')]
# migration already seeds languages and roles
# Seed a diverse, non-loan catalog matching the application calculator engine.
calculator_source=(root/'src/lib/calculators.ts').read_text()
items=re.findall(r"\{slug:'([^']+)',category:'([^']+)',name:'([^']+)',description:'([^']+)'", calculator_source)
category_ids={}
for idx,category in enumerate(sorted({x[1] for x in items}),1):
    cid='cat-'+re.sub(r'[^a-z0-9]+','-',category.lower()).strip('-')
    category_ids[category]=cid
    con.execute("INSERT INTO categories(id,category_type,sort_order,status) VALUES (?, 'calculator', ?, 'published')",(cid,idx))
    con.execute('INSERT INTO category_translations(category_id,locale,name,slug,description) VALUES(?,?,?,?,?)',(cid,'en',category,cid[4:],category+' calculators'))
for idx,(slug,category,title,desc) in enumerate(items,1):
    calc_id='calc-'+slug
    version_id='ver-'+slug+'-1'
    con.execute("INSERT INTO calculators(id,category_id,calculator_key,engine_key,is_premium,status) VALUES (?,?,?, ?,0,'published')",(calc_id,category_ids[category],slug,slug))
    con.execute('INSERT INTO calculator_translations(calculator_id,locale,title,slug,description) VALUES(?,?,?,?,?)',(calc_id,'en',title,slug,desc))
    con.execute("INSERT INTO calculator_versions(id,calculator_id,version,formula_config,is_active) VALUES (?,?,1,?,1)",(version_id, calc_id, json.dumps({'engine_key':slug,'implementation':'application-calculator-engine'})))
con.execute("INSERT INTO templates(id,category_id,format,status) VALUES ('tpl-budget','cat-business','xlsx','published')")
for loc,title,slug in [('en','Monthly Budget Planner','monthly-budget'),('ar','مخطط الميزانية الشهرية','monthly-budget-ar'),('hi','मासिक बजट योजनाकार','monthly-budget-hi'),('bn','মাসিক বাজেট পরিকল্পনাকারী','monthly-budget-bn'),('es','Planificador de presupuesto mensual','presupuesto-mensual'),('pt','Planejador de orçamento mensal','orcamento-mensal')]:
    con.execute('INSERT INTO template_translations(template_id,locale,title,slug,description) VALUES(?,?,?,?,?)',('tpl-budget',loc,title,slug,'A practical monthly budget spreadsheet.'))
con.execute("INSERT INTO template_files(id,template_id,storage_path,file_name,mime_type,version,is_paid_asset) VALUES ('file-budget-1','tpl-budget','demo/monthly-budget.xlsx','monthly-budget.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',1,0)")
con.execute("INSERT INTO products(id,product_kind,template_id,status) VALUES ('prod-budget','template','tpl-budget','published')")
for loc,title,slug in [('en','Monthly Budget Planner','monthly-budget-product'),('ar','مخطط الميزانية الشهرية','monthly-budget-product-ar'),('hi','मासिक बजट योजनाकार','monthly-budget-product-hi'),('bn','মাসিক বাজেট পরিকল্পনাকারী','monthly-budget-product-bn'),('es','Planificador de presupuesto mensual','monthly-budget-product-es'),('pt','Planejador de orçamento mensal','monthly-budget-product-pt')]:
    con.execute('INSERT INTO product_translations(product_id,locale,title,slug,description) VALUES(?,?,?,?,?)',('prod-budget',loc,title,slug,'Demo product listing; no real payment is enabled.'))
con.execute("INSERT INTO product_prices(id,product_id,currency,amount_minor,active) VALUES ('price-budget-usd','prod-budget','USD',0,1)")
con.execute("INSERT INTO plans(id,plan_key,status) VALUES ('plan-starter','starter','published')")
for loc,name in [('en','Starter'),('ar','البداية'),('hi','स्टार्टर'),('bn','স্টার্টার'),('es','Inicial'),('pt','Inicial')]: con.execute('INSERT INTO plan_translations(plan_id,locale,name,description) VALUES(?,?,?,?)',('plan-starter',loc,name,'Demo subscription plan.'))
con.execute("INSERT INTO plan_prices(id,plan_id,billing_period,currency,amount_minor) VALUES ('plan-price-usd','plan-starter','monthly','USD',999)")
# Seed the complete template library and private download assets.
template_rows = [
 ('monthly-budget','tpl-budget','Monthly Budget Planner',0),
 ('project-plan','tpl-project-plan','Project Plan',0),
 ('invoice','tpl-invoice','Invoice Register',0),
 ('content-calendar','tpl-content-calendar','Content Calendar',0),
 ('habit-tracker','tpl-habit-tracker','Habit Tracker',0),
 ('meeting-notes','tpl-meeting-notes','Meeting Notes',0),
 ('job-application','tpl-job-application','Job Application Tracker',0),
 ('inventory','tpl-inventory','Inventory Manager',1),
 ('social-media-report','tpl-social-media-report','Social Media Report',1),
 ('small-business-dashboard','tpl-small-business-dashboard','Small Business Dashboard',1),
 ('study-planner','tpl-study-planner','Study Planner',0),
 ('event-budget','tpl-event-budget','Event Budget Planner',1),
]
for slug, template_id, title, is_paid in template_rows:
    if slug != 'monthly-budget':
        con.execute("INSERT OR IGNORE INTO templates(id,category_id,format,status) VALUES (?,NULL,'csv','published')", (template_id,))
        con.execute('INSERT OR IGNORE INTO template_translations(template_id,locale,title,slug,description) VALUES(?,?,?,?,?)', (template_id,'en',title,slug,'A practical editable template for everyday workflows.'))
        con.execute('INSERT OR IGNORE INTO template_files(id,template_id,storage_path,file_name,mime_type,version,is_paid_asset) VALUES (?,?,?,?,?,1,?)', ('file-'+slug,template_id,'templates/'+slug+'.csv',slug+'.csv','text/csv',is_paid))
    else:
        con.execute("UPDATE template_files SET storage_path=?,file_name=?,mime_type='text/csv',is_paid_asset=0 WHERE id='file-budget-1'", ('templates/monthly-budget.csv','monthly-budget.csv'))
    if is_paid:
        product_id='prod-'+slug
        con.execute("INSERT OR IGNORE INTO products(id,product_kind,template_id,status) VALUES (?,'template',?,'published')", (product_id,template_id))
        con.execute('INSERT OR IGNORE INTO product_translations(product_id,locale,title,slug,description) VALUES(?,?,?,?,?)', (product_id,'en',title,slug+'-product','Premium downloadable template.'))
        con.execute("INSERT OR IGNORE INTO product_prices(id,product_id,currency,amount_minor,active) VALUES (?,?,'USD',499,1)", ('price-'+slug,product_id))

con.execute("INSERT INTO site_settings(setting_key,setting_value) VALUES ('environment','\"development\"'),('brand','\"Nexora\"')")
con.commit()
# Verify FK integrity and useful table/data counts.
fk=con.execute('PRAGMA foreign_key_check').fetchall()
assert not fk, fk
assert con.execute('select count(*) from languages').fetchone()[0]==6
assert con.execute('select count(*) from calculators').fetchone()[0]==32
assert con.execute('select count(*) from templates').fetchone()[0]==12
assert con.execute('select count(*) from template_files').fetchone()[0]==12
assert con.execute('select count(*) from products').fetchone()[0]>=1
summary={r[0]:r[1] for r in con.execute("SELECT name,(SELECT count(*) FROM sqlite_master sm2 WHERE sm2.type='table' AND sm2.name=sm1.name) FROM sqlite_master sm1 WHERE type='table'")}
print('Tables:',con.execute("select count(*) from sqlite_master where type='table'").fetchone()[0])
print('Foreign key check:', 'PASS' if not fk else fk)
print('Seed records: languages=',con.execute('select count(*) from languages').fetchone()[0], 'calculators=',con.execute('select count(*) from calculators').fetchone()[0], 'templates=',con.execute('select count(*) from templates').fetchone()[0], 'products=',con.execute('select count(*) from products').fetchone()[0])
con.close()
