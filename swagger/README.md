# Skeleton project for Swagger UI
- https://github.com/swagger-api/swagger-node/tree/master/docs
- http://editor.swagger.io/#/, http://swagger.io/specification/#
- default yaml location : ./api/swagger/swagger.yaml
- 초기 설정 관련 : https://apihandyman.io/writing-openapi-swagger-specification-tutorial-part-8-splitting-specification-file/#editing-splitted-local-files-with-the-online-editor


## How to use it
1. npm install --global http-server swagger & npm i
2. cmd 실행 -> 현재폴더 기준 "http-server --cors ./api/swagger" 실행
3. npm run edit -> 브라우저 자동실행 -> API 내용 확인 & 테스트 진행(UI 실행)

* /config/default.yaml : 초기 설정 파일
* /api/swagger/swagger.yaml : 최종 셋팅 파일(해당 설정 path에 따른 docs 생성)
* /api/swagger/api/* : API path 설정 파일
* /api/swagger/web/* : Web path 설정 파일

##### 설치 에러 발생시
* 권한 관련 에러가 발생하면 cmd창을 관리자모드로 실행한 후 npm install을 수행한다. 
* Swagger Server/Client 실행 포트 확인
* 그 외 문법문제 발생시 http://swagger.io/specification/ OR http://editor.swagger.io/#/ 참고
* swagger-ui Pointer Resolution 설정방법 : https://apihandyman.io/writing-openapi-swagger-specification-tutorial-part-8-splitting-specification-file/
* 폴더/파일 설명 관련 : ./swagger/README.md 참고
