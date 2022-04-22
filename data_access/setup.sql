
create schema if not exists imagequiz;

drop table if exists imagequiz.score;
drop table if exists imagequiz.flowers;
drop table if exists imagequiz.quiz_question;
drop table if exists imagequiz.quiz;
drop table if exists imagequiz.category;
drop table if exists imagequiz.question;
drop table if exists imagequiz.customer;


create table imagequiz.customer
(
	id bigserial primary key,
	name varchar(100) not null,
	email varchar(100) not null unique,
	password varchar(100) not null
);

create table imagequiz.question
(
	id bigserial primary key,
	picture varchar(400) not null,
	choices varchar(300) not null,
	answer varchar(100) not null
);

create table imagequiz.category
(
	id bigserial primary key,
	name varchar(400) not null
);

create table imagequiz.quiz
(
	id bigserial primary key,
	name varchar(400) not null,
	category_id int references imagequiz.category(id)
);

create table imagequiz.quiz_question
(
	quiz_id int references imagequiz.quiz(id),
	question_id int references imagequiz.question(id)
);


create table imagequiz.flowers
(
	id bigserial primary key,
	name varchar(100) not null,
	picture varchar(100) not null
);


insert into imagequiz.category (name) values 
('Top')
,('Middle')
,('Bottom');


insert into imagequiz.quiz (name, category_id) values 
('Acacia', 1)
,('Alyssum', 1)
,('Amaryllis', 1)
,('Aster', 1)
,('Azalea', 1)
,('Begonia', 1)
,('Buttercup', 1)
,('Calluna', 1)
,('Camellia', 1)
,('Cardinal', 2)
,('Carnation', 2)
,('Clover', 2)
,('Crown Imperial', 2)
,('Daffodil', 2)
,('Dahlia', 2)
,('Daisy', 2)
,('Gladiolus', 2)
,('Lantana', 2)
,('Lily', 3)
,('Lotus', 3)
,('Marigold', 3)
,('Orchid', 3)
,('Primrose', 3)
,('Sunflower', 3)
,('Tickseed', 3)
,('Tulip', 3)
,('Zinnia', 3);


insert into imagequiz.flowers (name, picture) values
('Acacia', 'https://habahram.blob.core.windows.net/flowers/acacia.jpg')
,('Alyssum', 'https://habahram.blob.core.windows.net/flowers/alyssum.jpg')
,('Amaryllis', 'https://habahram.blob.core.windows.net/flowers/amaryllis.jpg')
,('Aster', 'https://habahram.blob.core.windows.net/flowers/aster.jpg')
,('Azalea', 'https://habahram.blob.core.windows.net/flowers/azalea.jpg')
,('Begonia', 'https://habahram.blob.core.windows.net/flowers/begonia.jpg')
,('Buttercup', 'https://habahram.blob.core.windows.net/flowers/buttercup.jpg')
,('Calluna', 'https://habahram.blob.core.windows.net/flowers/calluna.jpg')
,('Camellia', 'https://habahram.blob.core.windows.net/flowers/camellia.jpg')
,('Cardinal', 'https://habahram.blob.core.windows.net/flowers/cardinal.jpg')
,('Carnation', 'https://habahram.blob.core.windows.net/flowers/carnation.jpg')
,('Clover', 'https://habahram.blob.core.windows.net/flowers/clover.jpg')
,('Crown Imperial', 'https://habahram.blob.core.windows.net/flowers/crownimperial.jpg')
,('Daffodil', 'https://habahram.blob.core.windows.net/flowers/daffodil.jpg')
,('Dahlia', 'https://habahram.blob.core.windows.net/flowers/dahlia.jpg')
,('Daisy', 'https://habahram.blob.core.windows.net/flowers/daisy.jpg')
,('Gladiolus', 'https://habahram.blob.core.windows.net/flowers/gladiolus.jpg')
,('Lantana', 'https://habahram.blob.core.windows.net/flowers/lantana.jpg')
,('Lily', 'https://habahram.blob.core.windows.net/flowers/lily.jpg')
,('Lotus', 'https://habahram.blob.core.windows.net/flowers/lotus.jpg')
,('Marigold', 'https://habahram.blob.core.windows.net/flowers/marigold.jpg')
,('Orchid', 'https://habahram.blob.core.windows.net/flowers/orchid.jpg')
,('Primrose', 'https://habahram.blob.core.windows.net/flowers/primrose.jpg')
,('Sunflower', 'https://habahram.blob.core.windows.net/flowers/sunflower.jpg')
,('Tickseed', 'https://habahram.blob.core.windows.net/flowers/tickseed.jpg')
,('Tulip', 'https://habahram.blob.core.windows.net/flowers/tulip.jpg')
,('Zinnia', 'https://habahram.blob.core.windows.net/flowers/zinnia.jpg');


