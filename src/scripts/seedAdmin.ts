import { prisma } from "../lib/prisma"
import { UserRole } from "../middleware/auth"

async function seedAdmin() {
    try{
        console.log("***** Admin Seeding Started.....")
        const adminData = {
            name: "Admin",
            email:"admin3@admin.com",
            role: UserRole.ADMIN,
            password: 'admin1234'
        }
        console.log("**** Checking Admin exist or not...")
        //check if the user is on database
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })
        
        if(existingUser){
            throw new Error("User already exist in db!!!")
        }
        
        
        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers:{
                "Content-type": "application/json",
                "Origin": "http://localhost:5000"
            },
            body: JSON.stringify(adminData)
        });
      
        if(signUpAdmin.ok){
            console.log("*** Admin created")
            await prisma.user.update({
                where: {
                    email:adminData.email
                },
                data: {
                    emailVerified: true
                }
            })

            console.log("**** email verification status updated....")
        }

        console.log("********  SUCCESS *******")
    
    }catch(err){
        console.error('error from seedAdmin',err)
    }
}


seedAdmin()