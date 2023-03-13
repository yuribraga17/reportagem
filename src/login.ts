import axios from 'axios';

const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const username = (<HTMLInputElement>document.querySelector('#username')).value;
  const password = (<HTMLInputElement>document.querySelector('#password')).value;

  try {
    const response = await axios.post('/login', { username, password });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
});
