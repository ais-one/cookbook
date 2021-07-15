### References


pm2 logs --timestamp --raw

pm2 start tcpd.js --time --output logs/tcpd-log.txt --error logs/tcpd-err.txt --name tcpd
pm2 stop tcpd
pm2 delete tcpd

pm2 start ftpd.js --time --output logs/ftpd-log.txt --error logs/ftpd-err.txt --name ftpd
pm2 stop ftpd
pm2 delete ftpd


device id,time from startup (s) 2 dec pl,gps time hhmmssss utc,satelites,lat,lon,kmh,roll,pitch,yaw,long accel g,lat accel g,rpm,gear ratio,gear pos,clutch,front brake,rear brake,engine brake,foot r weight,foot l weight, checksum
162,727.75,11243960,6,1.3523782,103.7447128,0.00,0.00,0.00,0.00,0.00,0.00,0.00,,0,1,1,1,0,18.90,18.90,4964
162,727.85,11243970,6,1.3523782,103.7447128,0.00,0.00,0.00,0.00,0.00,0.00,0.00,,0,1,1,1,0,18.90,18.90,4966



const [serial, Timestamp, Time, GPS_Time, Sat, Latitude, Longitude, Speed, Roll, Pitch, Z_Rate, Accx, Accy, RPM, Gear_Ratio, Calc_gear, Clutch, Front_Brake, Rear_Brake, Engine_Brake, Foot_Right, Foot_Left, checksum] = data_str.split(',')

length = 22

CREATE TABLE `sensordata` (
	`Serial` INT(10,0) NOT NULL,
	`Timestamp` DATETIME(3) NOT NULL,
	`Time` FLOAT(12) NOT NULL,
	`GPS_Time` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`Sat` FLOAT(12) NOT NULL,
	`Latitude` FLOAT(12) NOT NULL,
	`Longitude` FLOAT(12) NOT NULL,
	`Speed` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`Roll` FLOAT(12) NOT NULL,
	`Pitch` FLOAT(12) NOT NULL,
	`Z-Rate` FLOAT(12) NOT NULL,
	`Accx` FLOAT(12) NOT NULL,
	`Accy` FLOAT(12) NOT NULL,
	`RPM` FLOAT(12) NOT NULL,
	`Gear_Ratio` INT(10,0) NOT NULL,
	`Calc_gear` INT(10,0) NOT NULL,
	`Clutch` TINYINT(1) NOT NULL,
	`Front_Brake` TINYINT(1) NOT NULL,
	`Rear_Brake` TINYINT(1) NOT NULL,
	`Engine_Brake` TINYINT(1) NOT NULL,
	`Foot_Right` FLOAT(12) NOT NULL,
	`Foot_Left` FLOAT(12) NOT NULL,
	`checksum` INT(10,0) NOT NULL,
	UNIQUE INDEX `Serial` (`Serial`, `Timestamp`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;
