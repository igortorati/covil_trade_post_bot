import waitPort from 'wait-port';

async function checkDatabase() {
  await waitPort({ host: 'db', port: 3306, timeout: 60000 });
  console.log('MySQL is ready!');
}

checkDatabase();
