const { default: axios } = require('axios')

const CreateNewUser = (data) => axios.post('/api/user', data)
const LoginUser = (data) => axios.post('/api/login', data);
const GetUser = (token) => axios.get('/api/getUser', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const GetUserData = (token) => {

  return axios.get('/api/getUserData', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const UpdateUser = (data, token) => {

  return axios.put('/api/updateUser', data,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const GetQuizData = (id, token) => {

  return axios.get(`/api/getQuizData/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const GetQuizDataKids = (id, token) => {

  return axios.get(`/api/getQuizDataKids/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const SaveQuizProgress = (data, token, quizId) => {
  const payload = {
    quizId,
    results: data,
  };

  return axios.post(`/api/quizProgress`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const SaveQuizResult = (token) => {

  return axios.post('/api/quizResult', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const GetCareerQuiz = (id, token) => {

  return axios.get(`/api/getPersonalityData/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const GetCareerQuizKids = (id, token) => {

  return axios.get(`/api/getPersonalityDataKids/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const SaveCarrierQuizProgress = (data, token, quizId) => {
  const payload = {
    quizId,
    results: data,
  };

  return axios.post(`/api/carrierQuizProgress`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const SaveCareerQuizResult = (token) => {

  return axios.post(`/api/CareerQuizResult`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const InterestResult = (data) => axios.post('/api/resultTwo', data, {
  headers: {
    'Content-Type': 'application/json'
  }
})

const GetUserId=(token)=>axios.get('/api/getUserId',{
  headers: {
    Authorization: `Bearer ${token}`,
  }
});


const GetDashboarCheck = (token) => {
  return axios.get(`/api/getDashboardCheckData`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const GetResult2=(token,countryParams,industryParam)=>axios.get('/api/getresult2',{
  headers: {
    Authorization: `Bearer ${token}`,
  },
  params: {
    country: countryParams,
    industry: industryParam
  }
});

const GetIndustry = (token, params) => {

  return axios.get(`/api/getIndustry`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: params,
  });
};



const SubmitFeedback=(token,data)=>axios.post('/api/feedback',data,{
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const CheckFeedback=(token)=>axios.get('/api/feedback',{
  headers: {
    Authorization: `Bearer ${token}`,
  }
});

const SaveCarrerData = (token, data) => {
  return axios.post(`/api/saveCareer`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const GetCarrerData = (token) => {
  return axios.get(`/api/getCareer`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const GetStrengthsQuiz = (id, token) => {

  return axios.get(`/api/getStrengthsQuizData/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const SaveStrengthQuizProgress = (data, token, quizId) => {
  const payload = {
    quizId,
    results: data,
  };

  return axios.post(`/api/strengthQuizProgress`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const SaveStrengthQuizResult = (token) => {

  return axios.post(`/api/StrengthQuizResult`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const GetUserAge=(token)=>axios.get('/api/getUserAge',{
  headers: {
    Authorization: `Bearer ${token}`,
  }
});


export default {
  CreateNewUser,
  LoginUser,
  GetUser,
  GetQuizData,
  SaveQuizResult,
  InterestResult,
  GetUserId,
  GetCareerQuiz,
  SaveCareerQuizResult,
  GetDashboarCheck,
  GetResult2,
  SaveQuizProgress,
  SaveCarrierQuizProgress,
  GetUserData,
  UpdateUser,
  SubmitFeedback,
  CheckFeedback,
  SaveCarrerData,
  GetCarrerData,
  GetIndustry,
  GetStrengthsQuiz,
  SaveStrengthQuizProgress,
  SaveStrengthQuizResult,
  GetQuizDataKids,
  GetCareerQuizKids,
  GetUserAge
}