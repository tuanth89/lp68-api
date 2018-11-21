# 1.Install required component

## cài mongodb (trên Ubuntu và Debian based)

    $ sudo apt-get install mongo
    $ mongo
    # tạo db cho app
    $ use elearning-api
    
## cài các gói cho nodejs
    
    $ cd elearning-api
    $ npm install
    
# 2. Run Demo App

    $ node index.js
    
# 3. Test the Demo App

Mở trình duyệt và paste link sau vào 

    http://localhost:3000/todos
    
sẽ trả về kết quả là một mảng rỗng vì chưa có phần tử nào

Dùng Postman hoặc Advanced Rest Client

gửi một gói tin đến route `http://localhost:3000/todos` với nội dung :

    method: POST
    Content-Type: application/json
    body: {"task": "Task 1", "status": "in-progress"}