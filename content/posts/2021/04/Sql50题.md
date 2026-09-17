---
title: "Sql50题"
description: "Sql50题"
publishDate: 2021-04-28T14:30:00+08:00
updatedDate: "2025-03-09T14:30:00+08:00"
tags: ["Vue"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---




[b站链接](https://www.bilibili.com/video/BV1q4411G7Lw?p=5)

[解题思路](https://blog.csdn.net/zgd1239/article/details/105797892)

# Sql50题

## **1.查询课程编号为“01”的课程比“02”的课程成绩高的所有学生的学号（重点）**

SELECT a.s_id,c.`s_name`,a.s_score AS ascore,b.s_score AS bscore
FROM
(
SELECT s_id,c_id,s_score
FROM Score
WHERE c_id = '01'
) AS a
INNER JOIN
(
SELECT s_id,c_id,s_score
FROM Score
WHERE c_id = '02'
) AS b
ON a.s_id = b.s_id
INNER JOIN Student AS c ON c.`s_id` = a.s_id
WHERE a.s_score > b.s_score

inner join(等值连接) 只返回两个表中联结字段相等的行

## **2.查询平均成绩大于60分的学生的学号和平均成绩**

SELECT s_id,AVG(s_score)
FROM Score
GROUP BY s_id
HAVING AVG(s_score) > 60

## **3、查询所有学生的学号、姓名、选课数、总成绩（不重要）**

SELECT st.`s_id`,st.`s_name`,COUNT(sc.`s_id`) AS xuankeshu,SUM(sc.`s_score`) AS zongchengji
FROM Student st
JOIN Score sc
ON st.`s_id`= sc.`s_id`
GROUP BY sc.`s_id`,st.`s_name`

## **4、查询姓“猴”的老师的个数（不重要）**

SELECT COUNT(t.`t_id`)
FROM Teacher t
WHERE t.`t_name` LIKE "猴%"

注: 名字可能重复，所以用t_id

## **5、查询没学过“张三”老师课的学生的学号、姓名（重点）**

SELECT s_id,s_name 
FROM Student
WHERE s_id NOT IN

(
SELECT s_id
FROM Score
WHERE c_id=

(

SELECT c_id
FROM Course 
WHERE t_id = 

(
SELECT t_id
FROM Teacher
WHERE t_name = "张三"
)

)
)

错误答案；

因为te.t_name !='张三' 查找出另外两个老师，对应的学生

## **6、查询学过“张三”老师所教的所有课的同学的学号、姓名（重点）**

SELECT s_id,s_name 
FROM Student
WHERE s_id IN

(
SELECT s_id
FROM Score
WHERE c_id=

(

SELECT c_id
FROM Course 
WHERE t_id = 

(
SELECT t_id
FROM Teacher
WHERE t_name = "张三"
)

)
)

## **7、查询学过编号为“01”的课程并且也学过编号为“02”的课程的学生的学号、姓名（重点）**

我的答案

SELECT s_id
FROM Score
WHERE c_id = 2 IN
(
SELECT s_id
FROM Score
WHERE c_id = 1
)

错的 ，这个还包含了学了3的

**正确答案**

SELECT * 
FROM Student
WHERE s_id IN 
(
SELECT a.s_id 
FROM 
(
SELECT s_id
FROM Score
WHERE c_id = 2 
)a
INNER JOIN
(
SELECT s_id
FROM Score
WHERE c_id = 1
)b ON a.s_id = b.s_id

)

## **8、查询课程编号为“02”的总成绩（不重点）**

SELECT SUM(s_score)
FROM Score
WHERE c_id = 2

## **9、查询所有课程成绩小于60分的学生的学号、姓名**

题目的意思是他所有课都小于60分而不是所有的有挂科的人

SELECT s_id,s_name
FROM Student
WHERE s_id IN
(
SELECT s_id 
FROM Score 
WHERE s_score < 60
)

## 10.查询没有学全所有课的学生的学号、姓名(重点)

SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY,',''));这个有效
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));这个无效

很奇怪

SELECT st.*,sc.*
FROM Student AS st
LEFT JOIN Score AS sc ON st.`s_id` = sc.`s_id`
GROUP BY st.`s_id`
HAVING 
 COUNT(DISTINCT sc.`c_id`) < (SELECT COUNT(DISTINCT c_id) FROM Course);

## **11、查询至少有一门课与学号为“01”的学生所学课程相同的学生的学号和姓名（重点）**

我的答案

SELECT DISTINCT st.`s_id`,st.`s_name`
FROM Student st
LEFT JOIN Score sc ON st.`s_id` = sc.`s_id`
WHERE sc.`c_id` IN
(
	
)

漏了不能有01

示范答案

SELECT DISTINCT st.`s_id`,st.`s_name`
FROM Student st
INNER JOIN Score sc ON st.`s_id` = sc.`s_id`
WHERE sc.`c_id` IN
(
SELECT c_id
FROM Score
WHERE s_id = '01'
)
AND st.`s_id`!='01'

## **12.查询和“01”号同学所学课程完全相同的其他同学的学号(重点)**

SELECT
	s_id,
	s_name 
FROM
	student 
WHERE
	s_id IN (
	SELECT
		s_id 
	FROM
		score 
	WHERE
		s_id != '01' 
	GROUP BY
		s_id 
	HAVING
		COUNT( DISTINCT c_id ) = ( SELECT COUNT( DISTINCT c_id ) FROM score WHERE s_id = '01' ) 
	AND s_id NOT IN ( SELECT DISTINCT s_id FROM score WHERE c_id NOT IN ( SELECT c_id FROM score WHERE s_id = '01' ) ) 
	)

## **13、查询没学过"张三"老师讲授的任一门课程的学生姓名 和47题一样（重点，能做出来）**

我的答案

SELECT
	s_id,
	s_name 
FROM
	student 
WHERE
	s_id NOT IN (
	SELECT DISTINCT
		s_id 
	FROM
		score 
	WHERE
		c_id =(
		SELECT
			c_id 
		FROM
			course 
		WHERE
			t_id = ( SELECT t_id FROM teacher WHERE t_name = '张三' ) 
		) 
	)

## **15、查询两门及其以上不及格课程的同学的学号，姓名及其平均成绩（重点）**

SELECT
	* 
FROM
	student 
WHERE
	s_id IN (
	SELECT
		s_id 
	FROM
		score 
	WHERE
		NOT s_score >= 60 
	GROUP BY
		s_id 
	HAVING
	COUNT( c_id )>= 2 
	
	)

## **16、检索"01"课程分数小于60，按分数降序排列的学生信息（和34题重复，不重点）**

SELECT
	st.* 
FROM
	student AS st
	LEFT JOIN score AS sc ON st.s_id = sc.s_id 
WHERE
	sc.s_score < 60 
	AND sc.c_id = '01' 
ORDER BY
	sc.s_score DESC

## **17、按平均成绩从高到低显示所有学生的所有课程的成绩以及平均成绩(重重点与35一样)**

SELECT s_id,
MAX(case when c_id='02' THEN s_score ELSE NULL END) '数学',
MAX(case when c_id='01' THEN s_score ELSE NULL END) '语文',
MAX(case when c_id='03' THEN s_score ELSE NULL END) '英语',
AVG(s_score)
from score
GROUP BY s_id
ORDER BY AVG(s_score) DESC

## **18.查询各科成绩最高分、最低分和平均分：以如下形式显示：课程ID，课程name，最高分，最低分，平均分，及格率，中等率，优良率，优秀率**

**--及格为>=60，中等为：70-80，优良为：80-90，优秀为：>=90 (超级重点)**

SELECT sc.c_id,co.c_name,MAX(sc.s_score) max,
MIN(sc.s_score) min,
AVG(sc.s_score) avg,
avg(case when sc.s_score > 60 THEN 1.0 ELSE 0.0 end),
avg(case when sc.s_score > 70 AND sc.s_score < 80 THEN 1.0 ELSE 0.0 end),
avg(case when sc.s_score > 80 AND sc.s_score <90 THEN 1.0 ELSE 0.0 end),
avg(case when sc.s_score > 90 THEN 1.0 ELSE 0.0 end)
from score sc
LEFT JOIN course co on co.c_id = sc.c_id 
GROUP BY sc.c_id

## **19、按各科成绩进行排序，并显示排名(重点row_number)**

**row_number(）over （order by 列）**

mysql8.0窗口函数

## **20、查询学生的总成绩并进行排名（不重点）**

SELECT s_id,sum(s_score)
FROM score
GROUP BY s_id
ORDER BY sum(s_score) DESC

## **21 、查询不同老师所教不同课程平均分从高到低显示(不重点)**

SELECT c_id,AVG(s_score)
FROM score
GROUP BY c_id
ORDER BY AVG(s_score) DESC

## **22、查询所有课程的成绩第2名到第3名的学生信息及该课程成绩（重要 25类似）**

mysql8.0窗口函数

## **23、使用分段[100-85],[85-70],[70-60],[<60]来统计各科成绩，分别统计各分数段人数：课程ID和课程名称(重点和18题类似)**

## **24、查询学生平均成绩及其名次（同19题，重点）**

## **25、查询各科成绩前三名的记录（不考虑成绩并列情况）（重点 与22题类似）**

## **26、查询每门课程被选修的学生数(不重点)**

SELECT c_id,COUNT(s_id)
FROM score
GROUP BY c_id

## **27、** **查询出只有两门课程的全部学生的学号和姓名(不重点)**

	SELECT st.s_id,st.s_name,COUNT(sc.c_id)
FROM student st INNER JOIN score sc
on st.s_id = sc.s_id
GROUP BY st.s_id
HAVING COUNT(sc.c_id) = 2

我的答案

SELECT s_id,s_name
FROM student
WHERE s_id in
(
SELECT  s_id
FROM score
GROUP BY s_id
HAVING COUNT(c_id) = 2
)

## **28、查询男生、女生人数(不重点)**

SELECT s_sex,COUNT(s_sex)
FROM student
GROUP BY s_sex

## **29 查询名字中含有"风"字的学生信息（不重点）**

SELECT * 
FROM student
WHERE s_name like "%风%"

## **31、查询1990年出生的学生名单（重点year）**

方法一

SELECT *
FROM student
WHERE YEAR(s_birth) = 1990;

方法二

SELECT * FROM student WHERE s_birth LIKE "1990%"

## **32、查询平均成绩大于等于85的所有学生的学号、姓名和平均成绩（不重要）**

SELECT
	score.s_id,
	student.s_name,
	AVG( score.s_score ) 
FROM
	score
	INNER JOIN student ON score.s_id = student.s_id 
GROUP BY
	s_id 
HAVING
	AVG( score.s_score )>= 85

## **33、查询每门课程的平均成绩，结果按平均成绩升序排序，平均成绩相同时，按课程号降序排列（不重要）**

SELECT
	c_id,
	AVG( s_score ) 
FROM
	score 
GROUP BY
	c_id 
ORDER BY
	AVG( s_score ),
	c_id DESC

## **34、查询课程名称为"数学"，且分数低于60的学生姓名和分数（不重点）**

SELECT
	st.s_name,
	sc.s_score 
FROM
	score sc
	INNER JOIN student st ON st.s_id = sc.s_id
	INNER JOIN course co ON sc.c_id = co.c_id 
WHERE
	co.c_name = "数学" 
	AND sc.s_score < 60

## **35、查询所有学生的课程及分数情况（重点）**

**备注:1.因为要选出需要的字段 用case when 当co.c_name='数学' then 可以得到对应的 sc.s_core**

**2.因为GROUP UP 要与select 列一致，所以case when 加修饰max**

**3.因为最后要展现出每个同学的各科成绩为一行，所以用到case**

SELECT
	sc.s_id,
	MAX( CASE WHEN co.c_name = "数学" THEN sc.s_score ELSE NULL END ),
	MAX( CASE WHEN co.c_name = "语文" THEN sc.s_score ELSE NULL END ),
	MAX( CASE WHEN co.c_name = "英语" THEN sc.s_score ELSE NULL END ) 
FROM
	score sc
	INNER JOIN course co ON co.c_id = sc.c_id 
GROUP BY
	sc.s_id

## **36、查询任何一门课程成绩在70分以上的姓名、课程名称和分数（重点）**

SELECT
	st.s_name,
	co.c_name,
	sc.s_score 
FROM
	score sc
	LEFT JOIN student st ON sc.s_id = st.s_id
	LEFT JOIN course co ON sc.c_id = co.c_id 
WHERE
	sc.s_score > 70

## **37、查询不及格的课程并按课程号从大到小排列(不重点)**

SELECT
	st.s_name,
	co.c_name,
	sc.s_score,
	sc.c_id
FROM
	score sc
	LEFT JOIN student st ON sc.s_id = st.s_id
	LEFT JOIN course co ON sc.c_id = co.c_id 
WHERE
	sc.s_score < 60
ORDER BY sc.c_id asc

## **38、查询课程编号为03且课程成绩在80分以上的学生的学号和姓名（不重要）**

SELECT
	st.s_id,
	st.s_name 
FROM
	score sc
	LEFT JOIN student st ON sc.s_id = st.s_id 
WHERE
	sc.c_id = '03' 
	AND sc.s_score > 80

## **39、求每门课程的学生人数（不重要）**

SELECT
	c_id,
	COUNT( s_id ) 
FROM
	score 
GROUP BY
	c_id

## **40、查询选修“张三”老师所授课程的学生中成绩最高的学生姓名及其成绩（重要top）**

SQL SERVER 中用top

MYSQL 用 limit

select 筛选的是orderby 后的数

SELECT
	st.s_id,
	st.s_name,
	sc.s_score 
FROM
	course co
	INNER JOIN score sc ON co.c_id = sc.c_id
	INNER JOIN student st ON sc.s_id = st.s_id
	INNER JOIN teacher te ON co.t_id = te.t_id 
WHERE
	te.t_name = "张三" 
ORDER BY
	sc.s_score DESC 
	LIMIT 1,3

## **41.查询不同课程成绩相同的学生的学生编号、课程编号、学生成绩 （重点）**

SELECT DISTINCT
	sc1.s_id,
	sc1.c_id,
	sc1.s_score 
FROM
	score sc1
	INNER JOIN score sc2 ON sc1.s_id = sc2.s_id 
WHERE
	sc1.s_score = sc2.s_score 
	AND sc1.c_id != sc2.c_id

## **42、查询每门功成绩最好的前两名（同22和25题）**



## **43、统计每门课程的学生选修人数（超过5人的课程才统计）。要求输出课程号和选修人数，查询结果按人数降序排列，若人数相同，按课程号升序排列（不重要）**

SELECT c_id,count(c_id)
from score
GROUP BY c_id
HAVING COUNT(c_id) > 5
ORDER BY COUNT(c_id) DESC,c_id

## **44、检索至少选修两门课程的学生学号（不重要）**

SELECT s_id,COUNT(c_id)
from score
GROUP BY s_id
HAVING COUNT(c_id) >= 2

## **45、 查询选修了全部课程的学生信息（重点划红线地方）**

SELECT s_id,COUNT(c_id)
from score
GROUP BY s_id
HAVING COUNT(c_id) = (SELECT COUNT(c_id) FROM course)

## **47、查询没学过“张三”老师讲授的任一门课程的学生姓名（还可以，自己写的，答案中没有）**

SELECT
	s_name 
FROM
	student 
WHERE
	s_id NOT IN (
	SELECT
		s_id 
	FROM
		score 
	WHERE
	c_id = ( SELECT c_id FROM course WHERE t_id = ( SELECT t_id FROM teacher WHERE t_name = "张三" ) ) 
	)

**48、查询两门以上不及格课程的同学的学号及其平均成绩（还可以，自己写的，答案中没有）**

SELECT s_id,AVG(s_score)
from score
WHERE s_score <60
GROUP BY s_id
HAVING COUNT(s_score)>=2

**46、查询各学生的年龄（精确到月份）**

**备注：年份转换成月份，比如结果是1.9，ditediff** **最后取1年**

SELECT s_id,s_birth,DATEDIFF('2020-11-30',s_birth)/365
FROM student

不对，但是mysql不知道用哪个函数

**47、查询本月过生日的学生（无法使用week、date(now()）**

SELECT s_id,s_name,s_birth,MONTH(s_birth)
FROM student
WHERE MONTH(s_birth) = MONTH(NOW())

