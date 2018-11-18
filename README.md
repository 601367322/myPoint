先启动数据库
===
> mongod -dbpath ~/Documents/mongo/data/db/

再启动服务
===
> supervisor bin/www

 systemctl start mongod