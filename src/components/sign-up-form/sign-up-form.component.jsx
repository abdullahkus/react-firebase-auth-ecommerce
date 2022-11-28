import { useState } from 'react';

import './sign-up-form.styles.scss';

import Button from '../button/button.component';
import FormInput from '../form-input/form-input.component';

import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils';

// Form verileri için reaktif olmayan bir default değerler oluşturuldu.
const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUpForm = () => {
  // İlgili form verilerinin tutulacağı bir state tanımlandı ve default ve reaktif olmayan veriler başlangıç değeri olarak atandı
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields; 

  // Form verilini sıfırlamak için
  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      alert('passwords do not match');
      return;
    }

    try {
      // Bir auth instance'ı oluşturuldu
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password,
      );

      // Auth sınıfı ve ek bilgiler dökümana kayıt edildi.
      await createUserDocumentFromAuth(user, { displayName });

      resetFormFields();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use')
        alert('Cannot create user, email already in use');
      else {
        console.log('user created encountered an error', error);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className='sign-up-container'>
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label='Display Name'
          type='text'
          required
          onChange={handleChange}
          name='displayName'
          value={displayName}
        />
        <FormInput
          label='Email'
          type='email'
          required
          onChange={handleChange}
          name='email'
          value={email}
        />
        <FormInput
          label='Password'
          type='password'
          required
          onChange={handleChange}
          name='password'
          value={password}
        />
        <FormInput
          label='Confirm Password'
          type='password'
          required
          onChange={handleChange}
          name='confirmPassword'
          value={confirmPassword}
        />
        <Button type='submit'>Sign Up</Button>
      </form>
    </div>
  );
};

export default SignUpForm;
