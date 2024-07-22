import client from '../client'
import authStorage from '../../auth/storage'

export const addWorkSpace = async (workSpace)=>{

      const token = await authStorage.getToken();

     return await client.post('workSpaces/add',
     {workSpace},
     {
        headers:{
            Authorization: token,
        }
     })


}



export const getWorkSpaces = async ()=>{
   try {
       return await client.get('/workSpaces/get')
    
   } catch (error) {
    console.log(error)
   }
}

export const deleteSpace = async (id)=>{

   const token = await authStorage.getToken();

    return await client.delete(`workSpaces/delete/${id}`,{
        headers:{
            Authorization:token
        }
    })
}