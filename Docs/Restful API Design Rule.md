> Rest Api 설계 가이드 입니다.

***

###1. URL Rules
####  * 마지막에 / 포함하지 않는다.
Bad
````
http://api.test.com/users/
````
Good
````
http://api.test.com/users
````
***

####  *  _(underbar) 대신 -(dash)를 사용한다. -(dash)의 사용도 최소한으로 설계한다. 정확한 의미나 표현을 위해 단어의 결합이 불가피한 경우 반드시 -(dash) 사용한다.
Bad
````
http://api.test.com/users/post_commnets
````
Good
````
http://api.test.com/users/post-commnets
````
***

####  *  소문자를 사용한다.
Bad
````
http://api.test.com/users/postCommnets
````
Good
````
http://api.test.com/users/post-commnets
````
***

####  * 행위(method)는 URL에 포함하지 않는다.
Bad
````
POST http://api.test.com/users/1/delete-post/1
````
Good
````
DELETE http://api.test.com/users/1/posts/1
````
***
####  * 컨트롤 자원을 의미하는 URL 예외적으로 동사를 허용한다. 함수처럼, 컨트롤 리소스를 나타내는 URL은 동작을 포함하는 이름을 짓는다.

Bad
````
http://api.test.com/posts/duplicating
````
Good
````
http://api.test.com/posts/duplicate
````
***

###2. Use HTTP methods
####  *  POST, GET, PUT, DELETE 4가지 methods는 반드시 제공한다.
|methods|POST|GET|PUT|DELETE|
|---|---|---|---|---|
|/users|사용자 추가|사용자 전체 조회|사용자 추가 or 사용자 수정|사용자 전체 삭제|
|/users/hak|405 ERROR|사용자 ‘hak’ 조회|사용자 ‘hak’ 수정|사용자 ‘hak’ 삭제|
***

####  *  OPTIONS, HEAD, PATCH를 사용하여 완성도 높은 API를 만든다.
#### 1. OPTIONS  
현재 End-point가 제공 가능한 API method를 응답한다.
````
OPTIONS /users/hak
HTTP/1.1 200 OK
Allow: GET,PUT,DELETE,OPTIONS,HEAD
````
#### 2. HEAD 
Header 정보만 응답한다. body가 없다.
````
HEAD /users
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 120
````
#### 3. PATCH 
PUT 대신 PATCH method를 사용한다. 자원의 일부를 수정할 때는 PATCH가 목적에 맞는 method다.

***

###3. Use HTTP status
#### 1. 의미에 맞는 HTTP status를 리턴한다
Bad
````
HTTP/1.1 200 OK
{
   "result" : false
   "status" : 400
}
````
status는 200으로 성공인데 body 내용엔 실패에 관한 내용을 리턴하고 있다. 모든 응답을 200으로 처리하고 body 내용으로 성공|실패를 판단하는 구조에서 사용된다. 잘못된 설계다.

Good
````
HTTP/1.1 400 Bad Request
{
   "msg" : "check your parameter"
}
````
#### 2. HTTP status만으로 상태 에러를 나타낸다
세부 에러 사항은 응답 객체에 표시하거나, 해당 에러를 확인할 수 있는 link를 표시한다.
http 상태 코드를 응답 객체에 중복으로 표시할 필요 없다.

Bad
````
HTTP/1.1 404 Not Found
{
   "code" : 404,
   "error_code": -765
}
````
Good
````
HTTP/1.1 404 Not Found
{
   "code" : -765,
   "more_info" : "https://api.test.com/errors/-765"
}
````
***

###4. Use the correct HTTP status code
  
#### 1. 성공 응답은 2XX로 응답한다.
200 : [OK]

201 : [Created] 

200과 달리 요청에 성공하고 새로운 리소스를 만든 경우에 응답한다. POST, PUT에 사용한다.

202 : [Accepted]

클라이언트 요청을 받은 후, 요청은 유효하나 서버가 아직 처리하지 않은 경우에 응답한다. 
````
HTTP/1.1 202 Accepted
{
   "links": [
      {
      "rel": "self",
      "method": "GET",
      "href":  "https://api.test.com/v1/users/3"
      }
   ]
}
````
204 : [No Content]

응답 body가 필요 없는 자원 삭제 요청(DELETE) 같은 경우 응답한다.

***

#### 2. 실패 응답은 4XX로 응답한다.
400 : [Bad Request]

클라이언트 요청이 미리 정의된 파라미터 요구사항을 위반한 경우
파라미터의 위치(path, query, body), 사용자 입력 값, 에러 이유 등을 반드시 알린다

case 1
````json
{
  "message" : "'name'(body) must be Number, input 'name': test123"
}
````
case 2
````json
{
   "errors": [
      {
         "location": "body",
         "param": "name",
         "value": "test123",
         "msg": "must be Number"
      }
   ]
}
````
401 : [Unauthorized]

403 : [Forbidden]

해당 요청은 유효하나 서버 작업 중 접근이 허용되지 않은 자원을 조회하려는 경우
접근 권한이 전체가 아닌 일부만 허용되어 요청자의 접근이 불가한 자원에 접근 시도한 경우 응답한다.

404 : [Not Found]

405 : [Method Not Allowed]

409 : [Conflict]

해당 요청의 처리가 비지니스 로직상 불가능하거나 모순이 생긴 경우

429 : [Too Many Requests]

DoS, Brute-force attack 같은 비정상적인 접근을 막기 위해 요청의 수를 제한한다.

