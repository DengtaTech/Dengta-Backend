ssh dengta@140.119.19.39 'docker exec mysql_production mysqldump -u dengta -p --no-data dengta > /path/to/backup.sql'

scp dengta@140.119.19.39:/path/to/backup.sql /local/path/to/backup.sql
