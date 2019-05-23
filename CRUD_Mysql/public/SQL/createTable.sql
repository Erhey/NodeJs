create table user(
`id` int primary key auto_increment,
`login` varchar(30) NOT NULL,
`password` varchar(30) NOT NULL,
`Name` varchar(30),
`FirstName` varchar(30),
`tel` varchar(30),
`mail` varchar(320) NOT NULL,
`lastConDate` datetime NOT NULL,
`createdDay` datetime NOT NULL,
`isDelete` char(1) NOT NULL DEFAULT "0"
)Engine=InnoDB;



INSERT INTO User (login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("wistala", "Auronlegris1", "Martin", "Kevin ", "123456789", "kevin.martin@lenoob.com", "2019-03-25", "2019-03-25");
INSERT INTO User (login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("auron", "abcedd", "noname", "noob", "12346987625", "kleveser@test.com", "2019-03-25", "2019-03-25");
INSERT INTO User (login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("erhey", "Auronelgrisss", "duo", "pain", "87416E+11", "duo.pain@tres.te", "2019-03-23", "2019-03-21");
INSERT INTO User (login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("psuo", "wwqeeew", "puso", "noob", "415742573", "pasdoue@test.com", "2019-02-25", "2019-02-25");
INSERT INTO User (login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("nub", "Pauline", "pauline", "jol", "72543573587", "test.test@tes.tes", "2019-03-21", "2018-02-18");
INSERT INTO User (login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("Test1337", "1337", "test1337", "1337", "534387698", "1337.1337@1337.1337", "2019-03-18", "2019-03-17");
INSERT INTO User (login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("abcdef", "testabec", "abdce", "abdcev", "8689689253", "abc.def@ghi.jkl", "2019-02-15", "2019-01-24");
INSERT INTO User (login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("DragonSlayer", "fireDragon", "Red", "DragonFi", "5375375357", "DragonFi@RedPower.com", "2019-01-28", "2019-01-23");
INSERT INTO User (login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("pasgentil", "Mechant", "pasbeau", "moche", "5735738966", "moche.pasbeau@pasgentil.mechant", "2018-12-25", "2018-10-29");
INSERT INTO User (login, password, Name, FirstName, tel, mail, lastConDate, createdDay) VALUES ("lepro", "lenoob", "dieu", "le scripteur", "213238989", "scripteurNoob@jesepascript.com", "2018-11-25", "2018-09-14");



