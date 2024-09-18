import axios from "axios";
const url = "http://localhost:5000";


/* signup user */
export const signupuser = async(values)=>{
    try {
        const response = await axios.post(`${url}/signup/user/create/user`,values);
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return { error: 'No response from server. Please try again later.' };
        } else {
            return { error: 'internal server error' };
        }
    }
}

/* login user */
export const loginpuser = async(values)=>{
    try {
        const response = await axios.post(`${url}/login/user/login/user`,values);
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return { error: 'No response from server. Please try again later.' };
        } else {
            return { error: 'internal server error' };
        }
    }
}

/* get userdata */
export const userdata = async(token)=>{
    try {
        const response = await axios.get(`${url}/userdata/get/user/data`,{
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return { error: 'No response from server. Please try again later.' };
        } else {
            return { error: 'internal server error' };
        }
    }
}


/* profile data */
export const profiledata = async({token, id})=>{
    try {
        const response = await axios.get(`${url}/profile/profile/data/${id}`,{
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return { error: 'No response from server. Please try again later.' };
        } else {
            return { error: 'internal server error' };
        }
    }
}

/* change password */
export const updatepassword=async(values)=>{
    try {
        const response = await axios.post(`${url}/update/password/change/password`, values);
        return response.data
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return { error: 'No response from server. Please try again later.' };
        } else {
            return { error: 'internal server error' };
        }
    }
}

/* search users to chat */
export const searchuser = async({token, values})=>{
    try {
        const response= await axios.post(`${url}/search/user/search/user`, values,{
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        })
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return { error: 'No response from server. Please try again later.' };
        } else {
            return { error: 'internal server error' };
        }
    }
}

/* update profile */
export const updateprofile = async({token, formData})=>{
    try {
        const response = await axios.post(`${url}/update/profile/update/profile`, formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` 
            }
        })
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return { error: 'No response from server. Please try again later.' };
        } else {
            return { error: 'internal server error' };
        }
    }
};


/* participants list */

export const participants = async(token)=>{
    try {
        const response = await axios.get(`${url}/participants/participants/data`,{
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return { error: 'No response from server. Please try again later.' };
        } else {
            return { error: 'internal server error' };
        }
    }
};


/* block user */

export const blockusers = async({token, id})=>{
    try {
        const response = await axios.post(`${url}/block/users/block/user/${id}`,{},{
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return { error: 'No response from server. Please try again later.' };
        } else {
            return { error: 'internal server error' };
        }
    }
};


/* delete participant */

export const deleteparticipant = async({token, id})=>{
    try {
        const response= await axios.delete(`${url}/delete/messages/delete/participants/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return { error: 'No response from server. Please try again later.' };
        } else {
            return { error: 'internal server error' };
        }
    }
}


/* unblock users */
export const unblockusers = async({token, id})=>{
    try {
        const response = await axios.post(`${url}/unblockuser/unblock/user/${id}`,{},{
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return { error: 'No response from server. Please try again later.' };
        } else {
            return { error: 'internal server error' };
        }
    }
}


/* get user messages */
export const usermessages = async({token, id})=>{
    try {
        const response = await axios.get(`${url}/user/messages/get/user/messages/${id}`,{
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return { error: 'No response from server. Please try again later.' };
        } else {
            return { error: 'internal server error' };
        }
    }
}