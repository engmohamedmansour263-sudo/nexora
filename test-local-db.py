from pathlib import Path
import sqlite3, unittest
DB = Path(__file__).resolve().parents[1] / 'database' / 'nexora-dev.sqlite'
class NexoraLocalDatabaseTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.db = sqlite3.connect(DB)
        cls.db.execute('PRAGMA foreign_keys=ON')
    @classmethod
    def tearDownClass(cls): cls.db.close()
    def test_six_languages(self):
        self.assertEqual(self.db.execute('select count(*) from languages').fetchone()[0], 6)
    def test_localized_calculator_catalog(self):
        rows=self.db.execute('''select t.locale,t.title from calculators c join calculator_translations t on t.calculator_id=c.id where c.calculator_key=? and c.status=?''',('percentage','published')).fetchall()
        self.assertEqual(len(rows),1)
    def test_template_product_price_relation(self):
        row=self.db.execute('''select p.id,pt.title,pr.currency,pr.amount_minor from products p join product_translations pt on pt.product_id=p.id and pt.locale='en' join product_prices pr on pr.product_id=p.id where p.id='prod-budget' ''').fetchone()
        self.assertEqual(row,('prod-budget','Monthly Budget Planner','USD',0))
    def test_all_template_assets_are_private_and_present(self):
        rows=self.db.execute('''select tt.slug,tf.storage_path,tf.is_paid_asset from templates t join template_translations tt on tt.template_id=t.id and tt.locale='en' join template_files tf on tf.template_id=t.id''').fetchall()
        self.assertEqual(len(rows),12)
        for slug,storage_path,is_paid in rows:
            asset=DB.parent.parent / 'storage' / storage_path
            self.assertTrue(asset.is_file(), f'missing template asset: {slug}')
            self.assertTrue(storage_path.startswith('templates/'))
            self.assertFalse((DB.parent.parent / 'public' / storage_path).exists())
        self.assertEqual(sum(bool(row[2]) for row in rows),4)

    def test_paid_template_products_have_prices(self):
        count=self.db.execute('''select count(*) from templates t join template_files tf on tf.template_id=t.id and tf.is_paid_asset=1 join products p on p.template_id=t.id join product_prices pp on pp.product_id=p.id and pp.active=1''').fetchone()[0]
        self.assertEqual(count,4)
        free_price=self.db.execute("select amount_minor from product_prices where id='price-budget-usd'").fetchone()[0]
        self.assertEqual(free_price,0)

    def test_crypto_payment_schema_is_idempotent_ready(self):
        cols={r[1] for r in self.db.execute('pragma table_info(crypto_payment_details)')}
        self.assertTrue({'transaction_id','payment_id','pay_address','pay_amount','pay_currency','last_status'}.issubset(cols))
        self.assertEqual(self.db.execute("select count(*) from sqlite_master where type='index' and name='idx_crypto_payment_details_status'").fetchone()[0],1)
    def test_crypto_payment_unique_provider_reference(self):
        self.db.execute('SAVEPOINT crypto_payment_test')
        try:
            self.db.execute("INSERT INTO local_users(id,email) VALUES('test-pay-user','test-pay@example.invalid')")
            self.db.execute("INSERT INTO orders(id,user_id,order_number,currency,subtotal_minor,total_minor) VALUES('test-pay-order','test-pay-user','TEST-PAY-ORDER','USD',499,499)")
            self.db.execute("INSERT INTO payment_transactions(id,order_id,provider,provider_reference,amount_minor,currency,status) VALUES('test-pay-tx','test-pay-order','nowpayments_usdt_trc20','test-provider-payment',499,'USD','waiting')")
            self.db.execute("INSERT INTO crypto_payment_details(transaction_id,payment_id,pay_address,pay_amount,pay_currency) VALUES('test-pay-tx','test-provider-payment','TTestAddress','4.99','usdttrc20')")
            with self.assertRaises(sqlite3.IntegrityError):
                self.db.execute("INSERT INTO crypto_payment_details(transaction_id,payment_id,pay_address,pay_amount,pay_currency) VALUES('test-pay-tx','test-provider-payment','TTestAddress','4.99','usdttrc20')")
        finally:
            self.db.execute('ROLLBACK TO crypto_payment_test')
            self.db.execute('RELEASE crypto_payment_test')

    def test_foreign_keys(self):
        self.assertEqual(self.db.execute('pragma foreign_key_check').fetchall(),[])
    def test_tables_exist(self):
        expected={'profiles','calculators','calculator_fields','templates','products','orders','subscriptions','entitlements','audit_logs','crypto_payment_details'}
        actual={r[0] for r in self.db.execute("select name from sqlite_master where type='table'")}
        self.assertTrue(expected.issubset(actual))
        self.assertEqual(self.db.execute('select count(*) from calculators').fetchone()[0],32)
        self.assertEqual(self.db.execute("select count(*) from calculators where calculator_key='loan-payment'").fetchone()[0],0)
if __name__=='__main__': unittest.main(verbosity=2)
