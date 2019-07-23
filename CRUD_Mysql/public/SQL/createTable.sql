create table user(
`id` int primary key auto_increment,
`uuid` varchar(36) NOT NULL,
`login` varchar(30) NOT NULL,
`password` varchar(30) NOT NULL,
`name` varchar(30),
`firstName` varchar(30),
`tel` varchar(30),
`mail` varchar(320) NOT NULL,
`lastConDate` datetime NOT NULL,
`createdDay` datetime NOT NULL,
`isDelete` char(1) NOT NULL DEFAULT "0"
)Engine=InnoDB;

INSERT INTO User (uuid, login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("f33c1fd8-219e-4a57-a8e0-cd0eeec6d712", "wistala", "Auronlegris1", "Martin", "Kevin ", "123456789", "kevin.martin@lenoob.com", "2019-03-25", "2019-03-25");
INSERT INTO User (uuid, login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("b1ec7ae9-c55e-4694-95ba-b89213784d3d", "auron", "abcedd", "noname", "noob", "12346987625", "kleveser@test.com", "2019-03-25", "2019-03-25");
INSERT INTO User (uuid, login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("d60a7a10-cb42-491f-b565-2203e90e0486", "erhey", "Auronelgrisss", "duo", "pain", "87416E+11", "duo.pain@tres.te", "2019-03-23", "2019-03-21");
INSERT INTO User (uuid, login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("c3c61d12-9e7c-4689-b1b8-2ea3123b78d2", "psuo", "wwqeeew", "puso", "noob", "415742573", "pasdoue@test.com", "2019-02-25", "2019-02-25");
INSERT INTO User (uuid, login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("96f6ba75-1aa0-4179-9855-35ba6f167d68", "nub", "Pauline", "pauline", "jol", "72543573587", "test.test@tes.tes", "2019-03-21", "2018-02-18");
INSERT INTO User (uuid, login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("88b49010-a827-4e67-a68c-e61179ef37e4", "Test1337", "1337", "test1337", "1337", "534387698", "1337.1337@1337.1337", "2019-03-18", "2019-03-17");
INSERT INTO User (uuid, login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("07a2f742-0a18-40f7-aefc-9a855513a070", "abcdef", "testabec", "abdce", "abdcev", "8689689253", "abc.def@ghi.jkl", "2019-02-15", "2019-01-24");
INSERT INTO User (uuid, login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("3b6a2071-e631-496e-89a1-c4ca38d63637", "DragonSlayer", "fireDragon", "Red", "DragonFi", "5375375357", "DragonFi@RedPower.com", "2019-01-28", "2019-01-23");
INSERT INTO User (uuid, login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("088f5beb-c877-4ce0-b765-3667a03e8047", "pasgentil", "Mechant", "pasbeau", "moche", "5735738966", "moche.pasbeau@pasgentil.mechant", "2018-12-25", "2018-10-29");
INSERT INTO User (uuid, login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("8794d091-ea48-4df5-a43a-b1f0cd99d4dd", "lepro", "lenoob", "dieu", "le scripteur", "213238989", "scripteurNoob@jesepascript.com", "2018-11-25", "2018-09-14");



