backend api routes : 



AuthRoutes : 

    POST /api/auth/register  //Creates a new user  
        expects name:string , email :string , password :string minimum 6 letters ,role :enum "freelancer" or "client"
    
    POST /api/auth/login //Gives jwt and client/freelancer privlidges to the logged in user  if he has the account
        expects email:string , password:string
        
    GET /api/auth/me
        expects jwt bearer token


UserRoutes :    

    GET /api/user/getUser/:id // Used to get userData by id 
        expects id 
        returns email name role and id 
    
    GET /api/user/my-user-profile //I wonder what this does
        expects jwt token 
        returns id name and role 


JobRoutes:

    POST "api/jobs/create-job", // CREATES A JOB
            expects jwt token id with role as client 
            body :  title:string , description:string budget:number 
    
    GET "api/jobs/jobs/:id", gets job by id 
        expects id:number in slug 
        returns job
    
    DELETE "api/jobs/delete-job/:id", // DELETES A JOB
        expects:
            jwt token (must be authenticated user)
            id:number in params (job id)
        rules:
            only the client who created the job can delete it
        returns:
            msg: "Job deleted successfully"