insert into imagequiz.question (picture, choices, answer) values
('https://habahram.blob.core.windows.net/flowers/acacia.jpg', 'Camellia, Sunflower, Acacia' , 'Acacia')
,('https://habahram.blob.core.windows.net/flowers/alyssum.jpg', 'Daisy, Alyssum, Clover', 'Alyssum')
,('https://habahram.blob.core.windows.net/flowers/amaryllis.jpg', 'Aster, Tulip, Amaryllis', 'Amaryllis')
,('https://habahram.blob.core.windows.net/flowers/aster.jpg', 'Aster, Tickseed, Lotus', 'Aster')
,('https://habahram.blob.core.windows.net/flowers/azalea.jpg', 'Alyssum, Azalea, Camellia', 'Azalea')
,('https://habahram.blob.core.windows.net/flowers/begonia.jpg', 'Acacia, Sunflower, Begonia', 'Begonia')
,('https://habahram.blob.core.windows.net/flowers/buttercup.jpg', 'Buttercup, Primrose, Carnation', 'Buttercup')
,('https://habahram.blob.core.windows.net/flowers/calluna.jpg', 'Carnation, Calluna, Daffodil', 'Calluna')
,('https://habahram.blob.core.windows.net/flowers/camellia.jpg', 'Amaryllis, Tulip, Camellia', 'Camellia')
,('https://habahram.blob.core.windows.net/flowers/camellia.jpg', 'Cardinal, Lantana, Orchid', 'Cardinal')
,('https://habahram.blob.core.windows.net/flowers/carnation.jpg', 'Primrose, Carnation, Buttercup', 'Carnation')
,('https://habahram.blob.core.windows.net/flowers/clover.jpg', 'Clover, Zinnia, Aster', 'Clover')
,('https://habahram.blob.core.windows.net/flowers/crownimperial.jpg', 'Daisy, Crown Imperial, Begonia', 'Crown Imperial')
,('https://habahram.blob.core.windows.net/flowers/daffodil.jpg', 'Daffodil, Tickseed, Crown Imperial', 'Daffodil')
,('https://habahram.blob.core.windows.net/flowers/dahlia.jpg', 'Carnation, Alyssum, Dahlia', 'Dahlia')
,('https://habahram.blob.core.windows.net/flowers/daisy.jpg', 'Dahlia, Daisy, Marigold', 'Daisy')
,('https://habahram.blob.core.windows.net/flowers/gladiolus.jpg', 'Azalea, Gladiolus, Daffodil', 'Gladiolus')
,('https://habahram.blob.core.windows.net/flowers/lantana.jpg', 'Lantana, Tickseed, Aster', 'Lantana')
,('https://habahram.blob.core.windows.net/flowers/lily.jpg', 'Orchid, Camellia, Lily', 'Lily')
,('https://habahram.blob.core.windows.net/flowers/lotus.jpg', 'Alyssum, Lotus, Clover', 'Lotus')
,('https://habahram.blob.core.windows.net/flowers/marigold.jpg', 'Amaryllis, Marigold, Calluna', 'Marigold')
,('https://habahram.blob.core.windows.net/flowers/orchid.jpg', 'Orchid, Acacia, Crown Imperial', 'Orchid')
,('https://habahram.blob.core.windows.net/flowers/primrose.jpg', 'Begonia, Zinnia, Primrose', 'Primrose')
,('https://habahram.blob.core.windows.net/flowers/sunflower.jpg', 'Sunflower, Lily, Amaryllis', 'Sunflower')
,('https://habahram.blob.core.windows.net/flowers/tickseed.jpg', 'Buttercup, Tulip, Tickseed', 'Tickseed')
,('https://habahram.blob.core.windows.net/flowers/tulip.jpg', 'Primrose, Tulip, Clover', 'Tulip')
,('https://habahram.blob.core.windows.net/flowers/zinnia.jpg', 'Zinnia, Acacia, Lotus', 'Zinnia');


insert into imagequiz.quiz_question (quiz_id, question_id) values
(1, 1)
,(2, 2)
,(3, 3)
,(4, 4)
,(5, 5)
,(6, 6)
,(7, 7)
,(8, 8)
,(9, 9)
,(10, 10)
,(11, 11)
,(12, 12)
,(13, 13)
,(14, 14)
,(15, 15)
,(16, 16)
,(17, 17)
,(18, 18)
,(19, 19)
,(20, 20)
,(21, 21)
,(22, 22)
,(23, 23)
,(24, 24)
,(25, 25)
,(26, 26)
,(27, 27);


create table imagequiz.score
(
	id bigserial primary key,
	customer_id int references imagequiz.customer(id),
	quiz_id int references imagequiz.quiz(id),
	date timestamp not null,
	score float8 not null
);


