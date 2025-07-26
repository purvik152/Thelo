/*
* from the homepage ('/') to the signup page ('/signup').
*/
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/signup');

  return null;
}
