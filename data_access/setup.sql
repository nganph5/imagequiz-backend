
create schema if not exists imagequiz;

drop table if exists imagequiz.flowers;
drop table if exists imagequiz.score;
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


create table imagequiz.score
(
	id bigserial primary key,
	customer_id int references imagequiz.customer(id),
	quiz_id int references imagequiz.quiz(id),
	date timestamp not null,
	score float8 not null
);

create table imagequiz.flowers
(
	id bigserial primary key,
	name varchar(100) not null,
	picture varchar(100) not null
);
