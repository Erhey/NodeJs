create Database galaxy_breaker;

use galaxy_breaker


create table player (
`uuid` varchar(36) NOT NULL,
`pseudo` varchar(30) NOT NULL,
`name` varchar(30),
`firstName` varchar(30),
`tel` varchar(30),
`mail` varchar(320) NOT NULL,
`createdDay` datetime NOT NULL,
`isDelete` char(1) NOT NULL DEFAULT '0',
PRIMARY KEY (uuid)
)Engine=InnoDB;


create table game_result (
    `uuid` varchar(36) NOT NULL,
    `player_uuid` varchar(36) NOT NULL,
    `score` varchar(30) NOT NULL,
    `createdTime` datetime NOT NULL,
    `isDelete` char(1) NOT NULL DEFAULT '0',
PRIMARY KEY (uuid),
FOREIGN KEY (player_uuid)
    REFERENCES player(uuid)
);
