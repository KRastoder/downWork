
backend api routes : 
    AuthRoutes : 

    POST /api/auth/register  //Creates a new user  
        expects name:string , email :string , password :string ,role :enum "freelancer" or "client"

    POST /api/auth/login //Gives jwt and client/freelancer privlidges to the logged in user  if he has the account
        expects email:string , password:string
        
    GET /api/auth/me
        expects jwt bearer token

