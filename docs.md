
backend api routes : 
    AuthRoutes : 

    POST /api/auth/register  //Creates a new user  
        expects name:string , email :string , password :string ,role :enum "freelancer" or "client"

    POST /api/auth/login //login 
        expects email:string , password:string
        

